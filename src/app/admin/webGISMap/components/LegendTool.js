import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const LegendTool = ({ isOpen, onClose }) => {
  const nodeRef = useRef(null);
  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".draggable-header">
      <div ref={nodeRef} className="draggable-panel">
        <div className="draggable-header">
          <span className="draggable-title">Map Legend</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="draggable-content">
          <p className="text-sm text-gray-600">Legend indicating map symbology will appear here.</p>
          {/* Add legend table */}
        </div>
      </div>
    </Draggable>
  );
};

export default LegendTool;
