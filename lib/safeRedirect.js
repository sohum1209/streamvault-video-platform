export function getSafeCallbackUrl(raw, fallback = "/") {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 2048) {
    return fallback;
  }

  let decoded = raw;
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      return fallback;
    }
  }

  if (
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("\\") ||
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(decoded) ||
    /%[0-9a-f]{2}/i.test(decoded)
  ) {
    return fallback;
  }

  try {
    const url = new URL(decoded, "http://safe.local");
    if (url.origin !== "http://safe.local") {
      return fallback;
    }

    const safeUrl = `${url.pathname}${url.search}${url.hash}`;
    const resolvedSafeUrl = new URL(safeUrl, "http://safe.local");
    if (resolvedSafeUrl.origin !== "http://safe.local") {
      return fallback;
    }

    if (
      resolvedSafeUrl.pathname === "/login" ||
      resolvedSafeUrl.pathname.startsWith("/login/")
    ) {
      return fallback;
    }

    return `${resolvedSafeUrl.pathname}${resolvedSafeUrl.search}${resolvedSafeUrl.hash}`;
  } catch {
    return fallback;
  }
}
