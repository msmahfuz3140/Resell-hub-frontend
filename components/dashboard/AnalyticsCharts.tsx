"use client";

import React, { useState } from "react";
import { TrendingUp, Users, ShoppingBag, DollarSign, Layers } from "lucide-react";
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

// ─── 1. User Growth Area Chart (SVG) ───────────────
export function UserGrowthChart({ data }: { data: UserGrowthData[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 40 };

  const maxVal = Math.max(...data.map((d) => d.users), 50);

  const getX = (index: number) =>
    padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const getY = (val: number) =>
    height - padding.bottom - (val / maxVal) * (height - padding.top - padding.bottom);

  // Generate path string
  const points = data.map((d, i) => `${getX(i)},${getY(d.users)}`).join(" ");
  const areaPath = `M ${getX(0)},${height - padding.bottom} L ${points.split(" ").join(" L ")} L ${getX(data.length - 1)},${height - padding.bottom} Z`;
  const linePath = `M ${points.split(" ").join(" L ")}`;

  // Sellers secondary line
  const sellerPoints = data.map((d, i) => `${getX(i)},${getY(d.sellers)}`).join(" ");
  const sellerLinePath = `M ${sellerPoints.split(" ").join(" L ")}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Growth
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">User & Merchant Acquisition</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Total Users
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sellers
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
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
                />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="bold">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} fill="url(#userGrowthGradient)" />

          {/* Lines */}
          <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          <path d={sellerLinePath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

          {/* Data points & X axis labels */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.users);
            const isHovered = hoveredIdx === i;
            return (
              <g key={d.month} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                {/* X axis month label */}
                <text x={x} y={height - 10} textAnchor="middle" fontSize="11" fill={isHovered ? "#4f46e5" : "#64748b"} fontWeight={isHovered ? "bold" : "normal"}>
                  {d.month}
                </text>

                {/* Point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all"
                />

                {/* Tooltip bubble on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 45}
                      y={y - 38}
                      width="90"
                      height="28"
                      rx="8"
                      fill="#0f172a"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                    />
                    <text x={x} y={y - 20} textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold">
                      {d.users} users ({d.sellers} sel)
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

// ─── 2. Monthly Revenue & Order Volume Chart (SVG) ─
export function MonthlyOrderChart({ data }: { data: MonthlyOrderData[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };

  const maxOrders = Math.max(...data.map((d) => d.orders), 20);

  const barWidth = 32;
  const getX = (index: number) =>
    padding.left + ((index + 0.5) / data.length) * (width - padding.left - padding.right);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Orders
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">Monthly Order & Volume Trends</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Completed Orders
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="orderBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="orderBarGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
            const val = Math.round(maxOrders * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="4 4"
                />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="bold">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const cx = getX(i);
            const barH = (d.orders / maxOrders) * (height - padding.top - padding.bottom);
            const y = height - padding.bottom - barH;
            const isHovered = hoveredIdx === i;

            return (
              <g key={d.month} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                {/* Bar */}
                <rect
                  x={cx - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="6"
                  fill={isHovered ? "url(#orderBarGradHover)" : "url(#orderBarGrad)"}
                  className="transition-all duration-300"
                />

                {/* X-axis label */}
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? "#0f172a" : "#64748b"}
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {d.month}
                </text>

                {/* Top value */}
                <text x={cx} y={y - 5} textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="black">
                  {d.orders}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={cx - 50}
                      y={y - 42}
                      width="100"
                      height="30"
                      rx="8"
                      fill="#0f172a"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                    />
                    <text x={cx} y={y - 23} textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold">
                      ৳{d.revenue?.toLocaleString() || 0} Vol
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

// ─── 3. Category Distribution Chart ───────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Electronics: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-600" },
  Vehicles: { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-600" },
  Furniture: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  Clothing: { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500" },
  Music: { bg: "bg-cyan-50", text: "text-cyan-600", bar: "bg-cyan-500" },
  Books: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
  Sports: { bg: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500" },
  Other: { bg: "bg-slate-50", text: "text-slate-600", bar: "bg-slate-500" },
};

export function CategoryChart({ data }: { data: CategoryData[] }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Inventory
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">Category Market Share</h3>
        </div>
        <span className="text-xs font-bold text-slate-400">{total} Total Items</span>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="space-y-3.5 mt-2">
        {data.slice(0, 6).map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const styling = CATEGORY_COLORS[item._id] || CATEGORY_COLORS.Other;

          return (
            <div key={item._id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{item._id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">{item.count} items</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${styling.bg} ${styling.text}`}>
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${styling.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
