"use client";

import React, { useMemo } from "react";
import { CAMPUS_GRAPH } from "@/data/graph";

interface ControlsProps {
  startNode: string;
  setStartNode: (id: string) => void;
  endNode: string;
  setEndNode: (id: string) => void;
  accessibleOnly: boolean;
  setAccessibleOnly: (val: boolean) => void;
  avoidCovered: boolean;
  setAvoidCovered: (val: boolean) => void;
  algorithmMode: "aStar" | "dijkstra" | "compare";
  setAlgorithmMode: (mode: "aStar" | "dijkstra" | "compare") => void;
  onFindPath: () => void;
}

export default function Controls({
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  accessibleOnly,
  setAccessibleOnly,
  avoidCovered,
  setAvoidCovered,
  algorithmMode,
  setAlgorithmMode,
  onFindPath,
}: ControlsProps) {
  const sortedNodes = useMemo(() => {
    return [...CAMPUS_GRAPH.nodes].sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Starting Location
          </label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none transition-colors"
          >
            {sortedNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <select
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none transition-colors"
          >
            {sortedNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(e) => setAccessibleOnly(e.target.checked)}
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            Wheelchair Accessible Route
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={avoidCovered}
            onChange={(e) => setAvoidCovered(e.target.checked)}
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
            Avoid Covered Walkways
          </span>
        </label>
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700">
          Algorithm
        </label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {([
            { value: "aStar" as const, label: "A*" },
            { value: "dijkstra" as const, label: "Dijkstra" },
            { value: "compare" as const, label: "Compare" },
          ]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAlgorithmMode(opt.value)}
              className={`flex-1 text-sm font-medium py-2 px-3 transition-all ${
                algorithmMode === opt.value
                  ? "bg-emerald-600 text-white shadow-inner"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onFindPath}
        className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all shadow-sm hover:shadow active:scale-[0.98]"
      >
        {algorithmMode === "compare" ? "Compare Algorithms" : "Find Path"}
      </button>
    </div>
  );
}
