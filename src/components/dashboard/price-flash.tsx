"use client";

import { useEffect, useRef, useState } from "react";

interface PriceFlashProps {
  value: number;
  children: React.ReactNode;
}

export function PriceFlash({ value, children }: PriceFlashProps) {
  const prevRef = useRef(value);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (prevRef.current !== value) {
      const cls = value > prevRef.current ? "flash-green" : "flash-red";
      setFlashClass(cls);
      const timer = setTimeout(() => setFlashClass(""), 300);
      prevRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return <span className={flashClass}>{children}</span>;
}
