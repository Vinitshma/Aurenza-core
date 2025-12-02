'use client';

import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetView: () => void;
}

export function CanvasControls({ zoom, onZoomChange, onResetView }: CanvasControlsProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(5, zoom * 1.2));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.1, zoom / 1.2));
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <button onClick={handleZoomIn}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Zoom in">
            <ZoomIn size={18} />
        </button>
        <div className="text-center py-1">
            <span className="text-white text-xs font-mono">
                {Math.round(zoom * 100)}%
            </span>
        </div>
        <button onClick={handleZoomOut}
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Zoom out">
            <ZoomOut size={18} />
        </button>      
      </div>
          {/* Reset View */}      
        <button onClick={onResetView}
          className="bg-gray-800 rounded-lg shadow-lg p-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors" title="Reset view">
          <RotateCcw size={18} />
        </button>
    </div>   
    );
}