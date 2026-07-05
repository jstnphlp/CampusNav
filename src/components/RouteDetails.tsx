"use client";

import React from "react";
import type { RouteResult, AlgoComparison } from "@/types/campus";

interface RouteDetailsProps {
  result: RouteResult | null;
  algorithmUsed: string;
  comparisonData?: AlgoComparison | null;
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? "bg-emerald-50" : "bg-gray-50"}`}>
      <div
        className={`text-xs font-medium uppercase tracking-wider mb-1 ${
          highlight ? "text-emerald-600" : "text-gray-500"
        }`}
      >
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function AlgorithmCard({
  name,
  result,
  isRecommended,
}: {
  name: string;
  result: RouteResult | null;
  isRecommended: boolean;
}) {
  if (!result) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900">{name}</span>
        </div>
        <p className="text-sm text-red-600">No path found</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isRecommended
          ? "border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-200"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-900">{name}</span>
        {isRecommended && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
            Recommended
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Distance" value={`${result.totalDistance}m`} highlight={isRecommended} />
        <StatCard
          label="Time"
          value={`${Math.ceil(result.walkingTimeSeconds / 60)} min`}
          highlight={isRecommended}
        />
        <StatCard label="Nodes" value={`${result.nodesExplored}`} highlight={isRecommended} />
      </div>
    </div>
  );
}

export default function RouteDetails({
  result,
  algorithmUsed,
  comparisonData,
}: RouteDetailsProps) {
  if (!result && !comparisonData) return null;

  // Comparison mode
  if (comparisonData) {
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          Algorithm Comparison
        </h3>

        <div className="space-y-3">
          <AlgorithmCard
            name="A* Search"
            result={comparisonData.aStar}
            isRecommended={comparisonData.recommended === "aStar"}
          />
          <AlgorithmCard
            name="Dijkstra's"
            result={comparisonData.dijkstra}
            isRecommended={comparisonData.recommended === "dijkstra"}
          />
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-700">Insight:</span>{" "}
            {comparisonData.reason}
          </p>
        </div>
      </div>
    );
  }

  // Single algorithm mode
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

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Algorithm
          </div>
          <div className="text-sm font-semibold text-gray-900">{algorithmUsed}</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Distance
          </div>
          <div className="text-sm font-semibold text-gray-900">{result.totalDistance}m</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Est. Walking Time
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {Math.ceil(result.walkingTimeSeconds / 60)} min
          </div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">
            Nodes Explored
          </div>
          <div className="text-sm font-semibold text-gray-900">{result.nodesExplored}</div>
        </div>
      </div>
    </div>
  );
}
