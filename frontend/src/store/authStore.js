import { create } from "zustand";

export const authStore = create((set) => ({
  user: null,
  token: null,
  profilepic: null,
  theme: "default",

  // --- User management ---
  setUser: (userData) => {
    if (userData) {
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }
    set({ user: userData });
  },

  // --- Token management ---
  setToken: (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    set({ token });
  },

  loadUser: () => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      set({ user: JSON.parse(raw) });
    }
  },

  loadToken: () => {
    const raw = localStorage.getItem("auth_token");
    if (raw) {
      set({ token: raw });
    }
  },

  loadprofilepic: () => {
    let pp = localStorage.getItem("profilepic");
    if (pp) {
      if (pp.startsWith('"') && pp.endsWith('"')) {
        pp = pp.slice(1, -1);
        localStorage.setItem("profilepic", pp);
      }
      set({ profilepic: pp });
    }
  },

  logout: () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    set({ user: null, token: null });
  },

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
    document.documentElement.setAttribute("data-theme", theme);
  },

  loadTheme: () => {
    const saved = localStorage.getItem("theme") || "default";
    set({ theme: saved });
    document.documentElement.setAttribute("data-theme", saved);
  },
}));
