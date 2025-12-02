'use client';

import { useState, useCallback } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface Path {
  points: Point[];
  color: string;
  opacity: number;
  width: number;
}

export interface CanvasImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Layer {
  id: string;
  name: string;
  description?: string;
  visible: boolean;
  opacity: number;
  paths: Path[];
  images: CanvasImage[];
  parentId?: string; // For nested layers
  children: string[]; // Child layer IDs
  depth: number; // Nesting level
  expanded: boolean; // For UI tree view
}

export type Tool = 'pan' | 'pencil' | 'eraser' | 'image';

export interface CanvasState {
  layers: Layer[];
  currentLayerId: string;
  tool: Tool;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;
  zoom: number;
  pan: Point;
  isDrawing: boolean;
  currentPath: Point[] | null;
  history: Layer[][];
  historyIndex: number;
}

let layerCounter = 1;

export function useCanvasState() {
  const [state, setState] = useState<CanvasState>(() => {
    const initialLayer: Layer = {
      id: 'layer-1',
      name: 'Layer 1',
      visible: true,
      opacity: 1,
      paths: [],
      images: [],
      children: [],
      depth: 0,
      expanded: true
    };
    
    return {
      layers: [initialLayer],
      currentLayerId: 'layer-1',
      tool: 'pencil' as Tool,
      strokeColor: '#ffffff',
      strokeOpacity: 1,
      strokeWidth: 2,
      zoom: 1,
      pan: { x: 0, y: 0 },
      isDrawing: false,
      currentPath: null,
      history: [[initialLayer]],
      historyIndex: 0
    };
  });

  const addToHistory = useCallback((newLayers: Layer[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newLayers)));
      
      return {
        ...prev,
        layers: newLayers,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const addLayer = useCallback((parentId?: string) => {
    layerCounter++;
    const parentLayer = parentId ? state.layers.find(l => l.id === parentId) : null;
    const depth = parentLayer ? parentLayer.depth + 1 : 0;
    
    const newLayer: Layer = {
      id: `layer-${layerCounter}`,
      name: `Layer ${layerCounter}`,
      visible: true,
      opacity: 1,
      paths: [],
      images: [],
      parentId,
      children: [],
      depth,
      expanded: true
    };
    
    let newLayers = [...state.layers, newLayer];
    
    // Update parent's children array if this is a nested layer
    if (parentId) {
      newLayers = newLayers.map(layer => 
        layer.id === parentId 
          ? { ...layer, children: [...layer.children, newLayer.id] }
          : layer
      );
    }
    
    addToHistory(newLayers);
    setState(prev => ({ ...prev, currentLayerId: newLayer.id }));
  }, [state.layers, addToHistory]);

  const deleteLayer = useCallback((layerId: string) => {
    const layerToDelete = state.layers.find(l => l.id === layerId);
    if (!layerToDelete || state.layers.length <= 1) return;
    
    // Get all descendant layer IDs (including children of children)
    const getDescendants = (id: string): string[] => {
      const layer = state.layers.find(l => l.id === id);
      if (!layer) return [];
      
      let descendants = [...layer.children];
      layer.children.forEach(childId => {
        descendants = [...descendants, ...getDescendants(childId)];
      });
      return descendants;
    };
    
    const toDelete = [layerId, ...getDescendants(layerId)];
    let newLayers = state.layers.filter(layer => !toDelete.includes(layer.id));
    
    // Remove from parent's children array
    if (layerToDelete.parentId) {
      newLayers = newLayers.map(layer => 
        layer.id === layerToDelete.parentId
          ? { ...layer, children: layer.children.filter(id => id !== layerId) }
          : layer
      );
    }
    
    addToHistory(newLayers);
    
    if (toDelete.includes(state.currentLayerId)) {
      setState(prev => ({ 
        ...prev, 
        currentLayerId: newLayers[0]?.id || '' 
      }));
    }
  }, [state.layers, state.currentLayerId, addToHistory]);

  const setCurrentLayer = useCallback((layerId: string) => {
    setState(prev => ({ ...prev, currentLayerId: layerId }));
  }, []);

  const updateLayerProperty = useCallback((layerId: string, property: keyof Layer, value: unknown) => {
    const newLayers = state.layers.map(layer =>
      layer.id === layerId ? { ...layer, [property]: value } : layer
    );
    addToHistory(newLayers);
  }, [state.layers, addToHistory]);

  const setTool = useCallback((tool: Tool) => {
    setState(prev => ({ ...prev, tool }));
  }, []);

  const setStrokeColor = useCallback((color: string) => {
    setState(prev => ({ ...prev, strokeColor: color }));
  }, []);

  const setStrokeOpacity = useCallback((opacity: number) => {
    setState(prev => ({ ...prev, strokeOpacity: opacity }));
  }, []);

  const setStrokeWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, strokeWidth: width }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }));
  }, []);

  const setPan = useCallback((pan: Point) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  const startDrawing = useCallback((point: Point) => {
    if (state.tool !== 'pencil') return;
    
    setState(prev => ({
      ...prev,
      isDrawing: true,
      currentPath: [point]
    }));
  }, [state.tool]);

  const continueDrawing = useCallback((point: Point) => {
    if (!state.isDrawing || !state.currentPath) return;
    
    setState(prev => ({
      ...prev,
      currentPath: [...prev.currentPath!, point]
    }));
  }, [state.isDrawing, state.currentPath]);

  const endDrawing = useCallback(() => {
    if (!state.isDrawing || !state.currentPath || state.currentPath.length < 2) {
      setState(prev => ({ ...prev, isDrawing: false, currentPath: null }));
      return;
    }

    const newPath: Path = {
      points: state.currentPath,
      color: state.strokeColor,
      opacity: state.strokeOpacity,
      width: state.strokeWidth
    };

    const newLayers = state.layers.map(layer =>
      layer.id === state.currentLayerId
        ? { ...layer, paths: [...layer.paths, newPath] }
        : layer
    );

    addToHistory(newLayers);
    setState(prev => ({ ...prev, isDrawing: false, currentPath: null }));
  }, [state.isDrawing, state.currentPath, state.strokeColor, state.strokeOpacity, state.strokeWidth, state.layers, state.currentLayerId, addToHistory]);

  const addImageToCurrentLayer = useCallback((src: string) => {
    const newImage: CanvasImage = {
      id: `image-${Date.now()}`,
      src,
      x: 0,
      y: 0,
      width: 200,
      height: 200
    };

    const newLayers = state.layers.map(layer =>
      layer.id === state.currentLayerId
        ? { ...layer, images: [...layer.images, newImage] }
        : layer
    );

    addToHistory(newLayers);
  }, [state.layers, state.currentLayerId, addToHistory]);

  const undo = useCallback(() => {
    if (state.historyIndex > 0) {
      setState(prev => ({
        ...prev,
        layers: prev.history[prev.historyIndex - 1],
        historyIndex: prev.historyIndex - 1
      }));
    }
  }, [state.historyIndex]);

  const redo = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      setState(prev => ({
        ...prev,
        layers: prev.history[prev.historyIndex + 1],
        historyIndex: prev.historyIndex + 1
      }));
    }
  }, [state.historyIndex, state.history.length]);

  const clearCanvas = useCallback(() => {
    const clearedLayers = state.layers.map(layer => ({
      ...layer,
      paths: [],
      images: []
    }));
    addToHistory(clearedLayers);
  }, [state.layers, addToHistory]);

  const toggleLayerExpansion = useCallback((layerId: string) => {
    const newLayers = state.layers.map(layer =>
      layer.id === layerId
        ? { ...layer, expanded: !layer.expanded }
        : layer
    );
    setState(prev => ({ ...prev, layers: newLayers }));
  }, [state.layers]);

  return {
    layers: state.layers,
    currentLayerId: state.currentLayerId,
    tool: state.tool,
    strokeColor: state.strokeColor,
    strokeOpacity: state.strokeOpacity,
    strokeWidth: state.strokeWidth,
    zoom: state.zoom,
    pan: state.pan,
    isDrawing: state.isDrawing,
    currentPath: state.currentPath,
    history: state.history,
    historyIndex: state.historyIndex,
    addLayer,
    deleteLayer,
    setCurrentLayer,
    updateLayerProperty,
    setTool,
    setStrokeColor,
    setStrokeOpacity,
    setStrokeWidth,
    setZoom,
    setPan,
    startDrawing,
    continueDrawing,
    endDrawing,
    addImageToCurrentLayer,
    undo,
    redo,
    clearCanvas,
    toggleLayerExpansion
  };
}