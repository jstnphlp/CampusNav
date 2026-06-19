import type { CampusGraph, CampusNode, CampusEdge } from "@/types/campus";

export function getNodeById(
  graph: CampusGraph,
  id: string,
): CampusNode | undefined {
  return graph.nodes.find((n) => n.id === id);
}

export function getNeighbors(
  graph: CampusGraph,
  nodeId: string,
  options?: { accessibleOnly?: boolean; avoidCovered?: boolean },
): { node: CampusNode; edge: CampusEdge }[] {
  const neighbors: { node: CampusNode; edge: CampusEdge }[] = [];

  for (const edge of graph.edges) {
    let neighborId: string | null = null;

    if (edge.from === nodeId) {
      neighborId = edge.to;
    } else if (edge.to === nodeId) {
      neighborId = edge.from;
    }

    if (!neighborId) continue;
    if (options?.accessibleOnly && !edge.accessible) continue;
    if (options?.avoidCovered && edge.covered) continue;

    const node = getNodeById(graph, neighborId);
    if (node) {
      neighbors.push({ node, edge });
    }
  }

  return neighbors;
}

export function euclideanDistance(a: CampusNode, b: CampusNode): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
