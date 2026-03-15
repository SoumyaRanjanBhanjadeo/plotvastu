import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const AnalyticsTool = ({ isOpen, onClose }) => {
  const nodeRef = useRef(null);
  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".draggable-header">
      <div ref={nodeRef} className="draggable-panel">
        <div className="draggable-header">
          <span className="draggable-title">Analytics</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="draggable-content">
          <p className="text-sm text-gray-600">Basic analytics and charts will appear here.</p>
          {/* Add charts/stats */}
        </div>
      </div>
    </Draggable>
  );
};

export default AnalyticsTool;
