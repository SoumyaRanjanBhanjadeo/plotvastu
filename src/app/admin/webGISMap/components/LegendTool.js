import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

const LegendTool = ({ isOpen, onClose }) => {
  const nodeRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".draggable-header">
      <div ref={nodeRef} className="draggable-panel">
        <div className="draggable-header">
          <span className="draggable-title">Map Legend</span>
          <div className="flex items-center gap-1">
            <button className="minimize-btn" onClick={() => setIsMinimized(p => !p)} title={isMinimized ? 'Restore' : 'Minimize'}>
              {isMinimized ? '▢' : '-'}
            </button>
            <button className="close-btn" title='close' onClick={onClose}>&times;</button>
          </div>
        </div>
        {!isMinimized && (
          <div className="draggable-content">
            <p className="text-sm text-gray-600">Legend indicating map symbology will appear here.</p>
            {/* Add legend table */}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default LegendTool;
