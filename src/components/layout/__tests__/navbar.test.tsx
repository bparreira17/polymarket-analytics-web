import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock @clerk/nextjs
const mockSignedIn = vi.fn();
const mockSignedOut = vi.fn();

vi.mock("@clerk/nextjs", () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) =>
    mockSignedIn() ? <>{children}</> : null,
  SignedOut: ({ children }: { children: React.ReactNode }) =>
    mockSignedOut() ? <>{children}</> : null,
  UserButton: () => <div data-testid="user-button" />,
}));

// Mock HeroUI - simplified component stubs
vi.mock("@heroui/react", () => ({
  Navbar: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  NavbarBrand: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavbarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavbarItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavbarMenuToggle: () => null,
  NavbarMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavbarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  Button: ({ children, ...props }: { children: React.ReactNode; as?: unknown; href?: string; [key: string]: unknown }) => {
    const href = props.href as string | undefined;
    return href ? <a href={href}>{children}</a> : <button>{children}</button>;
  },
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Activity: () => <span />,
  Sparkles: () => <span />,
  LogIn: () => <span />,
}));

import { Navbar } from "@/components/layout/navbar";

describe("Navbar", () => {
  it("shows Sign In button when signed out", () => {
    mockSignedIn.mockReturnValue(false);
    mockSignedOut.mockReturnValue(true);

    render(<Navbar />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("shows UserButton when signed in", () => {
    mockSignedIn.mockReturnValue(true);
    mockSignedOut.mockReturnValue(false);

    render(<Navbar />);

    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("shows Upgrade button for signed-in users", () => {
    mockSignedIn.mockReturnValue(true);
    mockSignedOut.mockReturnValue(false);

    render(<Navbar />);

    // The signed-in navbar still shows "Upgrade" button
    expect(screen.getByText("Upgrade")).toBeInTheDocument();
  });

  it("shows Upgrade button for signed-out users too", () => {
    mockSignedIn.mockReturnValue(false);
    mockSignedOut.mockReturnValue(true);

    render(<Navbar />);

    expect(screen.getByText("Upgrade")).toBeInTheDocument();
  });
});
