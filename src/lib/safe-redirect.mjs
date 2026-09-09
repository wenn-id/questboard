export function safeNextPath(value, fallback = "/app/profile/edit") {
  const raw = (typeof value === "string" ? value : "").trim();

  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return fallback;
  }

  return raw;
}
