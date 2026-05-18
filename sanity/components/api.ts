export const SECRET_TOKEN = 'd5a7a32586755e828a338457a2524288';

export function getApiUrl(path: string): string {
  if (typeof window !== 'undefined') {
    const isStandalone = window.location.port === '3333' || window.location.hostname.endsWith('sanity.studio');
    if (isStandalone) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://localhost:3000${path}`;
      }
      return `https://www.nihongoroute.my.id${path}`;
    }
  }
  return path;
}
