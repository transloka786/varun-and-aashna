import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  const fallback = "14022026";
  const expected = process.env.SITE_PASSWORD || fallback;

  const ok = password && password === expected;
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("va_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
