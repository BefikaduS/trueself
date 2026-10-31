"use client";

// Trueself has no login. Each browser is identified by a random id kept
// only in localStorage, used to scope personal notes/check-ins and to
// list "my reports" for history. It is never used to identify the person.
const KEY = "trueself.anonymousId";

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
