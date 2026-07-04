"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { CAMPUS_GRAPH } from "@/data/graph";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface MapCanvasProps {
  currentPath: string[];
}

export default function MapCanvas({ currentPath }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfCanvas, setPdfCanvas] = useState<HTMLCanvasElement | null>(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let active = true;

    async function loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: "/map.pdf" });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!active) return;

        const offscreenCanvas = document.createElement("canvas");
        const pdfCtx = offscreenCanvas.getContext("2d");
        if (!pdfCtx) return;

        const viewport = page.getViewport({ scale: 3.0 });
        offscreenCanvas.width = viewport.width;
        offscreenCanvas.height = viewport.height;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: pdfCtx, viewport } as any).promise;

        if (active) {
          setPdfCanvas(offscreenCanvas);
          setPdfDimensions({ width: viewport.width, height: viewport.height });
        }
      } catch (error) {
        console.error("Failed to load PDF map:", error);
      }
    }

    loadPdf();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || pdfDimensions.width === 0) return;

    const container = containerRef.current;
    const padding = 50;
    const scaleX = (container.clientWidth - padding * 2) / pdfDimensions.width;
    const scaleY = (container.clientHeight - padding * 2) / pdfDimensions.height;
    const initialScale = Math.min(scaleX, scaleY);

    setTransform({
      scale: initialScale,
      x: (container.clientWidth - (pdfDimensions.width * initialScale)) / 2,
      y: (container.clientHeight - (pdfDimensions.height * initialScale)) / 2,
    });
  }, [pdfDimensions]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomIntensity = 0.1;
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * zoomIntensity);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform((prev) => ({
      ...prev,
      x: mouseX - (mouseX - prev.x) * zoom,
      y: mouseY - (mouseY - prev.y) * zoom,
      scale: prev.scale * zoom,
    }));
  };

  const getNodeCoordinates = useCallback((nodeId: string, currentTransform: typeof transform) => {
    const node = CAMPUS_GRAPH.nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    const mapWidth = pdfDimensions.width || 1000;
    const mapHeight = pdfDimensions.height || 1000;

    const pixelX = (node.x / 100) * mapWidth;
    const pixelY = (node.y / 100) * mapHeight;

    return {
      x: pixelX * currentTransform.scale + currentTransform.x,
      y: pixelY * currentTransform.scale + currentTransform.y,
    };
  }, [pdfDimensions]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pdfCanvas) {
      ctx.drawImage(
        pdfCanvas,
        transform.x,
        transform.y,
        pdfDimensions.width * transform.scale,
        pdfDimensions.height * transform.scale
      );
    }

    ctx.lineWidth = 2;
    CAMPUS_GRAPH.edges.forEach((edge) => {
      const start = getNodeCoordinates(edge.from, transform);
      const end = getNodeCoordinates(edge.to, transform);
      if (!start || !end) return;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);

      if (!edge.accessible) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      } else if (edge.covered) {
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      }

      ctx.stroke();
      ctx.setLineDash([]);
    });

    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#10b981";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < currentPath.length; i++) {
        const pos = getNodeCoordinates(currentPath[i], transform);
        if (!pos) continue;
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      }

      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    CAMPUS_GRAPH.nodes.forEach((node) => {
      const pos = getNodeCoordinates(node.id, transform);
      if (!pos) return;

      const isStart = currentPath[0] === node.id;
      const isEnd = currentPath[currentPath.length - 1] === node.id && currentPath.length > 0;
      const isInPath = currentPath.includes(node.id);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isInPath ? 10 : 6, 0, Math.PI * 2);

      if (isStart) {
        ctx.fillStyle = "#3b82f6";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
      } else if (isEnd) {
        ctx.fillStyle = "#ef4444";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
      } else if (isInPath) {
        ctx.fillStyle = "#10b981";
        ctx.strokeStyle = "transparent";
      } else {
        ctx.fillStyle = "#64748b";
        ctx.strokeStyle = "transparent";
      }

      ctx.fill();
      if (isStart || isEnd) ctx.stroke();

      if (isStart || isEnd || transform.scale > 0.8) {
        ctx.fillStyle = "#1e293b";
        ctx.font = "600 14px Inter, sans-serif";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.strokeText(node.label, pos.x, pos.y - 15);
        ctx.textAlign = "center";
        ctx.fillText(node.label, pos.x, pos.y - 15);
      }
    });
  }, [pdfCanvas, transform, pdfDimensions, currentPath, getNodeCoordinates]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        drawGraph();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [drawGraph]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gray-50 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
