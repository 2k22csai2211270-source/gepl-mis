const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ================= LOGIN ================= */
export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  return res.json();
}
