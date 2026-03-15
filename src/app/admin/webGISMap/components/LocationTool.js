import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { FiFileText } from "react-icons/fi";

const LocationTool = ({ isOpen, onClose, onGoTo }) => {
  const nodeRef = useRef(null);
  const [coordType, setCoordType] = useState('DD'); // 'DD' or 'DMS'

  // Decimal Degrees State
  const [ddLon, setDdLon] = useState('');
  const [ddLat, setDdLat] = useState('');

  // Degrees, Minutes, Seconds State
  const [dmsLonDeg, setDmsLonDeg] = useState('');
  const [dmsLonMin, setDmsLonMin] = useState('');
  const [dmsLonSec, setDmsLonSec] = useState('');
  const [dmsLatDeg, setDmsLatDeg] = useState('');
  const [dmsLatMin, setDmsLatMin] = useState('');
  const [dmsLatSec, setDmsLatSec] = useState('');

  // Clear state when closed
  useEffect(() => {
    if (!isOpen) {
      setDdLon('');
      setDdLat('');
      setDmsLonDeg('');
      setDmsLonMin('');
      setDmsLonSec('');
      setDmsLatDeg('');
      setDmsLatMin('');
      setDmsLatSec('');
      setCoordType('DD'); // optionally reset to default
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Convert DMS to DD
  const dmsToDd = (degrees, minutes, seconds) => {
    let dd = Math.abs(parseFloat(degrees)) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600;
    if (parseFloat(degrees) < 0) {
      dd = dd * -1;
    }
    return dd;
  };

  const handleZoom = () => {
    let finalLon, finalLat;

    if (coordType === 'DD') {
      finalLon = parseFloat(ddLon);
      finalLat = parseFloat(ddLat);
    } else {
      finalLon = dmsToDd(dmsLonDeg || 0, dmsLonMin || 0, dmsLonSec || 0);
      finalLat = dmsToDd(dmsLatDeg || 0, dmsLatMin || 0, dmsLatSec || 0);
    }

    if (!isNaN(finalLon) && !isNaN(finalLat) && onGoTo) {
      onGoTo(finalLon, finalLat);
    } else {
      alert("Please enter valid numerical coordinates.");
    }
  };

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".draggable-header">
      <div ref={nodeRef} className="draggable-panel location-panel">
        <div className="draggable-header">
          <div className="flex items-center gap-2">
            <FiFileText className="w-[10px] h-[10px] text-blue-500" />
            <span className="draggable-title font-inter text-[#374151]">Go to Location</span>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="draggable-content p-4 font-inter">
          <label className="block text-[13px] text-gray-700 font-medium mb-1.5">Coordinate Type</label>
          <select
            value={coordType}
            onChange={(e) => setCoordType(e.target.value)}
            className="w-full border border-blue-300 rounded-md p-2 text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 bg-white"
          >
            <option value="DD">Decimal Degrees (DD)</option>
            <option value="DMS">Degrees Minutes Seconds (DMS)</option>
          </select>

          <div className={`grid ${coordType === 'DD' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`}>
            <div>
              <label className="block text-[13px] text-gray-700 font-medium mb-1.5">Longitude</label>
              {coordType === 'DD' ? (
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 85.83"
                  value={ddLon}
                  onChange={(e) => setDdLon(e.target.value)}
                  className="w-full border border-gray-400 rounded-md p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="flex gap-2">
                  <input type="number" step="any" placeholder="Lon &deg;" value={dmsLonDeg} onChange={(e) => setDmsLonDeg(e.target.value)} className="w-1/3 border border-gray-400 rounded-md p-1.5 text-[12px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="number" step="any" placeholder="Lon '" value={dmsLonMin} onChange={(e) => setDmsLonMin(e.target.value)} className="w-1/3 border border-gray-400 rounded-md p-1.5 text-[12px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="number" step="any" placeholder='Lon "' value={dmsLonSec} onChange={(e) => setDmsLonSec(e.target.value)} className="w-1/3 border border-gray-400 rounded-md p-1.5 text-[12px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] text-gray-700 font-medium mb-1.5">Latitude</label>
              {coordType === 'DD' ? (
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 20.30"
                  value={ddLat}
                  onChange={(e) => setDdLat(e.target.value)}
                  className="w-full border border-gray-400 rounded-md p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="flex gap-2">
                  <input type="number" step="any" placeholder="Lat &deg;" value={dmsLatDeg} onChange={(e) => setDmsLatDeg(e.target.value)} className="w-1/3 border border-gray-400 rounded-md p-1.5 text-[12px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="number" step="any" placeholder="Lat '" value={dmsLatMin} onChange={(e) => setDmsLatMin(e.target.value)} className="w-1/3 border border-gray-400 rounded-md p-1.5 text-[12px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="number" step="any" placeholder='Lat "' value={dmsLatSec} onChange={(e) => setDmsLatSec(e.target.value)} className="w-1/3 border border-gray-400 rounded-md p-1.5 text-[12px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              )}
            </div>
          </div>

          {coordType === 'DMS' && (
            <p className="text-[11px] text-gray-500 italic mb-3">W/S are negative (W = -lon, S = -lat)</p>
          )}

          <button
            onClick={handleZoom}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded text-[14px] transition-colors cursor-pointer"
          >
            Zoom
          </button>

        </div>
      </div>
    </Draggable>
  );
};

export default LocationTool;
