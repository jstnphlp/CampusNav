"use client";

import React from "react";
import type { RouteResult } from "@/types/campus";

interface RouteDetailsProps {
  result: RouteResult | null;
  algorithmUsed: string;
}

export default function RouteDetails({ result, algorithmUsed }: RouteDetailsProps) {
  if (!result) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-5 mt-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg
          className="w-5 h-5 text-emerald-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          ></path>
        </svg>
        Route Details
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Algorithm
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {algorithmUsed}
          </div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Distance
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {result.totalDistance}m
          </div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 col-span-2">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Est. Walking Time
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {Math.ceil(result.walkingTimeSeconds / 60)} min
          </div>
        </div>
      </div>
    </div>
  );
}
