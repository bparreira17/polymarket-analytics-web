import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface MarketData {
  title: string;
  description?: string;
  outcomes: Array<{ name: string; price: number }>;
  platform: string;
  imageUrl?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/api/markets/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};

    const { data: market } = (await res.json()) as { data: MarketData };
    const price = market.outcomes?.[0]?.price;
    const priceStr = price != null ? `${(price * 100).toFixed(0)}%` : "";

    return {
      title: `${market.title} | PolyAnalytics`,
      description: `${priceStr} — ${market.description || market.title}. Real-time prediction market analytics on PolyAnalytics.`,
      openGraph: {
        title: `${market.title} ${priceStr}`,
        description: market.description || market.title,
        ...(market.imageUrl ? { images: [{ url: market.imageUrl }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${market.title} ${priceStr}`,
        description: market.description || market.title,
      },
    };
  } catch {
    return {};
  }
}

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
