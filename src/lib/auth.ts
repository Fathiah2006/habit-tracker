import { User, Session } from "@/src/types/auth";
import { getUsers, setUsers, setSession } from "./storage";

export function signup(
  email: string,
  password: string,
): { success: boolean; error?: string } {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: "Email and password are required" };
  }

  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return { success: false, error: "User already exists" };
  }

  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setUsers(users);

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };
  setSession(session);

  return { success: true };
}

export function login(
  email: string,
  password: string,
): { success: boolean; error?: string } {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: "Email and password are required" };
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  setSession(session);

  return { success: true };
}

export function logout(): void {
  setSession(null);
}
