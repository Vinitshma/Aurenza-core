'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { LayerPanel } from './canvas/LayerPanel';
import { CanvasRenderer } from './canvas/CanvasRenderer';
import { useCanvasState } from './canvas/useCanvasState';
import { CanvasControls } from './canvas/CanvasControls';

export default function InfiniteCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    layers,
    currentLayerId,
    tool,
    strokeColor,
    strokeOpacity,
    strokeWidth,
    zoom,
    pan,
    isDrawing,
    currentPath,
    history,
    historyIndex,
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
  } = useCanvasState();

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      {/* Toolbar */}
      <CanvasToolbar
        tool={tool}
        strokeColor={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        onToolChange={setTool}
        onStrokeColorChange={setStrokeColor}
        onStrokeOpacityChange={setStrokeOpacity}
        onStrokeWidthChange={setStrokeWidth}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Main Canvas Area */}
      <div className="flex h-full">
        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-grab"
        >
          <CanvasRenderer
            ref={canvasRef}
            layers={layers}
            currentLayerId={currentLayerId}
            zoom={zoom}
            pan={pan}
            tool={tool}
            strokeColor={strokeColor}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            isDrawing={isDrawing}
            currentPath={currentPath}
            onStartDrawing={startDrawing}
            onContinueDrawing={continueDrawing}
            onEndDrawing={endDrawing}
            onPanChange={setPan}
          />
          
          {/* Canvas Controls */}
          <CanvasControls
            zoom={zoom}
            onZoomChange={setZoom}
            onResetView={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          />
        </div>

        {/* Layer Panel */}
        <LayerPanel
          layers={layers}
          currentLayerId={currentLayerId}
          onAddLayer={addLayer}
          onDeleteLayer={deleteLayer}
          onSelectLayer={setCurrentLayer}
          onUpdateLayer={updateLayerProperty}
          onAddImage={addImageToCurrentLayer}
          onToggleExpansion={toggleLayerExpansion}
        />
      </div>
    </div>
  );
}