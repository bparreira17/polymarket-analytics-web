"use client";

import Link from "next/link";

const CATEGORIES = [
  { name: "Politics", slug: "politics", color: "from-blue-500/30 to-blue-600/10" },
  { name: "Crypto", slug: "crypto", color: "from-violet-500/30 to-violet-600/10" },
  { name: "Sports", slug: "sports", color: "from-emerald-500/30 to-emerald-600/10" },
  { name: "Science", slug: "science", color: "from-cyan-500/30 to-cyan-600/10" },
  { name: "Tech", slug: "tech", color: "from-amber-500/30 to-amber-600/10" },
  { name: "Economics", slug: "economics", color: "from-red-500/30 to-red-600/10" },
  { name: "Culture", slug: "culture", color: "from-pink-500/30 to-pink-600/10" },
  { name: "Other", slug: "other", color: "from-gray-500/20 to-gray-600/10" },
];

export function CategoryHeatMap() {
  return (
    <div className="grid grid-cols-4 gap-1.5 p-3">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/markets?category=${cat.slug}`}
          className={`rounded-md bg-gradient-to-br ${cat.color} px-2.5 py-2 hover:brightness-125 transition-all`}
        >
          <p className="text-[10px] font-medium text-white/70 truncate">{cat.name}</p>
        </Link>
      ))}
    </div>
  );
}
