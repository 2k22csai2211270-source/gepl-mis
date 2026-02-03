

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
}

/* ================= DASHBOARD API ================= */
export async function getDashboardSummary() {
  const res = await fetch(`${BASE_URL}/api/kpi/org`, {
    headers: authHeaders()
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to fetch dashboard");
  }

  return res.json();
}

export async function getProjectDashboard(projectId) {
  const res = await fetch(
    `${BASE_URL}/api/kpi/projects/${projectId}`,
    { headers: authHeaders() }
  );

  if (!res.ok) throw new Error("Failed to load project dashboard");

  return res.json();
}