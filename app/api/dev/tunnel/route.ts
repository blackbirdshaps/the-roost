import { NextResponse } from "next/server";
import { blockInProduction } from "../../../../lib/dev-only";

// Backend for the dev drawer's tunnel step: report the public URL sign-in
// redirects back to, and whether the tunnel is actually up. Two environments:
//   • Codespaces — GitHub forwards every port to a public HTTPS URL and injects
//     the parts to build it, so there's nothing to start and no probe.
//   • local dev  — the Flynet dev tunnel (`flynet dev`). Its public address is
//     REDIRECT_URI minus /callback (the dev setup / maker-token redemption
//     writes REDIRECT_URI), and we probe that URL to see if it's live.
// Dev-only — see lib/dev-only.ts.

type TunnelStatus = {
  running: boolean;
  url: string | null;
  kind: "codespaces" | "flynet";
};

export async function GET() {
  const blocked = blockInProduction();
  if (blocked) return blocked;

  // Codespaces wins when present: the public URL is derivable straight from the
  // env GitHub injects — no tunnel to start, no probe. These are platform-runtime
  // signals (not app config), so they're read here rather than via lib/env.ts.
  const name = process.env.CODESPACE_NAME;
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
  if (name && domain) {
    return NextResponse.json({
      running: true,
      url: `https://${name}-3000.${domain}`,
      kind: "codespaces",
    } satisfies TunnelStatus);
  }

  // The Flynet dev tunnel's public address is REDIRECT_URI without /callback.
  const redirect = process.env.REDIRECT_URI?.trim();
  const url = redirect
    ? redirect.replace(/\/callback\/?$/, "").replace(/\/+$/, "")
    : null;

  // No REDIRECT_URI yet → we don't know the tunnel URL, so report it as not
  // running and let the UI show the "start the tunnel" prompt.
  if (!url) {
    return NextResponse.json({
      running: false,
      url: null,
      kind: "flynet",
    } satisfies TunnelStatus);
  }

  // Probe the tunnel URL: any HTTP response means it resolved (the tunnel is up);
  // a connection error or timeout means it's down. A 5s cap guards a wedged
  // request. HEAD keeps it cheap; manual redirect avoids chasing hops.
  let running = false;
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    running = res.status > 0;
  } catch {
    running = false;
  }

  return NextResponse.json({ running, url, kind: "flynet" } satisfies TunnelStatus);
}
