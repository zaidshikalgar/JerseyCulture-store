export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:5000/api';
export async function apiRequest(path, init = {}, token) {
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.body) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const message = data && typeof data === 'object' && 'message' in data
            ? String(data.message)
            : `Request failed with status ${response.status}`;
        throw new Error(message);
    }
    return data;
}
