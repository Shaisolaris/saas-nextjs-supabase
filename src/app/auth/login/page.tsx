"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push("/dashboard");
  }

  return (
    <main style={{ maxWidth: 400, margin: "80px auto", padding: 20 }}>
      <h1>Sign In</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: "block", width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd" }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ display: "block", width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#000", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" }}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
    </main>
  );
}
