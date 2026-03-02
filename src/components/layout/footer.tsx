import { Link } from "@heroui/react";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-default-400">
              PolyAnalytics &copy; {new Date().getFullYear()} &middot; Not financial advice
            </span>
          </div>
          <div className="flex gap-5 text-xs text-default-500">
            <Link href="/pricing" size="sm" color="foreground" className="text-xs">
              Pricing
            </Link>
            <Link href="/docs" size="sm" color="foreground" className="text-xs">
              API
            </Link>
            <Link href="https://twitter.com" size="sm" color="foreground" isExternal className="text-xs">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
