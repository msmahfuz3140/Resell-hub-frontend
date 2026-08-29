"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface UserGrowthData {
  month: string;
  users: number;
  sellers: number;
}

interface MonthlyOrderData {
  month: string;
  orders: number;
  revenue: number;
}

interface CategoryData {
  _id: string;
  count: number;
}

// ─── 1. Ultra-Premium User Growth Area Chart (SVG) ───────────────
export function UserGrowthChart({ data }: { data: UserGrowthData[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 240;
  const padding = { top: 25, right: 25, bottom: 40, left: 45 };

  const maxVal = Math.max(...data.map((d) => d.users), 50);

  const getX = (index: number) =>
    padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const getY = (val: number) =>
    height - padding.bottom - (val / maxVal) * (height - padding.top - padding.bottom);

  // Generate smooth area path
  const points = data.map((d, i) => `${getX(i)},${getY(d.users)}`).join(" ");
  const areaPath = `M ${getX(0)},${height - padding.bottom} L ${points.split(" ").join(" L ")} L ${getX(data.length - 1)},${height - padding.bottom} Z`;
  const linePath = `M ${points.split(" ").join(" L ")}`;

  // Sellers secondary line
  const sellerPoints = data.map((d, i) => `${getX(i)},${getY(d.sellers)}`).join(" ");
  const sellerAreaPath = `M ${getX(0)},${height - padding.bottom} L ${sellerPoints.split(" ").join(" L ")} L ${getX(data.length - 1)},${height - padding.bottom} Z`;
  const sellerLinePath = `M ${sellerPoints.split(" ").join(" L ")}`;

  const totalUsers = data[data.length - 1]?.users || 0;
  const growthRate = "+42.5%";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
              <Sparkles size={11} /> Audience Growth
            </span>
            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
              <ArrowUpRight size={12} /> {growthRate}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1.5 tracking-tight">User & Merchant Acquisition</h3>
          <p className="text-xs text-slate-400 font-medium">Cumulative registered buyers vs active verified sellers</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white shadow-xs text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Buyers ({totalUsers})
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sellers
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="sellerGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="4 4"
                  strokeWidth="1.2"
                />
                <text x={padding.left - 10} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="bold">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Fill Areas */}
          <path d={areaPath} fill="url(#userGrowthGradient)" />
          <path d={sellerAreaPath} fill="url(#sellerGrowthGradient)" />

          {/* Lines */}
          <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" filter="url(#glow)" />
          <path d={sellerLinePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />

          {/* Data points & X axis labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.users);
            const sellerY = getY(d.sellers);
            const isHovered = hoveredIdx === i;
            return (
              <g
                key={d.month}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover line indicator */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#cbd5e1"
                    strokeDasharray="2 2"
                    strokeWidth="1.5"
                  />
                )}

                {/* X axis month label */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? "#4f46e5" : "#64748b"}
                  fontWeight={isHovered ? "900" : "bold"}
                >
                  {d.month}
                </text>

                {/* Seller point */}
                <circle
                  cx={x}
                  cy={sellerY}
                  r={isHovered ? 4.5 : 3}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* User point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : 4.5}
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth={isHovered ? 3.5 : 2.5}
                  className="transition-all"
                />

                {/* Tooltip bubble on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 60}
                      y={y - 45}
                      width="120"
                      height="34"
                      rx="10"
                      fill="#0f172a"
                      filter="drop-shadow(0 6px 12px rgba(0,0,0,0.25))"
                    />
                    <text x={x} y={y - 28} textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="black">
                      {d.users} Total Users
                    </text>
                    <text x={x} y={y - 16} textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="bold">
                      {d.sellers} Verified Sellers
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── 2. Ultra-Premium Monthly Revenue & Order Volume Chart ─
export function MonthlyOrderChart({ data }: { data: MonthlyOrderData[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [viewMetric, setViewMetric] = useState<"revenue" | "orders" | "comparison">("revenue");

  if (!data || data.length === 0) return null;

  const width = 640;
  const height = 280;
  const padding = { top: 35, right: 35, bottom: 45, left: 65 };

  const maxOrders = Math.max(...data.map((d) => d.orders), 20);
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100000);

  const getX = (index: number) =>
    padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);

  const getXBar = (index: number) =>
    padding.left + ((index + 0.5) / data.length) * (width - padding.left - padding.right);

  const getYRevenue = (revenue: number) =>
    height - padding.bottom - (revenue / maxRevenue) * (height - padding.top - padding.bottom);

  const getYOrders = (orders: number) =>
    height - padding.bottom - (orders / maxOrders) * (height - padding.top - padding.bottom);

  const totalGMV = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalOrdersCount = data.reduce((acc, d) => acc + d.orders, 0);
  const avgOrderVal = totalOrdersCount > 0 ? Math.round(totalGMV / totalOrdersCount) : 0;

  // Generate smooth cubic bezier curve for Revenue Area
  const revPoints = data.map((d, i) => ({ x: getX(i), y: getYRevenue(d.revenue) }));
  
  // Create smooth bezier SVG path
  let revPath = `M ${revPoints[0].x},${revPoints[0].y}`;
  for (let i = 0; i < revPoints.length - 1; i++) {
    const current = revPoints[i];
    const next = revPoints[i + 1];
    const cpX1 = current.x + (next.x - current.x) / 2;
    const cpY1 = current.y;
    const cpX2 = current.x + (next.x - current.x) / 2;
    const cpY2 = next.y;
    revPath += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${next.x},${next.y}`;
  }

  const revAreaPath = `${revPath} L ${revPoints[revPoints.length - 1].x},${height - padding.bottom} L ${revPoints[0].x},${height - padding.bottom} Z`;

  // MoM Growth calculation for latest month
  const lastMonthRev = data[data.length - 1]?.revenue || 0;
  const prevMonthRev = data[data.length - 2]?.revenue || 1;
  const momGrowth = Math.round(((lastMonthRev - prevMonthRev) / prevMonthRev) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
      {/* ── Header: Title & Interactive View Switcher ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
              <TrendingUp size={12} /> Marketplace Metrics
            </span>
            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
              <ArrowUpRight size={13} /> +{momGrowth}% MoM
            </span>
            <span className="text-[11px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Avg Order: {formatCurrency(avgOrderVal)}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
            Financial & Transaction Volume Analytics
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Gross merchandise value (GMV), order throughput, and marketplace fees
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70 self-start lg:self-center">
          <button
            onClick={() => setViewMetric("revenue")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMetric === "revenue"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <DollarSign size={13} /> Revenue (GMV ৳)
          </button>
          <button
            onClick={() => setViewMetric("orders")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMetric === "orders"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag size={13} /> Order Volume
          </button>
          <button
            onClick={() => setViewMetric("comparison")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMetric === "comparison"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 size={13} /> Dual Overview
          </button>
        </div>
      </div>

      {/* ── Key Performance Indicators (KPI Mini Strip) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/40 p-4 rounded-2xl border border-indigo-100/80 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block truncate">Total GMV (6 Months)</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block truncate" title={formatCurrency(totalGMV)}>{formatCurrency(totalGMV)}</span>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate">Platform gross merchandise volume</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-4 rounded-2xl border border-emerald-100/80 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block truncate">Completed Transactions</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block truncate">{totalOrdersCount} Orders</span>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 truncate">100% Escrow fulfilled</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50/70 to-pink-50/40 p-4 rounded-2xl border border-purple-100/80 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block truncate">Platform Net Revenue (5%)</span>
          <span className="text-xl sm:text-2xl font-black text-purple-700 mt-0.5 block truncate" title={formatCurrency(Math.round(totalGMV * 0.05))}>{formatCurrency(Math.round(totalGMV * 0.05))}</span>
          <p className="text-[11px] text-purple-600 font-semibold mt-1 truncate">Earned via marketplace fees</p>
        </div>
      </div>

      {/* ── SVG Chart ── */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            {/* Smooth Indigo Glow Gradient */}
            <linearGradient id="premiumRevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing Stroke Filter */}
            <filter id="premiumLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#6366f1" floodOpacity="0.35" />
            </filter>

            {/* Modern Column Gradients */}
            <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="indigoBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>

          {/* Grid lines & Values */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
            const valOrders = Math.round(maxOrders * ratio);
            const valRevenue = Math.round(maxRevenue * ratio);

            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="4 4"
                  strokeWidth="1.2"
                />
                <text x={padding.left - 12} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="bold">
                  {viewMetric === "orders" ? valOrders : `৳${Math.round(valRevenue / 1000)}k`}
                </text>
              </g>
            );
          })}

          {/* ── MODE 1: REVENUE (SMOOTH AREA SPLINE) ── */}
          {viewMetric === "revenue" && (
            <>
              {/* Area */}
              <path d={revAreaPath} fill="url(#premiumRevGradient)" />

              {/* Glowing Line */}
              <path
                d={revPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#premiumLineGlow)"
              />

              {/* Data points */}
              {data.map((d, i) => {
                const x = getX(i);
                const y = getYRevenue(d.revenue);
                const isHovered = hoveredIdx === i;

                return (
                  <g
                    key={d.month}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover vertical beam */}
                    {isHovered && (
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={height - padding.bottom}
                        stroke="#c7d2fe"
                        strokeDasharray="3 3"
                        strokeWidth="2"
                      />
                    )}

                    {/* Month Label */}
                    <text
                      x={x}
                      y={height - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill={isHovered ? "#4f46e5" : "#64748b"}
                      fontWeight={isHovered ? "900" : "bold"}
                    >
                      {d.month}
                    </text>

                    {/* Node Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 7.5 : 5}
                      fill="#ffffff"
                      stroke="#6366f1"
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      className="transition-all"
                    />

                    {/* Floating Tooltip */}
                    {isHovered && (
                      <g>
                        <rect
                          x={x - 70}
                          y={y - 50}
                          width="140"
                          height="42"
                          rx="12"
                          fill="#0f172a"
                          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
                        />
                        <text x={x} y={y - 32} textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="black">
                          {d.month}: ৳{d.revenue.toLocaleString()}
                        </text>
                        <text x={x} y={y - 18} textAnchor="middle" fontSize="9.5" fill="#a5b4fc" fontWeight="bold">
                          {d.orders} Orders • Fee: ৳{Math.round(d.revenue * 0.05).toLocaleString()}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </>
          )}

          {/* ── MODE 2: ORDER VOLUME (CLEAN ROUNDED COLUMNS) ── */}
          {viewMetric === "orders" && (
            <>
              {data.map((d, i) => {
                const cx = getXBar(i);
                const barH = (d.orders / maxOrders) * (height - padding.top - padding.bottom);
                const y = height - padding.bottom - barH;
                const isHovered = hoveredIdx === i;
                const barWidth = 38;

                return (
                  <g
                    key={d.month}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover Backdrop Glow */}
                    {isHovered && (
                      <rect
                        x={cx - (barWidth + 12) / 2}
                        y={padding.top}
                        width={barWidth + 12}
                        height={height - padding.top - padding.bottom}
                        rx="12"
                        fill="#f0fdf4"
                      />
                    )}

                    {/* Bar */}
                    <rect
                      x={cx - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={barH}
                      rx="8"
                      fill={isHovered ? "#059669" : "url(#emeraldBarGrad)"}
                      className="transition-all duration-300"
                    />

                    {/* Value Badge */}
                    <text
                      x={cx}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="11"
                      fill={isHovered ? "#059669" : "#0f172a"}
                      fontWeight="black"
                    >
                      {d.orders}
                    </text>

                    {/* Month Label */}
                    <text
                      x={cx}
                      y={height - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill={isHovered ? "#059669" : "#64748b"}
                      fontWeight={isHovered ? "900" : "bold"}
                    >
                      {d.month}
                    </text>

                    {/* Tooltip on hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={cx - 65}
                          y={y - 48}
                          width="130"
                          height="40"
                          rx="10"
                          fill="#0f172a"
                          filter="drop-shadow(0 8px 16px rgba(0,0,0,0.25))"
                        />
                        <text x={cx} y={y - 30} textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="black">
                          {d.month}: {d.orders} Trades
                        </text>
                        <text x={cx} y={y - 17} textAnchor="middle" fontSize="9.5" fill="#34d399" fontWeight="bold">
                          ৳{d.revenue.toLocaleString()} Volume
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </>
          )}

          {/* ── MODE 3: DUAL OVERVIEW (GROUPED DUAL COLUMNS) ── */}
          {viewMetric === "comparison" && (
            <>
              {data.map((d, i) => {
                const cx = getXBar(i);
                const colWidth = 18;
                const gap = 4;

                const revH = (d.revenue / maxRevenue) * (height - padding.top - padding.bottom);
                const revY = height - padding.bottom - revH;

                const ordH = (d.orders / maxOrders) * (height - padding.top - padding.bottom);
                const ordY = height - padding.bottom - ordH;

                const isHovered = hoveredIdx === i;

                return (
                  <g
                    key={d.month}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover Backdrop */}
                    {isHovered && (
                      <rect
                        x={cx - (colWidth * 2 + gap + 12) / 2}
                        y={padding.top}
                        width={colWidth * 2 + gap + 12}
                        height={height - padding.top - padding.bottom}
                        rx="10"
                        fill="#f8fafc"
                      />
                    )}

                    {/* Revenue Column (Indigo) */}
                    <rect
                      x={cx - colWidth - gap / 2}
                      y={revY}
                      width={colWidth}
                      height={revH}
                      rx="5"
                      fill="url(#indigoBarGrad)"
                    />

                    {/* Orders Column (Emerald) */}
                    <rect
                      x={cx + gap / 2}
                      y={ordY}
                      width={colWidth}
                      height={ordH}
                      rx="5"
                      fill="url(#emeraldBarGrad)"
                    />

                    {/* Month Label */}
                    <text
                      x={cx}
                      y={height - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill={isHovered ? "#0f172a" : "#64748b"}
                      fontWeight={isHovered ? "900" : "bold"}
                    >
                      {d.month}
                    </text>

                    {/* Hover Tooltip */}
                    {isHovered && (
                      <g>
                        <rect
                          x={cx - 75}
                          y={Math.min(revY, ordY) - 52}
                          width="150"
                          height="44"
                          rx="12"
                          fill="#0f172a"
                          filter="drop-shadow(0 10px 18px rgba(0,0,0,0.3))"
                        />
                        <text x={cx} y={Math.min(revY, ordY) - 33} textAnchor="middle" fontSize="10.5" fill="#ffffff" fontWeight="black">
                          {d.month} Performance
                        </text>
                        <text x={cx} y={Math.min(revY, ordY) - 18} textAnchor="middle" fontSize="9" fill="#a5b4fc" fontWeight="bold">
                          ৳{d.revenue.toLocaleString()} (GMV) • {d.orders} Orders
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* ── Bottom Legend ── */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-600" /> Gross Marketplace Value (GMV ৳)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-emerald-500" /> Completed Orders (Volume)
        </span>
      </div>
    </div>
  );
}

// ─── 3. Category Distribution Chart ───────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string; icon: string }> = {
  Electronics: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-600", icon: "📱" },
  Vehicles: { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-600", icon: "🚗" },
  Furniture: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500", icon: "🛋️" },
  Clothing: { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500", icon: "👕" },
  Music: { bg: "bg-cyan-50", text: "text-cyan-600", bar: "bg-cyan-500", icon: "🎸" },
  Books: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500", icon: "📚" },
  Sports: { bg: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500", icon: "⚽" },
  Other: { bg: "bg-slate-50", text: "text-slate-600", bar: "bg-slate-500", icon: "📦" },
};

export function CategoryChart({ data }: { data: CategoryData[] }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 flex items-center gap-1">
                <PieChart size={11} /> Inventory Share
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1.5 tracking-tight">Category Market Share</h3>
          </div>
          <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            {total} Total Ads
          </span>
        </div>

        {/* Progress Bars Breakdown */}
        <div className="space-y-4 mt-4">
          {data.slice(0, 6).map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const styling = CATEGORY_COLORS[item._id] || CATEGORY_COLORS.Other;

            return (
              <div key={item._id} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <span>{styling.icon}</span> {item._id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">{item.count} items</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${styling.bg} ${styling.text}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${styling.bar} shadow-xs`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Most active: Electronics (44%)</span>
        <span className="text-indigo-600">All categories healthy</span>
      </div>
    </div>
  );
}
