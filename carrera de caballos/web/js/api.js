/**
 * Cliente API para Carreras de Caballos (auth, salas, puntos).
 */
const API = {
  baseUrl: window.API_URL || '',

  async request(method, path, body, token) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (token) opts.headers.Authorization = 'Bearer ' + token;
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    const res = await fetch(API.baseUrl + path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  },

  getToken() { return localStorage.getItem('carrera_token'); },
  setToken(t) { if (t) localStorage.setItem('carrera_token', t); else localStorage.removeItem('carrera_token'); },
  getUser() { try { return JSON.parse(localStorage.getItem('carrera_user') || 'null'); } catch { return null; } },
  setUser(u) { localStorage.setItem('carrera_user', JSON.stringify(u)); },

  async register(email, password, displayName) {
    const data = await API.request('POST', '/api/auth/register', { email, password, displayName });
    API.setToken(data.token);
    API.setUser(data.user);
    return data;
  },
  async login(email, password) {
    const data = await API.request('POST', '/api/auth/login', { email, password });
    API.setToken(data.token);
    API.setUser(data.user);
    return data;
  },
  logout() { API.setToken(null); API.setUser(null); },

  async getMe() {
    return API.request('GET', '/api/users/me', null, API.getToken());
  },
  async createRoom(entryPrice, trackLength, suit) {
    return API.request('POST', '/api/rooms/create', { entryPrice, trackLength, suit }, API.getToken());
  },
  async joinRoom(code, suit) {
    return API.request('POST', '/api/rooms/join', { code, suit }, API.getToken());
  },
  async getRoom(code) {
    return API.request('GET', '/api/rooms/' + encodeURIComponent(code), null, API.getToken());
  },
  async purchasePoints() {
    return API.request('POST', '/api/points/purchase', {}, API.getToken());
  },
  async getPackages() {
    return API.request('GET', '/api/points/packages', null, API.getToken());
  }
};

window.API = API;
