'use client';

import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { Layer, Point, Tool } from './useCanvasState';

interface CanvasRendererProps {
  layers: Layer[];
  currentLayerId: string;
  zoom: number;
  pan: Point;
  tool: Tool;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;
  isDrawing: boolean;
  currentPath: Point[] | null;
  onStartDrawing: (point: Point) => void;
  onContinueDrawing: (point: Point) => void;
  onEndDrawing: () => void;
  onPanChange: (pan: Point) => void;
}

export const CanvasRenderer = forwardRef<HTMLCanvasElement, CanvasRendererProps>(
  ({
    layers,
    currentLayerId,
    zoom,
    pan,
    tool,
    strokeColor,
    strokeOpacity,
    strokeWidth,
    isDrawing,
    currentPath,
    onStartDrawing,
    onContinueDrawing,
    onEndDrawing,
    onPanChange
  }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
    const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

    // Handle canvas resize
    useEffect(() => {
      const updateCanvasSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setCanvasSize({
            width: rect.width,
            height: rect.height
          });
        }
      };

      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Convert screen coordinates to canvas coordinates
    const screenToCanvas = useCallback((screenX: number, screenY: number): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      const x = (screenX - rect.left - canvasSize.width / 2 - pan.x) / zoom;
      const y = (screenY - rect.top - canvasSize.height / 2 - pan.y) / zoom;
      
      return { x, y };
    }, [zoom, pan, canvasSize]);

    // Convert canvas coordinates to screen coordinates
    const canvasToScreen = useCallback((canvasX: number, canvasY: number): Point => {
      const x = canvasX * zoom + canvasSize.width / 2 + pan.x;
      const y = canvasY * zoom + canvasSize.height / 2 + pan.y;
      return { x, y };
    }, [zoom, pan, canvasSize]);

    // Load images and cache them
    const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (imageCache.current.has(src)) {
          resolve(imageCache.current.get(src)!);
          return;
        }

        const img = new Image();
        img.onload = () => {
          imageCache.current.set(src, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    }, []);

    // Draw grid
    const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
      const gridSize = 50;
      const scaledGridSize = gridSize * zoom;
      
      if (scaledGridSize < 10) return; // Don't draw grid when too zoomed out

      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;

      const startX = (-pan.x % scaledGridSize) - scaledGridSize;
      const startY = (-pan.y % scaledGridSize) - scaledGridSize;

      ctx.beginPath();
      
      // Vertical lines
      for (let x = startX; x < canvasSize.width + scaledGridSize; x += scaledGridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
      }
      
      // Horizontal lines
      for (let y = startY; y < canvasSize.height + scaledGridSize; y += scaledGridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
      }
      
      ctx.stroke();
      ctx.globalAlpha = 1;
    }, [zoom, pan, canvasSize]);

    // Draw a path
    const drawPath = useCallback((ctx: CanvasRenderingContext2D, points: Point[], color: string, opacity: number, width: number) => {
      if (points.length < 2) return;

      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = width * zoom;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      const firstPoint = canvasToScreen(points[0].x, points[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < points.length; i++) {
        const point = canvasToScreen(points[i].x, points[i].y);
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    }, [zoom, canvasToScreen]);

    // Draw an image
    const drawImage = useCallback(async (ctx: CanvasRenderingContext2D, img: any) => {
      try {
        const loadedImg = await loadImage(img.src);
        const topLeft = canvasToScreen(img.x, img.y);
        const width = img.width * zoom;
        const height = img.height * zoom;
        
        ctx.globalAlpha = 1;
        ctx.drawImage(loadedImg, topLeft.x, topLeft.y, width, height);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    }, [zoom, canvasToScreen, loadImage]);

    // Main render function
    const render = useCallback(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw grid
      drawGrid(ctx);

      // Helper function to check if a layer should be visible
      const isLayerVisible = (layer: Layer): boolean => {
        if (!layer.visible) return false;
        
        // Check parent visibility
        if (layer.parentId) {
          const parent = layers.find(l => l.id === layer.parentId);
          if (parent && !isLayerVisible(parent)) {
            return false;
          }
        }
        
        return true;
      };

      // Calculate effective opacity including parent opacity
      const getEffectiveOpacity = (layer: Layer): number => {
        let opacity = layer.opacity;
        
        if (layer.parentId) {
          const parent = layers.find(l => l.id === layer.parentId);
          if (parent) {
            opacity *= getEffectiveOpacity(parent);
          }
        }
        
        return opacity;
      };

      // Draw layers in depth order (parents before children)
      const sortedLayers = [...layers].sort((a, b) => a.depth - b.depth);
      
      for (const layer of sortedLayers) {
        if (!isLayerVisible(layer)) continue;

        const effectiveOpacity = getEffectiveOpacity(layer);
        ctx.globalAlpha = effectiveOpacity;

        // Draw paths
        for (const path of layer.paths) {
          drawPath(ctx, path.points, path.color, path.opacity * effectiveOpacity, path.width);
        }

        // Draw images
        for (const img of layer.images) {
          await drawImage(ctx, img);
        }
      }

      // Draw current path being drawn
      if (isDrawing && currentPath && currentPath.length > 1) {
        ctx.globalAlpha = strokeOpacity;
        drawPath(ctx, currentPath, strokeColor, strokeOpacity, strokeWidth);
      }

      ctx.globalAlpha = 1;
    }, [layers, isDrawing, currentPath, strokeColor, strokeOpacity, strokeWidth, canvasSize, drawGrid, drawPath, drawImage]);

    // Render on changes
    useEffect(() => {
      render();
    }, [render]);

    // Handle mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
      const point = screenToCanvas(e.clientX, e.clientY);
      
      if (tool === 'pan' || e.button === 1) { // Middle mouse button for panning
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      } else if (tool === 'pencil') {
        onStartDrawing(point);
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isPanning && lastPanPoint) {
        const deltaX = e.clientX - lastPanPoint.x;
        const deltaY = e.clientY - lastPanPoint.y;
        onPanChange({
          x: pan.x + deltaX,
          y: pan.y + deltaY
        });
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      } else if (isDrawing && tool === 'pencil') {
        const point = screenToCanvas(e.clientX, e.clientY);
        onContinueDrawing(point);
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        setLastPanPoint(null);
      } else if (isDrawing) {
        onEndDrawing();
      }
    };

    // Handle wheel for zooming
    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      
      // Zoom towards mouse position
      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = newZoom / zoom;
      const newPanX = mouseX - (mouseX - pan.x) * zoomFactor;
      const newPanY = mouseY - (mouseY - pan.y) * zoomFactor;
      
      onPanChange({ x: newPanX, y: newPanY });
    };

    return (
      <div 
        ref={containerRef}
        className="w-full h-full relative"
        style={{ cursor: tool === 'pan' || isPanning ? 'grab' : 'crosshair' }}
      >
        <canvas
          ref={(canvas) => {
            canvasRef.current = canvas;
            if (typeof ref === 'function') {
              ref(canvas);
            } else if (ref) {
              ref.current = canvas;
            }
          }}
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute inset-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div> )}); 
      
    CanvasRenderer.displayName = 'CanvasRenderer';