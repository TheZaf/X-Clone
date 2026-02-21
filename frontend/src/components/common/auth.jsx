
export const fetchAuthUser = async () => {
  const res = await fetch("/api/auth/me");
  const data = await res.json();

  if (!res.ok) throw new Error("Failed to fetch auth user");
  return data;
};