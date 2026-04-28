import { test } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", () => {});
  test("redirects authenticated users from / to /dashboard", () => {});
  test("prevents unauthenticated access to /dashboard", () => {});
  test("signs up a new user and lands on the dashboard", () => {});
  test("logs in an existing user and loads only that user's habits", () => {});
  test("creates a habit from the dashboard", () => {});
  test("completes a habit for today and updates the streak", () => {});
  test("persists session and habits after page reload", () => {});
  test("logs out and redirects to /login", () => {});
  test("loads the cached app shell when offline after the app has been loaded once", () => {});
});
