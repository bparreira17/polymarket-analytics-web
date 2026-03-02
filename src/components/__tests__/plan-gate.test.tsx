import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock @clerk/nextjs
vi.mock("@clerk/nextjs", () => ({
  useAuth: vi.fn(() => ({ isSignedIn: true, getToken: vi.fn() })),
}));

// Mock use-user hook
const mockUseUserPlan = vi.fn();
vi.mock("@/hooks/use-user", () => ({
  useUserPlan: () => mockUseUserPlan(),
}));

// Mock HeroUI
vi.mock("@heroui/react", () => ({
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Lock: () => <span data-testid="lock-icon" />,
  Sparkles: () => <span data-testid="sparkles-icon" />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import { PlanGate } from "@/components/plan-gate";
import { useAuth } from "@clerk/nextjs";

describe("PlanGate", () => {
  it("renders children when user has required plan", () => {
    mockUseUserPlan.mockReturnValue({ data: { plan: "pro" }, isLoading: false });

    render(
      <PlanGate requiredPlan="pro">
        <div data-testid="protected-content">Secret content</div>
      </PlanGate>,
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("renders upgrade prompt when user has insufficient plan", () => {
    mockUseUserPlan.mockReturnValue({ data: { plan: "free" }, isLoading: false });

    render(
      <PlanGate requiredPlan="pro">
        <div data-testid="protected-content">Secret content</div>
      </PlanGate>,
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByText(/Pro Feature/i)).toBeInTheDocument();
  });

  it("renders upgrade prompt when not signed in", () => {
    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: false,
      getToken: vi.fn(),
    } as unknown as ReturnType<typeof useAuth>);
    mockUseUserPlan.mockReturnValue({ data: undefined, isLoading: false });

    render(
      <PlanGate requiredPlan="pro">
        <div data-testid="protected-content">Secret content</div>
      </PlanGate>,
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("handles custom fallback component", () => {
    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
      getToken: vi.fn(),
    } as unknown as ReturnType<typeof useAuth>);
    mockUseUserPlan.mockReturnValue({ data: { plan: "free" }, isLoading: false });

    render(
      <PlanGate
        requiredPlan="enterprise"
        fallback={<div data-testid="custom-fallback">Custom upgrade message</div>}
      >
        <div>Protected</div>
      </PlanGate>,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom upgrade message")).toBeInTheDocument();
  });
});
