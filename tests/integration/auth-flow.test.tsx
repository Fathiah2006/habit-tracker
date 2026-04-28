import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LoginForm from "@/src/components/auth/LoginForm";
import SignupForm from "@/src/components/auth/SignupForm";
import { getSession, getUsers } from "@/src/lib/storage";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockReplace = vi.fn();

beforeEach(() => {
  localStorage.clear();
  mockReplace.mockClear();
  (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
    replace: mockReplace,
  });
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("test@example.com");
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    render(<SignupForm />);

    // First signup
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "dupe@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => expect(getSession()).not.toBeNull());

    // Clear session, re-render and try same email
    localStorage.removeItem("habit-tracker-session");
    render(<SignupForm />);

    fireEvent.change(screen.getAllByTestId("auth-signup-email")[1], {
      target: { value: "dupe@example.com" },
    });
    fireEvent.change(screen.getAllByTestId("auth-signup-password")[1], {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getAllByTestId("auth-signup-submit")[1]);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "User already exists",
      );
    });
  });

  it("submits the login form and stores the active session", async () => {
    // Pre-create a user
    const { signup } = await import("@/src/lib/auth");
    signup("login@example.com", "pass123");
    localStorage.removeItem("habit-tracker-session");

    render(<LoginForm />);
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "login@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "pass123" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("login@example.com");
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password",
      );
    });
  });
});
