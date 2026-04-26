/**
 * AlKahafSession — central place for persisted auth vs tab-scoped flow state.
 *
 * localStorage (survives refresh): accessToken, refreshToken, user (header/cache only).
 * sessionStorage (tab lifetime): password reset token, post-registration email hint.
 *
 * Large API payloads (lists, dashboards, course catalogs) stay in page script memory
 * (variables / closures) — do not mirror them into localStorage.
 */
(function (global) {
  'use strict';

  var LS = {
    ACCESS: 'accessToken',
    REFRESH: 'refreshToken',
    USER: 'user',
    /** Legacy localStorage keys for OTP flows — migrated into sessionStorage */
    LEGACY_RESET: 'passwordResetToken',
    LEGACY_EMAIL: 'registeredEmail',
  };

  var SS = {
    RESET: 'alkahaf_ss_passwordResetToken',
    EMAIL: 'alkahaf_ss_registeredEmail',
  };

  function safeParseUser(str) {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  /** Normalize /auth/me style responses to a user object */
  function normalizeUserPayload(body) {
    if (!body || typeof body !== 'object') return null;
    if (body.data && body.data.user) return body.data.user;
    if (body.data && body.data.firstName !== undefined) return body.data;
    if (body.user) return body.user;
    if (body.firstName !== undefined || body.email) return body;
    return null;
  }

  var Session = {
    getAccessToken: function () {
      return global.localStorage.getItem(LS.ACCESS);
    },

    setAccessToken: function (token) {
      if (token) global.localStorage.setItem(LS.ACCESS, token);
      else global.localStorage.removeItem(LS.ACCESS);
    },

    getRefreshToken: function () {
      return global.localStorage.getItem(LS.REFRESH);
    },

    setRefreshToken: function (token) {
      if (token) global.localStorage.setItem(LS.REFRESH, token);
      else global.localStorage.removeItem(LS.REFRESH);
    },

    setTokens: function (accessToken, refreshToken) {
      Session.setAccessToken(accessToken);
      Session.setRefreshToken(refreshToken);
    },

    getUser: function () {
      return safeParseUser(global.localStorage.getItem(LS.USER));
    },

    setUser: function (user) {
      if (user) global.localStorage.setItem(LS.USER, JSON.stringify(user));
      else global.localStorage.removeItem(LS.USER);
    },

    /**
     * Shallow-merge fields into the stored user object (e.g. after profile PATCH).
     */
    mergeUser: function (partial) {
      var cur = Session.getUser() || {};
      Object.assign(cur, partial || {});
      Session.setUser(cur);
    },

    setSessionFromLogin: function (accessToken, refreshToken, user) {
      Session.setAccessToken(accessToken);
      if (refreshToken) Session.setRefreshToken(refreshToken);
      Session.setUser(user);
    },

    /**
     * Clears auth keys and tab flow keys. Does not touch cart, theme, or donation keys.
     */
    clearAuth: function () {
      global.localStorage.removeItem(LS.ACCESS);
      global.localStorage.removeItem(LS.REFRESH);
      global.localStorage.removeItem(LS.USER);
      global.localStorage.removeItem(LS.LEGACY_RESET);
      global.localStorage.removeItem(LS.LEGACY_EMAIL);
      try {
        global.sessionStorage.removeItem(SS.RESET);
        global.sessionStorage.removeItem(SS.EMAIL);
      } catch (e) { /* private mode */ }
    },

    setPasswordResetToken: function (token) {
      try {
        global.sessionStorage.setItem(SS.RESET, token);
      } catch (e) { /* fallback */ }
      global.localStorage.removeItem(LS.LEGACY_RESET);
    },

    getPasswordResetToken: function () {
      try {
        var t = global.sessionStorage.getItem(SS.RESET);
        if (t) return t;
      } catch (e) { /* ignore */ }
      var legacy = global.localStorage.getItem(LS.LEGACY_RESET);
      if (legacy) {
        try {
          global.sessionStorage.setItem(SS.RESET, legacy);
        } catch (e2) { /* ignore */ }
        global.localStorage.removeItem(LS.LEGACY_RESET);
      }
      return legacy || null;
    },

    removePasswordResetToken: function () {
      try {
        global.sessionStorage.removeItem(SS.RESET);
      } catch (e) { /* ignore */ }
      global.localStorage.removeItem(LS.LEGACY_RESET);
    },

    setRegisteredEmail: function (email) {
      try {
        global.sessionStorage.setItem(SS.EMAIL, email);
      } catch (e) { /* ignore */ }
      global.localStorage.removeItem(LS.LEGACY_EMAIL);
    },

    getRegisteredEmail: function () {
      try {
        var e = global.sessionStorage.getItem(SS.EMAIL);
        if (e) return e;
      } catch (err) { /* ignore */ }
      var leg = global.localStorage.getItem(LS.LEGACY_EMAIL);
      if (leg) {
        try {
          global.sessionStorage.setItem(SS.EMAIL, leg);
        } catch (e2) { /* ignore */ }
        global.localStorage.removeItem(LS.LEGACY_EMAIL);
      }
      return leg || null;
    },

    /** Read email hint for login autofill and clear it (one-shot). */
    consumeRegisteredEmail: function () {
      var e = Session.getRegisteredEmail();
      try {
        global.sessionStorage.removeItem(SS.EMAIL);
      } catch (err) { /* ignore */ }
      global.localStorage.removeItem(LS.LEGACY_EMAIL);
      return e;
    },

    normalizeUserPayload: normalizeUserPayload,
  };

  global.AlKahafSession = Session;

  /**
   * In-memory store for the current document only (cleared on every full page load).
   * Use for API list/detail payloads; never put large responses in localStorage.
   */
  var pageVault = {};
  global.AlKahafPageData = {
    set: function (key, value) {
      pageVault[key] = value;
      return value;
    },
    get: function (key) {
      return pageVault[key];
    },
    clear: function (key) {
      if (key === undefined || key === null) {
        pageVault = {};
      } else {
        delete pageVault[key];
      }
    },
  };
})(typeof window !== 'undefined' ? window : this);
