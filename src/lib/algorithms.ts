import type { CampusGraph, RouteResult, AlgoComparison } from "@/types/campus";
import { getNodeById, getNeighbors, euclideanDistance } from "./graphUtils";

interface MinHeapItem {
  id: string;
  priority: number;
}

class MinHeap {
  private heap: MinHeapItem[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(id: string, priority: number): void {
    this.heap.push({ id, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): MinHeapItem | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.heap[left].priority < this.heap[smallest].priority)
        smallest = left;
      if (right < n && this.heap[right].priority < this.heap[smallest].priority)
        smallest = right;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

type PathfindingOptions = {
  accessibleOnly?: boolean;
  avoidCovered?: boolean;
};

export function dijkstra(
  graph: CampusGraph,
  startId: string,
  endId: string,
  options?: PathfindingOptions,
): RouteResult | null {
  const startNode = getNodeById(graph, startId);
  const endNode = getNodeById(graph, endId);
  if (!startNode || !endNode) return null;

  if (startId === endId) {
    return { path: [startId], totalDistance: 0, walkingTimeSeconds: 0, nodesExplored: 1 };
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const node of graph.nodes) {
    dist.set(node.id, Infinity);
    prev.set(node.id, null);
  }
  dist.set(startId, 0);

  const pq = new MinHeap();
  pq.push(startId, 0);
  let nodesExplored = 0;

  while (pq.size > 0) {
    const { id: current } = pq.pop()!;

    if (visited.has(current)) continue;
    visited.add(current);
    nodesExplored++;

    if (current === endId) break;

    const neighbors = getNeighbors(graph, current, options);
    for (const { node: neighbor, edge } of neighbors) {
      if (visited.has(neighbor.id)) continue;
      const newDist = dist.get(current)! + edge.weight;
      if (newDist < dist.get(neighbor.id)!) {
        dist.set(neighbor.id, newDist);
        prev.set(neighbor.id, current);
        pq.push(neighbor.id, newDist);
      }
    }
  }

  if (dist.get(endId) === Infinity) return null;

  const path: string[] = [];
  let current: string | null = endId;
  while (current !== null) {
    path.unshift(current);
    current = prev.get(current) ?? null;
  }

  const totalDistance = Math.round(dist.get(endId)! * 100) / 100;
  return {
    path,
    totalDistance,
    walkingTimeSeconds: Math.round(totalDistance / 1.2),
    nodesExplored,
  };
}

export function aStar(
  graph: CampusGraph,
  startId: string,
  endId: string,
  options?: PathfindingOptions,
): RouteResult | null {
  const startNode = getNodeById(graph, startId);
  const endNode = getNodeById(graph, endId);
  if (!startNode || !endNode) return null;

  if (startId === endId) {
    return { path: [startId], totalDistance: 0, walkingTimeSeconds: 0, nodesExplored: 1 };
  }

  const gScore = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const closed = new Set<string>();

  for (const node of graph.nodes) {
    gScore.set(node.id, Infinity);
    prev.set(node.id, null);
  }
  gScore.set(startId, 0);

  const h = (nodeId: string): number => {
    const node = getNodeById(graph, nodeId)!;
    return euclideanDistance(node, endNode);
  };

  const open = new MinHeap();
  open.push(startId, h(startId));
  let nodesExplored = 0;

  while (open.size > 0) {
    const { id: current } = open.pop()!;

    if (closed.has(current)) continue;
    closed.add(current);
    nodesExplored++;

    if (current === endId) break;

    const neighbors = getNeighbors(graph, current, options);
    for (const { node: neighbor, edge } of neighbors) {
      if (closed.has(neighbor.id)) continue;
      const tentativeG = gScore.get(current)! + edge.weight;
      if (tentativeG < gScore.get(neighbor.id)!) {
        gScore.set(neighbor.id, tentativeG);
        prev.set(neighbor.id, current);
        open.push(neighbor.id, tentativeG + h(neighbor.id));
      }
    }
  }

  if (gScore.get(endId) === Infinity) return null;

  const path: string[] = [];
  let current: string | null = endId;
  while (current !== null) {
    path.unshift(current);
    current = prev.get(current) ?? null;
  }

  const totalDistance = Math.round(gScore.get(endId)! * 100) / 100;
  return {
    path,
    totalDistance,
    walkingTimeSeconds: Math.round(totalDistance / 1.2),
    nodesExplored,
  };
}

export function compareAlgorithms(
  graph: CampusGraph,
  startId: string,
  endId: string,
  options?: PathfindingOptions,
): AlgoComparison {
  const dResult = dijkstra(graph, startId, endId, options);
  const aResult = aStar(graph, startId, endId, options);

  if (aResult && dResult) {
    return {
      dijkstra: dResult,
      aStar: aResult,
      recommended: "aStar",
      reason: `A* explored ${aResult.nodesExplored} nodes vs Dijkstra's ${dResult.nodesExplored}, using heuristic-guided search for faster pathfinding.`,
    };
  }

  if (!aResult && dResult) {
    return {
      dijkstra: dResult,
      aStar: null,
      recommended: "dijkstra",
      reason: "A* failed to find a path; Dijkstra found one.",
    };
  }

  return {
    dijkstra: dResult,
    aStar: aResult,
    recommended: "aStar",
    reason: aResult
      ? "A* found a path."
      : "No path found by either algorithm.",
  };
}
