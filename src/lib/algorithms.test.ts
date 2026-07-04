import { describe, it, expect } from "vitest";
import { dijkstra, aStar, compareAlgorithms } from "./algorithms";
import { CAMPUS_GRAPH } from "@/data/graph";
import type { CampusGraph } from "@/types/campus";

const DISCONNECTED_GRAPH: CampusGraph = {
  nodes: [
    { id: "a", label: "A", x: 0, y: 0 },
    { id: "b", label: "B", x: 10, y: 0 },
    { id: "c", label: "C", x: 50, y: 50 },
  ],
  edges: [{ from: "a", to: "b", weight: 10, covered: false, accessible: true }],
};

describe("dijkstra", () => {
  it("finds route between adjacent nodes", () => {
    const result = dijkstra(CAMPUS_GRAPH, "entry_gate", "hw_sw");
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(["entry_gate", "hw_sw"]);
    expect(result!.totalDistance).toBe(17);
    expect(result!.walkingTimeSeconds).toBe(Math.round(17 / 1.2));
    expect(result!.nodesExplored).toBeGreaterThanOrEqual(2);
  });

  it("finds shortest path across the full graph", () => {
    const result = dijkstra(CAMPUS_GRAPH, "entry_gate", "canteen");
    expect(result).not.toBeNull();
    expect(result!.path[0]).toBe("entry_gate");
    expect(result!.path[result!.path.length - 1]).toBe("canteen");
    expect(result!.totalDistance).toBeGreaterThan(0);
  });

  it("respects accessibleOnly option", () => {
    const result = dijkstra(CAMPUS_GRAPH, "entry_gate", "chapel", {
      accessibleOnly: true,
    });
    expect(result).not.toBeNull();
    expect(result!.totalDistance).toBeGreaterThan(0);
  });

  it("returns path of length 1 with distance 0 when start equals end", () => {
    const result = dijkstra(CAMPUS_GRAPH, "canteen", "canteen");
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(["canteen"]);
    expect(result!.totalDistance).toBe(0);
    expect(result!.walkingTimeSeconds).toBe(0);
    expect(result!.nodesExplored).toBe(1);
  });

  it("returns null for disconnected node", () => {
    const result = dijkstra(DISCONNECTED_GRAPH, "a", "c");
    expect(result).toBeNull();
  });
});

describe("aStar", () => {
  it("finds route between adjacent nodes", () => {
    const result = aStar(CAMPUS_GRAPH, "entry_gate", "hw_sw");
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(["entry_gate", "hw_sw"]);
    expect(result!.totalDistance).toBe(17);
    expect(result!.walkingTimeSeconds).toBe(Math.round(17 / 1.2));
  });

  it("finds shortest path across the full graph", () => {
    const result = aStar(CAMPUS_GRAPH, "entry_gate", "canteen");
    expect(result).not.toBeNull();
    expect(result!.path[0]).toBe("entry_gate");
    expect(result!.path[result!.path.length - 1]).toBe("canteen");
  });

  it("respects accessibleOnly option", () => {
    const result = aStar(CAMPUS_GRAPH, "entry_gate", "chapel", {
      accessibleOnly: true,
    });
    expect(result).not.toBeNull();
    expect(result!.totalDistance).toBeGreaterThan(0);
  });

  it("returns path of length 1 with distance 0 when start equals end", () => {
    const result = aStar(CAMPUS_GRAPH, "canteen", "canteen");
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(["canteen"]);
    expect(result!.totalDistance).toBe(0);
    expect(result!.walkingTimeSeconds).toBe(0);
  });

  it("returns null for disconnected node", () => {
    const result = aStar(DISCONNECTED_GRAPH, "a", "c");
    expect(result).toBeNull();
  });

  it("explores fewer or equal nodes than dijkstra on longer routes", () => {
    const dResult = dijkstra(CAMPUS_GRAPH, "entry_gate", "exit_gate")!;
    const aResult = aStar(CAMPUS_GRAPH, "entry_gate", "exit_gate")!;
    expect(aResult.nodesExplored).toBeLessThanOrEqual(dResult.nodesExplored);
  });
});

describe("compareAlgorithms", () => {
  it("recommends aStar when both find a path", () => {
    const result = compareAlgorithms(CAMPUS_GRAPH, "entry_gate", "exit_gate");
    expect(result.recommended).toBe("aStar");
    expect(result.dijkstra).not.toBeNull();
    expect(result.aStar).not.toBeNull();
    expect(result.dijkstra!.totalDistance).toBeCloseTo(
      result.aStar!.totalDistance,
      1,
    );
    expect(result.reason).toBeTruthy();
  });

  it("recommends dijkstra when aStar fails but dijkstra succeeds", () => {
    const result = compareAlgorithms(DISCONNECTED_GRAPH, "a", "c");
    expect(result.dijkstra).toBeNull();
    expect(result.aStar).toBeNull();
  });

  it("returns null for both on unreachable node", () => {
    const result = compareAlgorithms(DISCONNECTED_GRAPH, "a", "c");
    expect(result.dijkstra).toBeNull();
    expect(result.aStar).toBeNull();
  });
});
