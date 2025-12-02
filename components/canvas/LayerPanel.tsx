'use client';
import React, { useState } from 'react';
import { Layer } from './useCanvasState';
import { Plus, Trash2, Eye, EyeOff, Edit3, Check, X, Upload, Image as ImageIcon, ChevronDown, ChevronRight, CornerDownRight } from 'lucide-react';

interface LayerPanelProps {
    layers: Layer[];
    currentLayerId: string;
    onAddLayer: (parentId?: string) => void;
    onDeleteLayer: (layerId: string) => void;
    onSelectLayer: (layerId: string) => void;
    onUpdateLayer: (layerId: string, property: keyof Layer, value: any) => void;
    onAddImage: (src: string) => void;
    onToggleExpansion: (layerId: string) => void;
}


export function LayerPanel({
    layers,
    currentLayerId,
    onAddLayer,
    onDeleteLayer,
    onSelectLayer,
    onUpdateLayer,
    onAddImage,
    onToggleExpansion
}: LayerPanelProps) {
    const [editingLayer, setEditingLayer] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const handleEditStart = (layer: Layer) => {
        setEditingLayer(layer.id);
        setEditName(layer.name);
        setEditDescription(layer.description || '');
    };
    const handleEditSave = () => {
        if (editingLayer) {
            onUpdateLayer(editingLayer, 'name', editName);
            onUpdateLayer(editingLayer, 'description', editDescription);
            setEditingLayer(null);
        }
    };
    const handleEditCancel = () => {
        setEditingLayer(null);
        setEditName('');
        setEditDescription('');
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) {
                        onAddImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper function to get layers in hierarchical order for display
    const getDisplayLayers = () => {
        const rootLayers = layers.filter(layer => !layer.parentId);
        const result: Layer[] = [];
        
        const addLayerAndChildren = (layer: Layer) => {
            result.push(layer);
            if (layer.expanded && layer.children.length > 0) {
                layer.children.forEach(childId => {
                    const childLayer = layers.find(l => l.id === childId);
                    if (childLayer) {
                        addLayerAndChildren(childLayer);

                    }
                });
            }
        };
        
        rootLayers.forEach(addLayerAndChildren);
        return result;
    };
     const renderLayerItem = (layer: Layer) => {
        return (
            <div key={layer.id}
                className={`border-b border-gray-700 transition-colors ${
                    layer.id === currentLayerId 
                        ? 'bg-blue-600/20 border-blue-600/50' 
                        : 'hover:bg-gray-700/50'

            }`}
                style={{ marginLeft: `${layer.depth * 16}px` }}>
                <div className="p-3 cursor-pointer" onClick={() => onSelectLayer(layer.id)}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                {/* Expansion toggle for layers with children */}
                                {layer.children.length > 0 ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleExpansion(layer.id);

                                    }}
                                        className="p-0.5 text-gray-400 hover:text-white transition-colors"
                                        title={layer.expanded ? 'Collapse' : 'Expand'}
                                    >
                                        {layer.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                ) : (
                                    <div className="w-5 flex justify-center">
                                        {layer.depth > 0 && <CornerDownRight size={14} className="text-gray-500" />}
                                    </div>

                            )}
                                
                                {editingLayer === layer.id ? (
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                            placeholder="Layer name"
                                            autoFocus
                                        />
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm resize-none"
                                            placeholder="Description (optional)"
                                            rows={2}
                                        />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditSave();

                                            }}
                                                className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                title="Save"
                                            >
                                                <Check size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditCancel();

                                            }}
                                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                title="Cancel"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium text-sm truncate">
                                                {layer.name}
                                            </span>
                                            <span className="text-xs text-blue-400">
                                                D{layer.depth}
                                            </span>
                                            {layer.children.length > 0 && (
                                                <span className="text-xs text-gray-400">
                                                    ({layer.children.length} children)
                                                </span>
                                            )}
                                        </div>
                                        {layer.description && (
                                            <p className="text-gray-400 text-xs mt-1 truncate">
                                                {layer.description}
                                            </p>

                                    )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-gray-400">
                                                {layer.paths.length} paths
                                            </span>
                                            {layer.images.length > 0 && (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <ImageIcon size={10} />
                                                    {layer.images.length}
                                                </span>

                                        )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {editingLayer !== layer.id && (
                                <div className="flex gap-1 ml-2">
                                    {/* Add child layer button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddLayer(layer.id);

                                    }}
                                        className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                        title="Add child layer"
                                    >
                                        <Plus size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateLayer(layer.id, 'visible', !layer.visible);

                                    }}
                                        className={`p-1 rounded transition-colors ${
                                            layer.visible 
                                                ? 'text-gray-300 hover:text-white' 
                                                : 'text-gray-600 hover:text-gray-400'

                                    }`}
                                        title={layer.visible ? 'Hide layer' : 'Show layer'}
                                    >
                                        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditStart(layer);

                                    }}
                                        className="p-1 text-gray-300 hover:text-white rounded transition-colors"
                                        title="Edit layer"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    {layers.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteLayer(layer.id);

                                        }}
                                            className="p-1 text-red-400 hover:text-red-300 rounded transition-colors"
                                            title="Delete layer and all children"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {editingLayer !== layer.id && (
                            <div className="mt-2 ml-5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Opacity:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={layer.opacity}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            onUpdateLayer(layer.id, 'opacity', parseFloat(e.target.value));

                                    }}
                                        className="flex-1 accent-blue-600"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="text-xs text-gray-400 w-8">
                                        {Math.round(layer.opacity * 100)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
     };

     return (
         <div className="w-80 bg-gray-800 border-l border-gray-700 h-full overflow-hidden flex flex-col">
             {/* Header */}
             <div className="p-4 border-b border-gray-700">
                 <div className="flex items-center justify-between mb-3">
                     <h2 className="text-white font-semibold">Nested Layers</h2>
                     <button 
                         onClick={() => onAddLayer()} 
                         className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                         title="Add new root layer"
                     >
                         <Plus size={16} />
                     </button>
                 </div>
                 
                 {/* Image Upload */}
                 <div className="flex gap-2">
                     <label className="flex-1 p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 cursor-pointer text-center text-sm transition-colors">
                         <div className="flex items-center justify-center gap-2">
                             <Upload size={16} />
                             Upload Image
                         </div>
                         <input
                             type="file"
                             accept="image/*"
                             onChange={handleImageUpload}
                             className="hidden"
                         />
                     </label>
                 </div>
             </div>
             {/* Layers List */}
             <div className="flex-1 overflow-y-auto">
                 {getDisplayLayers().map(layer => renderLayerItem(layer))}
             </div>
         </div>
     );
 }