"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  AreaSeries,
  CandlestickSeries,
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
  chartType?: "area" | "candlestick";
}

/**
 * Synthesize OHLC candles from sequential price points.
 * Groups consecutive points into candle intervals.
 */
function synthesizeOHLC(data: PricePoint[], candleCount = 50) {
  if (data.length < 2) return [];

  const batchSize = Math.max(1, Math.floor(data.length / candleCount));
  const candles = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const open = batch[0].price;
    const close = batch[batch.length - 1].price;
    const high = Math.max(...batch.map((p) => p.price));
    const low = Math.min(...batch.map((p) => p.price));
    const time = Math.floor(new Date(batch[0].timestamp).getTime() / 1000) as UTCTimestamp;

    candles.push({ time, open, high, low, close });
  }

  return candles;
}

export function PriceChart({
  data,
  height = 400,
  color = "#f59e0b",
  showVolume = false,
  chartType = "area",
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.03)" },
        horzLines: { color: "rgba(255, 255, 255, 0.03)" },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.06)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.06)",
        timeVisible: true,
      },
      crosshair: {
        vertLine: { color: "rgba(255, 255, 255, 0.08)" },
        horzLine: { color: "rgba(255, 255, 255, 0.08)" },
      },
    });

    const priceFormatter = (price: number) => `${(price * 100).toFixed(1)}%`;

    if (chartType === "candlestick") {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
        priceFormat: {
          type: "custom",
          formatter: priceFormatter,
        },
      });

      const candles = synthesizeOHLC(data);
      candleSeries.setData(candles);
    } else {
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: color,
        topColor: `${color}40`,
        bottomColor: `${color}05`,
        lineWidth: 2,
        priceFormat: {
          type: "custom",
          formatter: priceFormatter,
        },
      });

      const chartData = data.map((point) => ({
        time: Math.floor(new Date(point.timestamp).getTime() / 1000) as UTCTimestamp,
        value: point.price,
      }));

      areaSeries.setData(chartData);
    }

    if (showVolume && data.some((d) => d.volume)) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "rgba(245, 158, 11, 0.15)",
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
  }, [data, height, color, showVolume, chartType]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
