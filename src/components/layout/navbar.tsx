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
  Chip,
} from "@heroui/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "Markets", href: "/markets" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Whale Tracker", href: "/whales" },
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
      classNames={{
        base: "bg-background/80 backdrop-blur-lg border-b border-default-100",
        item: "data-[active=true]:text-primary",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">PolyAnalytics</span>
            <Chip size="sm" variant="flat" color="primary" className="ml-1">
              Beta
            </Chip>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {navLinks.map((link) => (
          <NavbarItem key={link.href} isActive={pathname === link.href}>
            <Link
              href={link.href}
              color={pathname === link.href ? "primary" : "foreground"}
              size="sm"
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/pricing"
            variant="flat"
            size="sm"
          >
            Upgrade to Pro
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {navLinks.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              className="w-full"
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
