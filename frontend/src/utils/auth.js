export function addAuthHeader(request) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      request.headers.set('X-User-Id', userId);
    }
    return request;
  }
  
export async function fetchWithAuth(url, options = {}) {
    const request = new Request(url, options);
    addAuthHeader(request);
    return fetch(request);
  }
  