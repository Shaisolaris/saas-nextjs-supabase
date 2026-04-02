import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: 48, marginBottom: 16 }}>SaaS Platform</h1>
      <p style={{ fontSize: 20, color: "#666", marginBottom: 32 }}>Next.js 14 + Supabase + Stripe. Auth, teams, projects, billing, storage.</p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <Link href="/auth/register" style={{ padding: "12px 32px", background: "#000", color: "#fff", borderRadius: 8, textDecoration: "none" }}>Get Started</Link>
        <Link href="/auth/login" style={{ padding: "12px 32px", border: "1px solid #ddd", borderRadius: 8, textDecoration: "none", color: "#000" }}>Sign In</Link>
      </div>
    </main>
  );
}
