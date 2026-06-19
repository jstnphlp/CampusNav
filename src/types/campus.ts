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
  distance: number;
  edges: CampusEdge[];
}

export interface AlgoComparison {
  dijkstra: RouteResult & { elapsed: number };
  astar: RouteResult & { elapsed: number };
}
