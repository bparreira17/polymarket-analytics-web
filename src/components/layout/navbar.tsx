"use client";

import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Activity, Sparkles, LogIn, User } from "lucide-react";
import { NotificationPanel } from "./notification-panel";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Markets", href: "/markets" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Whales", href: "/whales" },
  { label: "Arbitrage", href: "/arbitrage" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <HeroNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      height="3.5rem"
      classNames={{
        base: "bg-background/70 backdrop-blur-2xl border-b border-white/[0.06] fixed z-50",
        wrapper: "px-6 gap-6",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-md shadow-blue-500/25">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight leading-none">
              Poly<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">Analytics</span>
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-0.5" justify="center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <NavbarItem key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-white/[0.08] text-foreground"
                    : "text-default-500 hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <SignedOut>
          <NavbarItem>
            <Button
              as={Link}
              href="/sign-in"
              size="sm"
              radius="lg"
              variant="flat"
              className="text-white/70 text-xs font-medium h-8 px-3"
              startContent={<LogIn className="w-3 h-3" />}
            >
              Sign In
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="/pricing"
              size="sm"
              radius="lg"
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs font-semibold h-8 px-4 shadow-lg shadow-blue-500/20"
              startContent={<Sparkles className="w-3 h-3" />}
            >
              Upgrade
            </Button>
          </NavbarItem>
        </SignedOut>
        <SignedIn>
          <NavbarItem>
            <NotificationPanel />
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="/pricing"
              size="sm"
              radius="lg"
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs font-semibold h-8 px-4 shadow-lg shadow-blue-500/20"
              startContent={<Sparkles className="w-3 h-3" />}
            >
              Upgrade
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="/account"
              size="sm"
              radius="lg"
              variant="flat"
              className="text-white/70 text-xs font-medium h-8 px-3"
              startContent={<User className="w-3 h-3" />}
            >
              Account
            </Button>
          </NavbarItem>
          <NavbarItem>
            <UserButton
              appearance={{
                elements: { avatarBox: "w-7 h-7" },
              }}
            />
          </NavbarItem>
        </SignedIn>
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur-2xl pt-4">
        {navLinks.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              className="w-full py-2"
              color={pathname === link.href ? "primary" : "foreground"}
              href={link.href}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroNavbar>
  );
}
