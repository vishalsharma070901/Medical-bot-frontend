const SESSION_ID_KEY = "session_id";
const SESSION_ID_CREATED_AT_KEY = "session_id_created_at";
const ONE_HOUR_MS = 60 * 60 * 1000;

function isSessionExpired(): boolean {
  const createdAt = localStorage.getItem(SESSION_ID_CREATED_AT_KEY);
  if (!createdAt) return true;
  const created = parseInt(createdAt, 10);
  if (Number.isNaN(created)) return true;
  return Date.now() - created >= ONE_HOUR_MS;
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId || isSessionExpired()) {
    if (sessionId) {
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(SESSION_ID_CREATED_AT_KEY);
    }
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(SESSION_ID_CREATED_AT_KEY, String(Date.now()));
  }

  return sessionId;
}

export function clearSessionId(): void {
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_ID_CREATED_AT_KEY);
}