const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `Request failed: ${res.status}`);
    err.body = body;
    throw err;
  }
  return body;
}

export const api = {
  health: () => request("/health"),
  programs: {
    list: () => request("/programs"),
    create: (data) => request("/programs", { method: "POST", body: JSON.stringify(data) }),
  },
  schools: {
    list: () => request("/schools"),
    create: (data) => request("/schools", { method: "POST", body: JSON.stringify(data) }),
  },
  participants: {
    list: () => request("/participants"),
    create: (data) => request("/participants", { method: "POST", body: JSON.stringify(data) }),
  },
  activities: {
    list: () => request("/activities"),
    get: (id) => request(`/activities/${id}`),
    create: (data) => request("/activities", { method: "POST", body: JSON.stringify(data) }),
  },
  assessments: {
    list: () => request("/assessments"),
    create: (data) => request("/assessments", { method: "POST", body: JSON.stringify(data) }),
  },
  dashboard: () => request("/dashboard"),
  sync: (records) => request("/sync", { method: "POST", body: JSON.stringify({ records }) }),
  evaluation: (programId) =>
    request(programId ? `/evaluation/${programId}` : "/evaluation"),
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || "Failed to upload photo");
    return body;
  },
};

