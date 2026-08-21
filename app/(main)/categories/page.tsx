"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Shirt,
  Armchair,
  BookOpen,
  Bike,
  Music,
  Camera,
  Gamepad2,
  Watch,
  Baby,
  Dumbbell,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const FULL_CATEGORIES = [
  {
    id: "Electronics",
    name: "Electronics & Gadgets",
    icon: Laptop,
    description: "Smartphones, Laptops, Tablets, Cameras, Accessories, TVs & Smart Home",
    count: "14,800+ Deals",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    subcategories: ["Smartphones", "Laptops & Desktops", "Audio & Headphones", "Cameras", "Accessories", "Gaming Consoles"],
  },
  {
    id: "Clothing",
    name: "Fashion & Apparel",
    icon: Shirt,
    description: "Men's, Women's, Kids' clothing, Shoes, Bags, Watches & Fashion Accessories",
    count: "9,200+ Deals",
    gradient: "from-purple-600 via-pink-600 to-rose-500",
    subcategories: ["Men's Wear", "Women's Ethnic & Western", "Footwear", "Watches & Jewelry", "Bags & Luggage"],
  },
  {
    id: "Furniture",
    name: "Home & Furniture",
    icon: Armchair,
    description: "Sofas, Desks, Beds, Dining Tables, Office Chairs, Lighting & Decor",
    count: "4,600+ Deals",
    gradient: "from-amber-500 via-orange-600 to-yellow-500",
    subcategories: ["Living Room", "Bedroom", "Office Furniture", "Home Decor", "Kitchen Appliances"],
  },
  {
    id: "Vehicles",
    name: "Vehicles & Motors",
    icon: Bike,
    description: "Motorcycles, Scooters, Bicycles, Cars, Spare Parts & Helmets",
    count: "2,100+ Deals",
    gradient: "from-rose-600 via-red-600 to-orange-500",
    subcategories: ["Motorbikes & Scooters", "Bicycles", "Cars & Sedans", "Helmets & Riding Gear", "Auto Parts"],
  },
  {
    id: "Books",
    name: "Books & Study Material",
    icon: BookOpen,
    description: "Textbooks, Novels, BCS & Admission prep, Non-fiction & Comics",
    count: "3,800+ Deals",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    subcategories: ["University & Academic", "Fiction & Novels", "Competitive Exams", "Children's Books"],
  },
  {
    id: "Music",
    name: "Musical Instruments",
    icon: Music,
    description: "Acoustic & Electric Guitars, Keyboards, Drums, Violins, Microphones & Amps",
    count: "1,150+ Deals",
    gradient: "from-indigo-600 via-violet-600 to-purple-600",
    subcategories: ["Guitars & Bass", "Keyboards & Pianos", "Drums & Percussion", "Audio Interface & Studio Gear"],
  },
  {
    id: "Sports",
    name: "Sports & Fitness",
    icon: Dumbbell,
    description: "Gym Equipment, Dumbbells, Cricket Bats, Football Kits & Outdoor Gear",
    count: "1,400+ Deals",
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    subcategories: ["Gym & Weights", "Cricket & Football", "Badminton & Tennis", "Outdoor & Camping"],
  },
  {
    id: "Toys",
    name: "Toys, Kids & Baby",
    icon: Baby,
    description: "Prams, Strollers, Educational Toys, Action Figures, Board Games",
    count: "950+ Deals",
    gradient: "from-yellow-500 via-amber-600 to-orange-500",
    subcategories: ["Baby Gear & Strollers", "Educational Toys", "Action Figures", "Board Games"],
  },
];

export default function CategoriesPage() {
  const [filter, setFilter] = useState("");

  const filtered = FULL_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Marketplace Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
            Browse All Categories
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mb-8">
            Discover verified second-hand items categorized for fast & easy discovery.
          </p>

          {/* Filter box */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by category or keyword..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold shadow-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filtered.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Icon & Count */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-black text-slate-400">
                      {category.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 font-normal">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/listings?category=${category.id}&search=${encodeURIComponent(sub)}`}
                        className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Explore button */}
                <Link
                  href={`/listings?category=${category.id}`}
                  className="w-full py-3 bg-slate-50 group-hover:btn-shiny-primary text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore {category.id}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
