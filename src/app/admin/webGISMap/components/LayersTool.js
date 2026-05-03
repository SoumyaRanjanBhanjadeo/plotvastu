import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

const LayersTool = ({ isOpen, onClose }) => {
  const nodeRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".draggable-header">
      <div ref={nodeRef} className="draggable-panel">
        <div className="draggable-header">
          <span className="draggable-title">Map Layers</span>
          <div className="flex items-center gap-1">
            <button className="minimize-btn" onClick={() => setIsMinimized(p => !p)} title={isMinimized ? 'Restore' : 'Minimize'}>
              {isMinimized ? '▢' : '-'}
            </button>
            <button className="close-btn" title='close' onClick={onClose}>&times;</button>
          </div>
        </div>
        {!isMinimized && (
          <div className="draggable-content">
            <p className="text-sm text-gray-600">Layer toggles and opacity controls will appear here.</p>
            {/* Add layers checklist */}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default LayersTool;
