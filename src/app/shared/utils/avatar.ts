const escapeSvg = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const initialsFrom = (label: string): string => {
  const parts = label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return 'HP';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

export const buildDefaultAvatarDataUrl = (seed: string, label: string): string => {
  const normalizedSeed = Array.from(seed || label || 'hippoject').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = normalizedSeed % 360;
  const initials = escapeSvg(initialsFrom(label || seed || 'Hippoject'));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${initials}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 70% 55%)"/><stop offset="1" stop-color="hsl(${(hue + 45) % 360} 72% 68%)"/></linearGradient></defs><rect width="96" height="96" rx="24" fill="url(#g)"/><text x="48" y="54" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const resolveAvatarUrl = (avatarUrl: string | null | undefined, seed: string, label: string): string =>
  avatarUrl?.trim() || buildDefaultAvatarDataUrl(seed, label);
