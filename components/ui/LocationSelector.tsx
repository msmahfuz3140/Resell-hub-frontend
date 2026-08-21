"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Check, Search, Compass, Building2 } from "lucide-react";

interface LocationSelectorProps {
  value: string;
  onChange: (city: string) => void;
  className?: string;
}

interface LocationOption {
  name: string;
  division: string;
  popularSpots?: string[];
  isAll?: boolean;
}

const LOCATIONS: LocationOption[] = [
  {
    name: "All Bangladesh",
    division: "Nationwide",
    isAll: true,
  },
  {
    name: "Dhaka",
    division: "Dhaka Division",
    popularSpots: ["Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur"],
  },
  {
    name: "Chittagong",
    division: "Chittagong Division",
    popularSpots: ["GEC", "Agrabad", "Nasirabad", "Khulshi"],
  },
  {
    name: "Sylhet",
    division: "Sylhet Division",
    popularSpots: ["Zindabazar", "Amberkhana", "Upashahar"],
  },
  {
    name: "Rajshahi",
    division: "Rajshahi Division",
    popularSpots: ["Shaheb Bazar", "Motihar", "Kazla"],
  },
  {
    name: "Khulna",
    division: "Khulna Division",
    popularSpots: ["Sonadanga", "Boyra", "Khalishpur"],
  },
  {
    name: "Barisal",
    division: "Barisal Division",
    popularSpots: ["Sadat Road", "Nattullabad", "Rupatali"],
  },
  {
    name: "Rangpur",
    division: "Rangpur Division",
    popularSpots: ["Jahaj Company Mor", "Dhap", "Pairaband"],
  },
];

export default function LocationSelector({
  value,
  onChange,
  className = "",
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.division.toLowerCase().includes(search.toLowerCase()) ||
      loc.popularSpots?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedLocation = LOCATIONS.find((l) => l.name === value) || LOCATIONS[0];

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 px-4 py-3 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl transition-all text-left group cursor-pointer focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-105 transition-transform">
            <MapPin size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
              Location
            </span>
            <span className="text-xs font-black text-slate-800 truncate mt-0.5">
              {selectedLocation.name}
            </span>
          </div>
        </div>

        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600" : "group-hover:text-slate-600"
          }`}
        />
      </button>

      {/* ── Custom Animated Popover ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-80 mt-2 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 overflow-hidden"
          >
            {/* Search within locations */}
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city or area..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Quick Nationwide Reset Button */}
            {!search && (
              <button
                type="button"
                onClick={() => handleSelect("All Bangladesh")}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl mb-1 text-left transition-all ${
                  value === "All Bangladesh"
                    ? "bg-indigo-50 text-indigo-900 border border-indigo-100 font-black"
                    : "hover:bg-slate-50 text-slate-700 font-semibold"
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <Compass size={15} className="text-indigo-600 shrink-0" />
                  <span>All Bangladesh (Nationwide)</span>
                </div>
                {value === "All Bangladesh" && <Check size={14} className="text-indigo-600" />}
              </button>
            )}

            {/* City Options List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-none">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
                Major Divisions & Cities
              </span>

              {filteredLocations.map((loc) => {
                if (loc.isAll && !search) return null;
                const isSelected = value === loc.name;

                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelect(loc.name)}
                    className={`w-full flex items-start justify-between p-2.5 rounded-2xl text-left transition-all group ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                        }`}
                      >
                        <Building2 size={13} />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold leading-tight">{loc.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {loc.division}
                          </span>
                        </div>

                        {loc.popularSpots && (
                          <p
                            className={`text-[10px] mt-0.5 truncate max-w-[180px] ${
                              isSelected ? "text-indigo-100" : "text-slate-400"
                            }`}
                          >
                            {loc.popularSpots.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={15} className="text-white shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}

              {filteredLocations.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No cities found matching &quot;{search}&quot;
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
