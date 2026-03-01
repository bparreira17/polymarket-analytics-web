import { Link } from "@heroui/react";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-default-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-default-500">
              PolyAnalytics &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-default-500">
            <Link href="/pricing" size="sm" color="foreground">
              Pricing
            </Link>
            <Link href="/docs" size="sm" color="foreground">
              API Docs
            </Link>
            <Link
              href="https://twitter.com"
              size="sm"
              color="foreground"
              isExternal
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
