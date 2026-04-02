"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [name, setName] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) { setError(error.message); setLoading(false); }
    else router.push("/dashboard");
  }

  return (
    <main style={{ maxWidth: 400, margin: "80px auto", padding: 20 }}>
      <h1>Create Account</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={{ display: "block", width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd" }} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: "block", width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd" }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={{ display: "block", width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd" }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#000", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" }}>{loading ? "Creating..." : "Create Account"}</button>
      </form>
    </main>
  );
}
