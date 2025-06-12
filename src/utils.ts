export const MANAGEMENT_BASE = `https://mapi.storyblok.com/v1/spaces/${process.env.STORYBLOK_SPACE_ID}`;
export const CDN_BASE = 'https://api.storyblok.com/v2/cdn';
export const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || '';
export const PUBLIC_TOKEN = process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN || '';

export function getHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

export function buildURL(base: string, path: string) {
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

export function toQuery(params: Record<string, any>) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");
  return q ? `?${q}` : "";
}