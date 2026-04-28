import { User, Session } from "@/src/types/auth";
import { Habit } from "@/src/types/habit";

const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";
const HABITS_KEY = "habit-tracker-habits";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function setUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function setSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : [];
}

export function setHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
