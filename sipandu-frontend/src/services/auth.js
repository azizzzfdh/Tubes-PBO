export function sanitizeUser(user) {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

export function saveUser(user) {
  const safeUser = sanitizeUser(user);
  localStorage.setItem("user", JSON.stringify(safeUser));
}

export function updateSavedUser(patch) {
  const current = getUser() || {};
  saveUser({ ...current, ...sanitizeUser(patch) });
  return getUser();
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!getUser();
}
