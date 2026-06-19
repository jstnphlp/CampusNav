export interface CampusNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface CampusEdge {
  from: string;
  to: string;
  weight: number;
  covered: boolean;
  accessible: boolean;
}

export interface CampusGraph {
  nodes: CampusNode[];
  edges: CampusEdge[];
}

export interface RouteResult {
  path: string[];
  totalDistance: number;
  walkingTimeSeconds: number;
  nodesExplored: number;
}

export interface AlgoComparison {
  dijkstra: RouteResult | null;
  aStar: RouteResult | null;
  recommended: "dijkstra" | "aStar";
  reason: string;
}
