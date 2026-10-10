/**
 * Frontend API client service for PeerCraft
 */

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return json;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // AI Team Finder
  findTeam: (payload) =>
    request('/team-finder', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Profiles
  getProfiles: (skill = '') => request(`/profiles${skill ? `?skill=${encodeURIComponent(skill)}` : ''}`),
  getCurrentProfile: () => request('/profiles/me'),
  getProfileById: (id) => request(`/profiles/${id}`),
  updateProfile: (id, updates) =>
    request(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Resources
  getResources: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/resources${qs ? `?${qs}` : ''}`);
  },
  createResource: (resource) =>
    request('/resources', {
      method: 'POST',
      body: JSON.stringify(resource),
    }),
  upvoteResource: (id) =>
    request(`/resources/${id}/upvote`, {
      method: 'POST',
    }),
  downloadResource: (id) =>
    request(`/resources/${id}/download`, {
      method: 'POST',
    }),

  // Campus Credits & Ledger
  getCreditBalance: (studentId) => request(`/credits/balance/${studentId}`),
  getCreditLedger: (studentId) => request(`/credits/ledger/${studentId}`),
  getCreditRules: () => request('/credits/rules'),
  recordTransaction: (transaction) =>
    request('/credits/transaction', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),

  // Trust & Reputation
  getReputation: (studentId) => request(`/reputation/${studentId}`),
  submitPeerReview: (review) =>
    request('/reputation/review', {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // Dashboard
  getDashboard: (studentId) => request(`/dashboard/${studentId}`),
};
