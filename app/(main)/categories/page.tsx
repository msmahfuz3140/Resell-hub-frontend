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
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const FULL_CATEGORIES = [
  {
    id: "Electronics",
    name: "Electronics & Gadgets",
    icon: Laptop,
    description: "Smartphones, Laptops, Tablets, Cameras, Accessories, TVs & Smart Home",
    count: "14,800+ items",
    bg: "from-blue-500 to-indigo-600",
    subcategories: ["Smartphones", "Laptops & Desktops", "Audio & Headphones", "Cameras", "Accessories", "Gaming Consoles"],
  },
  {
    id: "Clothing",
    name: "Fashion & Apparel",
    icon: Shirt,
    description: "Men's, Women's, Kids' clothing, Shoes, Bags, Watches & Fashion Accessories",
    count: "9,200+ items",
    bg: "from-purple-500 to-pink-600",
    subcategories: ["Men's Wear", "Women's Ethnic & Western", "Footwear", "Watches & Jewelry", "Bags & Luggage"],
  },
  {
    id: "Furniture",
    name: "Home & Furniture",
    icon: Armchair,
    description: "Sofas, Desks, Beds, Dining Tables, Office Chairs, Lighting & Decor",
    count: "4,600+ items",
    bg: "from-amber-500 to-orange-600",
    subcategories: ["Living Room", "Bedroom", "Office Furniture", "Home Decor", "Kitchen Appliances"],
  },
  {
    id: "Vehicles",
    name: "Vehicles & Motors",
    icon: Bike,
    description: "Motorcycles, Scooters, Bicycles, Cars, Spare Parts & Helmets",
    count: "2,100+ items",
    bg: "from-red-500 to-rose-600",
    subcategories: ["Motorbikes & Scooters", "Bicycles", "Cars & Sedans", "Helmets & Riding Gear", "Auto Parts"],
  },
  {
    id: "Books",
    name: "Books & Learning",
    icon: BookOpen,
    description: "Textbooks, Novels, BCS & Admission prep, Non-fiction & Comics",
    count: "3,800+ items",
    bg: "from-emerald-500 to-teal-600",
    subcategories: ["University & Academic", "Fiction & Novels", "Competitive Exams", "Children's Books"],
  },
  {
    id: "Music",
    name: "Musical Instruments",
    icon: Music,
    description: "Acoustic & Electric Guitars, Keyboards, Drums, Violins, Microphones & Amps",
    count: "1,150+ items",
    bg: "from-indigo-500 to-violet-600",
    subcategories: ["Guitars & Bass", "Keyboards & Pianos", "Drums & Percussion", "Audio Interface & Studio Gear"],
  },
  {
    id: "Sports",
    name: "Sports & Fitness",
    icon: Dumbbell,
    description: "Gym Equipment, Dumbbells, Cricket Bats, Football Kits & Outdoor Gear",
    count: "1,400+ items",
    bg: "from-cyan-500 to-blue-600",
    subcategories: ["Gym & Weights", "Cricket & Football", "Badminton & Tennis", "Outdoor & Camping"],
  },
  {
    id: "Toys",
    name: "Toys, Kids & Baby",
    icon: Baby,
    description: "Prams, Strollers, Educational Toys, Action Figures, Board Games",
    count: "950+ items",
    bg: "from-yellow-400 to-amber-500",
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
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
            Marketplace Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
            Browse All Categories
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mb-6">
            Find quality second-hand goods across all major categories in Bangladesh.
          </p>

          {/* Filter box */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search category (e.g., Electronics, Books)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.bg} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {category.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {category.description}
                  </p>

                  {/* Subcategories pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/listings?category=${category.id}&search=${encodeURIComponent(sub)}`}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Explore button */}
                <Link
                  href={`/listings?category=${category.id}`}
                  className="w-full py-2.5 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
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
