'use client';

import React from 'react';
import { Tool } from './useCanvasState';
import {Pencil,Move,Eraser,Image,Undo2,Redo2,Trash2,  Palette,  Minus,  Plus} from 'lucide-react';

interface CanvasToolbarProps {  
    tool: Tool;
    strokeColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    onToolChange: (tool: Tool) => void;
    onStrokeColorChange: (color: string) => void;  
    onStrokeOpacityChange: (opacity: number) => void;  
    onStrokeWidthChange: (width: number) => void;  
    onUndo: () => void;  
    onRedo: () => void;  
    onClear: () => void;  canUndo: boolean;  canRedo: boolean;
}
    
const PRESET_COLORS = [  '#ffffff', '#000000', '#ef4444', '#f97316','#eab308', '#22c55e', '#3b82f6', '#8b5cf6','#ec4899', '#6b7280'];
    
export function CanvasToolbar({  tool,  strokeColor,  strokeOpacity,  strokeWidth,  onToolChange,  onStrokeColorChange,  onStrokeOpacityChange,  onStrokeWidthChange,  onUndo,  onRedo,  onClear,  canUndo,  canRedo}: CanvasToolbarProps) {  
    return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-2">
          {/* Tool Selection */}
            <div className="flex gap-1">
                <button onClick={() => onToolChange('pan')}
                className={`p-2 rounded-md transition-colors ${
                tool === 'pan'? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600' }`}
                title="Pan Tool">
                    <Move size={18} />
                </button>
                <button onClick={() => onToolChange('pencil')} 
                className={`p-2 rounded-md transition-colors ${
                        tool === 'pencil' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                title="Pencil Tool">
                    <Pencil size={18} />
                </button>
                <button onClick={() => onToolChange('eraser')}
                 className={`p-2 rounded-md transition-colors ${
                tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                title="Eraser Tool">
                    <Eraser size={18} />
                </button>
                <button onClick={() => onToolChange('image')}
                className={`p-2 rounded-md transition-colors ${
                tool === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                title="Image Tool">
                    <Image size={18} />
                </button>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            {/* Stroke Width */}
            <div className="flex items-center gap-2">
                <button
                onClick={() => onStrokeWidthChange(Math.max(1, strokeWidth - 1))}
                className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                title="Decrease stroke width">
                    <Minus size={14} />
                </button>
                <span className="text-white text-sm min-w-[2rem] text-center">{strokeWidth}px</span>
                <button onClick={() => onStrokeWidthChange(Math.min(50, strokeWidth + 1))}
                className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                title="Increase stroke width">
                    <Plus size={14} />
                </button>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            {/* Color Picker */}
            <div className="flex items-center gap-2"><div
            className="w-8 h-8 rounded border-2 border-gray-600 cursor-pointer"
            style={{ backgroundColor: strokeColor }}
            title="Current color"/>
                <input type="color" value={strokeColor} onChange={(e) => onStrokeColorChange(e.target.value)} className="w-0 h-0 opacity-0 absolute" id="color-picker"/>
                <label htmlFor="color-picker" className="p-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer" title="Pick color">
                    <Palette size={18} />
                </label>
            </div>
            {/* Preset Colors */}
            <div className="flex gap-1">
                {PRESET_COLORS.map((color) => (
                <button key={color} onClick={() => onStrokeColorChange(color)}
                className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${ strokeColor === color ? 'border-white' : 'border-gray-600'}`}
            style={{ backgroundColor: color }} title={`Use ${color}`}/>))}
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            {/* Opacity */}
            <div className="flex items-center gap-2">
                <label className="text-white text-sm">Opacity:</label>
                <input type="range" min="0.1" max="1" step="0.1" value={strokeOpacity} onChange={(e) => onStrokeOpacityChange(parseFloat(e.target.value))} className="w-20 accent-blue-600" title={`Opacity: ${Math.round(strokeOpacity * 100)}%`}/>
                <span className="text-white text-sm w-8">{Math.round(strokeOpacity * 100)}%</span>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            {/* Actions */}
            <div className="flex gap-1">
                <button onClick={onUndo} disabled={!canUndo} className={`p-2 rounded-md transition-colors ${
                canUndo
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }`} title="Undo">
                    <Undo2 size={18} />
                </button>
                <button onClick={onRedo} disabled={!canRedo} className={`p-2 rounded-md transition-colors ${
                canRedo
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`} title="Redo">
                    <Redo2 size={18} />
                </button>
                <button onClick={onClear} className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors" title="Clear canvas" >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>    
        
    </div>  
    );
}