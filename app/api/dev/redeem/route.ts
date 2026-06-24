import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { blockInProduction } from "../../../../lib/dev-only";

// Backend for the dev drawer's "redeem a maker token" shortcut. Instead of
// pasting each credential by hand, the developer pastes a one-time maker token
// (mk_otk_…); we exchange it for their real Blackbird credentials server-side
// and write them into .env.local — the secret never reaches the browser or the
// agent's conversation. Dev-only — see lib/dev-only.ts.

const ENV_PATH = join(process.cwd(), ".env.local");
// The maker portal that mints and redeems one-time keys.
const REDEEM_URL = "https://make.flynet.org/api/maker/redeem-key";

// The .env.local keys we know how to set. The redeem response field names aren't
// pinned, so for each target we accept a few likely aliases (snake/camel, with
// or without a flynet_ prefix) and read from a `credentials`/`env` wrapper too.
const FIELD_ALIASES: Record<string, string[]> = {
  FLYNET_API_KEY: [
    "FLYNET_API_KEY",
    "api_key",
    "apiKey",
    "key",
    "discovery_api_key",
    "flynet_api_key",
  ],
  FLYNET_CLIENT_ID: [
    "FLYNET_CLIENT_ID",
    "client_id",
    "clientId",
    "oauth_client_id",
    "flynet_client_id",
  ],
  FLYNET_CLIENT_SECRET: [
    "FLYNET_CLIENT_SECRET",
    "client_secret",
    "clientSecret",
    "oauth_client_secret",
    "flynet_client_secret",
  ],
  FLYNET_MERCHANT_ID: [
    "FLYNET_MERCHANT_ID",
    "merchant_id",
    "merchantId",
    "flynet_merchant_id",
  ],
  REDIRECT_URI: [
    "REDIRECT_URI",
    "redirect_uri",
    "redirectUri",
    "redirect_url",
    "redirectUrl",
    "callback_url",
    "callbackUrl",
    "callback_uri",
  ],
};

function pick(source: Record<string, unknown>, aliases: string[]): string | null {
  for (const a of aliases) {
    const v = source[a];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

// Replace every existing line for `name` with a single fresh one (deduping any
// pre-existing repeats), or append it if absent. Mirrors app/api/dev/env.
function upsertEnv(contents: string, name: string, value: string): string {
  const line = `${name}="${value}"`;
  const isKeyLine = new RegExp(`^${name}=`);
  const lines = contents.split("\n");
  const out: string[] = [];
  let placed = false;
  for (const l of lines) {
    if (isKeyLine.test(l)) {
      if (!placed) {
        out.push(line);
        placed = true;
      }
      continue;
    }
    out.push(l);
  }
  if (!placed) {
    if (out.length && out[out.length - 1] === "") out.splice(-1, 0, line);
    else out.push(line);
  }
  return out.join("\n");
}

// POST { token } → redeem the token, write whatever credentials come back to
// .env.local, and report which fields were set (names only — never values).
export async function POST(req: Request) {
  const blocked = blockInProduction();
  if (blocked) return blocked;

  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json(
      { error: "Paste a maker token (mk_otk_…)." },
      { status: 400 },
    );
  }

  // Exchange the one-time token for the real credentials.
  let res: Response;
  try {
    res = await fetch(REDEEM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the maker redemption service." },
      { status: 502 },
    );
  }

  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) {
    const msg =
      (data &&
        (typeof data.message === "string"
          ? data.message
          : typeof data.error === "string"
            ? data.error
            : null)) || `Redemption failed (HTTP ${res.status}).`;
    return NextResponse.json({ error: msg }, { status: res.status });
  }
  if (!data || typeof data !== "object") {
    return NextResponse.json(
      { error: "The redemption service returned an unexpected response." },
      { status: 502 },
    );
  }

  // Credentials may sit at the top level or under a wrapper.
  const wrapper =
    (data.credentials as Record<string, unknown>) ??
    (data.env as Record<string, unknown>) ??
    (data.app as Record<string, unknown>) ??
    data;

  const updates: Record<string, string> = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const value = pick(wrapper, aliases);
    if (value) updates[field] = value;
  }

  if (Object.keys(updates).length === 0) {
    // Don't echo values — just the field names we saw, so we can refine the
    // alias map without leaking anything.
    return NextResponse.json(
      {
        error:
          "Token redeemed, but no recognizable credentials were in the response.",
        responseFields: Object.keys(wrapper),
      },
      { status: 422 },
    );
  }

  // Write to .env.local (create if missing) and mirror into the running process
  // so the drawer's status reflects them before Next reloads the file.
  let contents = "";
  try {
    contents = await readFile(ENV_PATH, "utf8");
  } catch {
    contents = "";
  }
  for (const [name, value] of Object.entries(updates)) {
    contents = upsertEnv(contents, name, value);
    process.env[name] = value;
  }
  if (!contents.endsWith("\n")) contents += "\n";
  try {
    await writeFile(ENV_PATH, contents, "utf8");
  } catch {
    return NextResponse.json(
      { error: "Couldn't write the credentials to .env.local." },
      { status: 500 },
    );
  }

  return NextResponse.json({ applied: Object.keys(updates) });
}
