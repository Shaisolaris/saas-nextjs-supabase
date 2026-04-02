import { getTeamProjects } from "@/lib/supabase";

export default async function DashboardPage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
        <StatCard title="Projects" value="12" icon="📁" />
        <StatCard title="Team Members" value="5" icon="👥" />
        <StatCard title="Storage Used" value="2.4 GB" icon="💾" />
      </div>
      <h2 style={{ marginTop: 32 }}>Recent Projects</h2>
      <p style={{ color: "#666" }}>Your team projects will appear here.</p>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div style={{ padding: 24, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#666" }}>{title}</div>
    </div>
  );
}
