"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { PricePoint } from "@/types";

interface PriceChartProps {
  data: PricePoint[];
  height?: number;
  color?: string;
  showVolume?: boolean;
}

export function PriceChart({
  data,
  height = 400,
  color = "#0088ff",
  showVolume = false,
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.04)" },
        horzLines: { color: "rgba(255, 255, 255, 0.04)" },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
      },
      crosshair: {
        vertLine: { color: "rgba(255, 255, 255, 0.1)" },
        horzLine: { color: "rgba(255, 255, 255, 0.1)" },
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: `${color}40`,
      bottomColor: `${color}05`,
      lineWidth: 2,
      priceFormat: {
        type: "custom",
        formatter: (price: number) => `${(price * 100).toFixed(1)}%`,
      },
    });

    const chartData = data.map((point) => ({
      time: Math.floor(new Date(point.timestamp).getTime() / 1000) as UTCTimestamp,
      value: point.price,
    }));

    areaSeries.setData(chartData);

    if (showVolume && data.some((d) => d.volume)) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "rgba(0, 136, 255, 0.2)",
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });
      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      const volumeData = data
        .filter((d) => d.volume != null)
        .map((d) => ({
          time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
          value: d.volume!,
        }));
      volumeSeries.setData(volumeData);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height, color, showVolume]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
