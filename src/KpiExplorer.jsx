import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// -----------------------------------------------------------------------
// THIS IS THE "MIGRATED PAGE" PATTERN — the one referenced throughout
// this session's architecture discussion.
//
// How it differs from every other page in the app right now:
//   1. Data loads ONCE, on mount, from your own backend (currently a
//      bundled sample file — swap the import for a real fetch() to your
//      Express API, which reads from the same source that feeds Power BI).
//   2. Every click below (switching metric, sorting) runs in memory,
//      in the browser. No network request. No Power BI. No capacity.
//
// To connect this to real data: replace the `sampleData` import with:
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     fetch("https://tairuzz-backend-.../api/kpi-summary", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("tairuzz_auth")}` }
//     })
//       .then(r => r.json())
//       .then(setData);
//   }, []);
// Everything below this point stays identical.
// -----------------------------------------------------------------------

import sampleData from "../data/sample_kpis.json";

const METRICS = [
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "xG", label: "xG" },
  { key: "passesCompleted", label: "Passes completed" }
];

export default function KpiExplorer() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState("goals");
  const [loaded, setLoaded] = useState(false);

  // Simulates the one-time load. In production this is your fetch() call.
  useEffect(() => {
    setData(sampleData);
    setLoaded(true);
  }, []);

  // Every metric switch below just re-sorts data already in memory —
  // no request, no loading state, no dependency on anything external.
  const sorted = useMemo(() => {
    return [...data].sort((a, b) => b[metric] - a[metric]).slice(0, 8);
  }, [data, metric]);

  return (
    <div style={{ padding: "24px", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 500, margin: 0 }}>KPI explorer</h2>
        <span style={{
          fontSize: "12px", color: "#2E7D32", background: "#EAF6EC",
          padding: "4px 10px", borderRadius: "12px", fontWeight: 500
        }}>
          Always available — no live report capacity needed
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            style={{
              padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
              border: metric === m.key ? "1px solid #1F3864" : "1px solid #ccc",
              background: metric === m.key ? "#1F3864" : "#fff",
              color: metric === m.key ? "#fff" : "#333",
              fontSize: "13px"
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <div style={{ color: "#888", fontSize: "14px" }}>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={sorted} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="player" width={140} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey={metric} fill="#2ED9A8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      <p style={{ fontSize: "12px", color: "#888", marginTop: "16px" }}>
        Switching the metric above re-sorts data already loaded in your browser —
        no server call, no Power BI, nothing that can be asleep.
      </p>
    </div>
  );
}
