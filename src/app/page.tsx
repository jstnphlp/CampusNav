"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Controls from "@/components/Controls";
import RouteDetails from "@/components/RouteDetails";
import { compareAlgorithms, dijkstra, aStar } from "@/lib/algorithms";
import { CAMPUS_GRAPH } from "@/data/graph";
import type { RouteResult, AlgoComparison } from "@/types/campus";

// MapCanvas uses canvas/pdfjs which require browser environment
const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  ),
});

export default function Home() {
  const [startNode, setStartNode] = useState("entry_gate");
  const [endNode, setEndNode] = useState("canteen");
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [avoidCovered, setAvoidCovered] = useState(false);
  const [algorithmMode, setAlgorithmMode] = useState<"aStar" | "dijkstra" | "compare">("compare");

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [algorithmUsed, setAlgorithmUsed] = useState<string>("");
  const [comparisonData, setComparisonData] = useState<AlgoComparison | null>(null);

  const handleFindPath = () => {
    const options = { accessibleOnly, avoidCovered };

    if (algorithmMode === "compare") {
      const comparison = compareAlgorithms(CAMPUS_GRAPH, startNode, endNode, options);
      setComparisonData(comparison);

      const bestResult =
        comparison.recommended === "aStar" ? comparison.aStar : comparison.dijkstra;

      if (bestResult) {
        setCurrentPath(bestResult.path);
        setResult(bestResult);
        setAlgorithmUsed(comparison.recommended === "aStar" ? "A* Search" : "Dijkstra");
      } else {
        setCurrentPath([]);
        setResult(null);
        setComparisonData(null);
        alert("No valid path found between these locations with the current constraints.");
      }
    } else {
      const runAlgo = algorithmMode === "aStar" ? aStar : dijkstra;
      const algoResult = runAlgo(CAMPUS_GRAPH, startNode, endNode, options);
      setComparisonData(null);

      if (algoResult) {
        setCurrentPath(algoResult.path);
        setResult(algoResult);
        setAlgorithmUsed(algorithmMode === "aStar" ? "A* Search" : "Dijkstra");
      } else {
        setCurrentPath([]);
        setResult(null);
        alert("No valid path found between these locations with the current constraints.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar Panel */}
      <div className="w-96 bg-white shadow-2xl z-10 flex flex-col">
        <div className="p-6 bg-emerald-700 text-white shadow-md">
          <h1 className="text-2xl font-bold tracking-tight">CampusNav</h1>
          <p className="text-emerald-100 text-sm mt-1 opacity-90">
            Intelligent Pathfinding System
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <Controls
            startNode={startNode}
            setStartNode={setStartNode}
            endNode={endNode}
            setEndNode={setEndNode}
            accessibleOnly={accessibleOnly}
            setAccessibleOnly={setAccessibleOnly}
            avoidCovered={avoidCovered}
            setAvoidCovered={setAvoidCovered}
            algorithmMode={algorithmMode}
            setAlgorithmMode={setAlgorithmMode}
            onFindPath={handleFindPath}
          />

          <RouteDetails result={result} algorithmUsed={algorithmUsed} comparisonData={comparisonData} />
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative">
        <MapCanvas currentPath={currentPath} />

        {/* Helper overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs font-medium text-gray-600 border border-gray-200 pointer-events-none">
          Drag to pan • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
