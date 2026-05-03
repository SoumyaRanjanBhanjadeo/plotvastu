import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { FiFileText } from "react-icons/fi";
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import Draw from 'ol/interaction/Draw';
import { getLength, getArea } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { toLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

const MeasurementTool = ({ isOpen, onClose, mapInstance }) => {
  const nodeRef = useRef(null);

  const [activeTab, setActiveTab] = useState('point'); // point, distance, area
  const [unit, setUnit] = useState('metric');
  const [isMinimized, setIsMinimized] = useState(false);

  // Point State
  const [currentPointDD, setCurrentPointDD] = useState('-');
  const [currentPointDMS, setCurrentPointDMS] = useState('-');
  const [allPoints, setAllPoints] = useState([]);

  // Distance/Area State
  const [measurementValue, setMeasurementValue] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // OpenLayers Refs
  const sourceRef = useRef(new VectorSource({ wrapX: false }));
  const vectorLayerRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const listenerRef = useRef(null);
  const overlaysRef = useRef([]); // [{ overlay, rawValue }]

  // Initialize Layer safely
  useEffect(() => {
    if (!mapInstance || !mapInstance.current) return;
    if (vectorLayerRef.current) return; // Already initialized

    const map = mapInstance.current;

    const layer = new VectorLayer({
      source: sourceRef.current,
      style: new Style({
        fill: new Fill({ color: 'rgba(37, 99, 235, 0.3)' }),
        stroke: new Stroke({ color: '#2563eb', width: 3 }),
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
          fill: new Fill({ color: '#2563eb' })
        })
      }),
      zIndex: 100 // Ensure it's above other layers
    });

    map.addLayer(layer);
    vectorLayerRef.current = layer;

    // We do NOT remove the layer on every useEffect cycle, only on full unmount
    return () => {
      // Only clean up when component unmounts entirely
    };
  }, [mapInstance, isOpen]);

  // Clean up map overlays properly on unmount
  useEffect(() => {
    return () => {
      if (mapInstance && mapInstance.current && vectorLayerRef.current) {
        mapInstance.current.removeLayer(vectorLayerRef.current);
      }
      if (mapInstance && mapInstance.current) {
        overlaysRef.current.forEach(({ overlay }) => mapInstance.current.removeOverlay(overlay));
      }
    };
  }, []);

  // Clean up on close/unmount
  useEffect(() => {
    if (!isOpen) {
      handleClearAll();
      removeDrawInteraction();
    }
  }, [isOpen]);

  // Re-render all existing map tooltips when unit changes
  useEffect(() => {
    overlaysRef.current.forEach(({ overlay, rawValue }) => {
      const el = overlay.getElement();
      if (!el) return;
      // Only update distance/area tooltips (not point tooltips)
      if (el.className.includes('measure-distance-tooltip')) {
        el.innerHTML = formatMeasurementWithUnit(rawValue, activeTab, unit);
      }
    });
  }, [unit]);

  // Handle Tab Change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'point') setUnit('metric');
    else if (tab === 'distance') setUnit('metric_m');
    else setUnit('sq_m');
    removeDrawInteraction();
  };

  const removeDrawInteraction = () => {
    if (mapInstance && mapInstance.current && drawInteractionRef.current) {
      mapInstance.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }
    if (listenerRef.current) {
      unByKey(listenerRef.current);
      listenerRef.current = null;
    }
    setIsDrawing(false);
  };

  const handleClearAll = () => {
    // If we're on Point tab, only clear Points
    if (activeTab === 'point') {
      if (sourceRef.current) {
        const features = sourceRef.current.getFeatures();
        features.forEach(f => {
          if (f.getGeometry().getType() === 'Point') {
            sourceRef.current.removeFeature(f);
          }
        });
      }
      setCurrentPointDD('-');
      setCurrentPointDMS('-');
      setAllPoints([]);

      // Remove only point tooltips
      if (mapInstance && mapInstance.current) {
        const remainingOverlays = [];
        overlaysRef.current.forEach(entry => {
          const el = entry.overlay.getElement();
          if (el && el.className.includes('measure-point-tooltip')) {
            mapInstance.current.removeOverlay(entry.overlay);
          } else {
            remainingOverlays.push(entry);
          }
        });
        overlaysRef.current = remainingOverlays;
      }
      removeDrawInteraction();
      return;
    }

    // Otherwise clear everything (Distance/Area context) or clear specifically Distance/Area
    // Based on user feedback, let's keep it simple: "Clear All" on Distance/Area tabs clears everything for now,
    // or we can make it clear just the active tab. Let's make it clear just the active tab type to be safe, 
    // OR clear everything if they explicitly hit "Clear All". 
    // The user says "Don't remove the data if I am switching... Every one should be different point, distance, area."
    // Let's make Clear All ONLY clear the active tab's drawings.

    if (sourceRef.current) {
      const targetType = activeTab === 'distance' ? 'LineString' : 'Polygon';
      const features = sourceRef.current.getFeatures();
      features.forEach(f => {
        if (f.getGeometry().getType() === targetType) {
          sourceRef.current.removeFeature(f);
        }
      });
    }

    setMeasurementValue(0);

    if (mapInstance && mapInstance.current) {
      const remainingOverlays = [];
      overlaysRef.current.forEach(entry => {
        const el = entry.overlay.getElement();
        if (el && el.className.includes('measure-distance-tooltip')) {
          mapInstance.current.removeOverlay(entry.overlay);
        } else {
          remainingOverlays.push(entry);
        }
      });
      overlaysRef.current = remainingOverlays;
    }

    removeDrawInteraction();
  };

  const getActiveFeaturesCount = () => {
    if (!sourceRef.current) return 0;
    const features = sourceRef.current.getFeatures();
    let type = 'Point';
    if (activeTab === 'distance') type = 'LineString';
    if (activeTab === 'area') type = 'Polygon';
    return features.filter(f => f.getGeometry().getType() === type).length;
  };

  const handleCancel = () => {
    removeDrawInteraction();
  };

  // formatting helpers
  const toDMS = (decimal, isLat) => {
    const dir = decimal < 0 ? (isLat ? 'S' : 'W') : (isLat ? 'N' : 'E');
    let deg = Math.abs(decimal);
    let d = Math.floor(deg);
    let minFloat = (deg - d) * 60;
    let m = Math.floor(minFloat);
    let s = ((minFloat - m) * 60).toFixed(2);
    return `${d}° ${m}' ${s}" ${dir}`;
  };

  // Unit Options
  const pointUnits = [
    { value: 'metric', label: 'Metric (m / km)' },
    { value: 'imperial', label: 'Imperial (ft / mi)' }
  ];

  const distanceUnits = [
    { value: 'metric_m', label: 'Meters' },
    { value: 'metric_km', label: 'Kilometers' },
    { value: 'imperial_ft', label: 'Feet' },
    { value: 'imperial_ft_us', label: 'Feet (US)' },
    { value: 'imperial_mi', label: 'Miles' },
    { value: 'imperial_yd', label: 'Yards' },
    { value: 'nautical_mi', label: 'Nautical miles' }
  ];

  const areaUnits = [
    { value: 'sq_m', label: 'Sq meters' },
    { value: 'sq_km', label: 'Sq kilometers' },
    { value: 'hectares', label: 'Hectares' },
    { value: 'acres', label: 'Acres' },
    { value: 'sq_ft', label: 'Sq feet' },
    { value: 'sq_ft_us', label: 'Sq feet (US)' },
    { value: 'sq_yd', label: 'Sq yards' },
    { value: 'sq_mi', label: 'Sq miles' }
  ];

  const getUnitsForTab = () => {
    if (activeTab === 'point') return pointUnits;
    if (activeTab === 'distance') return distanceUnits;
    return areaUnits;
  };

  const startDrawing = () => {
    if (!mapInstance || !mapInstance.current) return;
    const map = mapInstance.current;

    removeDrawInteraction(); // clean up previous

    let type = 'Point';
    if (activeTab === 'distance') type = 'LineString';
    if (activeTab === 'area') type = 'Polygon';

    const draw = new Draw({
      source: sourceRef.current,
      type: type,
      style: new Style({
        fill: new Fill({ color: 'rgba(37, 99, 235, 0.3)' }),
        stroke: new Stroke({ color: '#2563eb', width: 3 }),
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
          fill: new Fill({ color: '#2563eb' })
        })
      })
    });

    map.addInteraction(draw);
    drawInteractionRef.current = draw;
    setIsDrawing(true);

    // Event Listeners
    if (type === 'Point') {
      draw.on('drawend', (evt) => {
        const geom = evt.feature.getGeometry();
        const coords = toLonLat(geom.getCoordinates());
        const lon = coords[0];
        const lat = coords[1];

        const ddStr = `${lon.toFixed(6)}, ${lat.toFixed(6)}`;
        const tooltipStr = `${lon.toFixed(6)}, ${lat.toFixed(6)}`; // Map wants lon, lat usually but let's stick to user request (if they want lon,lat on map overlay and lat,lon in list)
        const dmsStr = `${toDMS(lon, false)} | ${toDMS(lat, true)}`; // Based on image pipe delimiter

        setCurrentPointDD(ddStr);
        setCurrentPointDMS(dmsStr);
        setAllPoints(prev => [...prev, ddStr]);

        // Add map tooltip overlay
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'measure-point-tooltip';
        tooltipElement.innerHTML = tooltipStr;

        const tooltipOverlay = new Overlay({
          element: tooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        tooltipOverlay.setPosition(geom.getCoordinates());
        map.addOverlay(tooltipOverlay);
        overlaysRef.current.push({ overlay: tooltipOverlay, rawValue: 0 }); // points have no numeric value

        // Let user keep clicking if they want to
      });
    } else {
      let measureTooltipElement;
      let measureTooltip;

      draw.on('drawstart', (evt) => {
        const geom = evt.feature.getGeometry();

        // Create new tooltip
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'measure-distance-tooltip';
        measureTooltip = new Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
        // Store as entry with rawValue — will be updated live as geometry changes
        const overlayEntry = { overlay: measureTooltip, rawValue: 0 };
        overlaysRef.current.push(overlayEntry);

        listenerRef.current = geom.on('change', (e) => {
          const geomChange = e.target;
          let output;
          let tooltipCoord;

          if (geomChange instanceof Point) {
            return;
          }

          if (activeTab === 'distance') {
            output = getLength(geomChange); // meters by default
            try {
              tooltipCoord = geomChange.getCoordinateAt(0.5); // middle of the line
            } catch (e) {
              tooltipCoord = geomChange.getLastCoordinate();
            }
          } else {
            output = getArea(geomChange);   // sq meters by default
            try {
              tooltipCoord = geomChange.getInteriorPoint().getCoordinates(); // inside of polygon
            } catch (e) {
              tooltipCoord = null;
            }
          }

          setMeasurementValue(output);
          // Keep rawValue in sync so unit-change effect can reformat it
          overlayEntry.rawValue = output;

          // Update tooltip immediately (unit is captured via overlayEntry, not stale closure)
          if (measureTooltipElement && tooltipCoord) {
            measureTooltipElement.innerHTML = formatMeasurementWithUnit(output, activeTab, unit);
            measureTooltip.setPosition(tooltipCoord);
          }
        });
      });

      draw.on('drawend', () => {
        if (measureTooltipElement) {
          measureTooltipElement.className = 'measure-distance-tooltip measure-distance-tooltip-static';
        }
        measureTooltipElement = null;
        measureTooltip = null;

        if (listenerRef.current) {
          unByKey(listenerRef.current);
          listenerRef.current = null;
        }
        setIsDrawing(false);
        // Defer interaction removal so OpenLayers has a frame to push the finalized feature into the vector source
        setTimeout(() => {
          removeDrawInteraction();
        }, 50);
      });
    }
  };

  const formatMeasurementWithUnit = (value, tabType, currentUnit) => {
    if (value === 0) return tabType === 'distance' ? '0.00' : '0.00';

    let converted = value;
    let symbol = '';

    if (tabType === 'distance') {
      if (currentUnit === 'metric_m') { converted = value; symbol = 'm'; }
      if (currentUnit === 'metric_km') { converted = value / 1000; symbol = 'km'; }
      if (currentUnit === 'imperial_ft') { converted = value * 3.28084; symbol = 'ft'; }
      if (currentUnit === 'imperial_ft_us') { converted = value * 3.280833333465; symbol = 'ft (US)'; }
      if (currentUnit === 'imperial_mi') { converted = value * 0.000621371; symbol = 'mi'; }
      if (currentUnit === 'imperial_yd') { converted = value * 1.09361; symbol = 'yd'; }
      if (currentUnit === 'nautical_mi') { converted = value * 0.000539957; symbol = 'NM'; }
      return `${converted.toFixed(2)} ${symbol}`;
    }

    if (tabType === 'area') {
      if (currentUnit === 'sq_m') { converted = value; symbol = 'm²'; }
      if (currentUnit === 'sq_km') { converted = value / 1000000; symbol = 'km²'; }
      if (currentUnit === 'hectares') { converted = value / 10000; symbol = 'ha'; }
      if (currentUnit === 'acres') { converted = value * 0.000247105; symbol = 'ac'; }
      if (currentUnit === 'sq_ft') { converted = value * 10.7639; symbol = 'ft²'; }
      if (currentUnit === 'sq_ft_us') { converted = value * 10.76386736; symbol = 'ft² (US)'; }
      if (currentUnit === 'sq_yd') { converted = value * 1.19599; symbol = 'yd²'; }
      if (currentUnit === 'sq_mi') { converted = value * 0.000000386102159; symbol = 'mi²'; }
      return `${converted.toFixed(2)} ${symbol}`;
    }

    return '0.00';
  };

  const formatMeasurement = (value) => {
    return formatMeasurementWithUnit(value, activeTab, unit);
  };

  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".draggable-header">
      <div ref={nodeRef} className="draggable-panel" style={{ width: '380px' }}>
        <div className="draggable-header">
          <div className="flex items-center gap-2">
            <FiFileText className="w-[10px] h-[10px] text-blue-500" />
            <span className="draggable-title">Measurement</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="minimize-btn" onClick={() => setIsMinimized(p => !p)} title={isMinimized ? 'Restore' : 'Minimize'}>
              {isMinimized ? '▢' : '-'}
            </button>
            <button className="close-btn" title='close' onClick={onClose}>&times;</button>
          </div>
        </div>

        {!isMinimized && (
          <div className="draggable-content p-4 font-inter">

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => handleTabChange('point')}
                className={`py-2 rounded border flex items-center justify-center gap-1.5 text-[13px] transition-colors cursor-pointer ${activeTab === 'point' ? 'bg-blue-500 text-white border-blue-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-1 h-1 rounded-full ${activeTab === 'point' ? 'bg-white' : 'bg-gray-700'}`}></div>
                Point
              </button>
              <button
                onClick={() => handleTabChange('distance')}
                className={`py-2 rounded border flex items-center justify-center gap-1.5 text-[13px] transition-colors cursor-pointer ${activeTab === 'distance' ? 'bg-blue-500 text-white border-blue-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-2 h-2 ${activeTab === 'distance' ? 'bg-white' : 'bg-gray-700'}`}></div>
                Distance
              </button>
              <button
                onClick={() => handleTabChange('area')}
                className={`py-2 rounded border flex items-center justify-center gap-1.5 text-[13px] transition-colors cursor-pointer ${activeTab === 'area' ? 'bg-blue-500 text-white border-blue-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-2 h-2 ${activeTab === 'area' ? 'bg-white' : 'bg-gray-700'}`}></div>
                Area
              </button>
            </div>

            {/* Units Selection */}
            <div className="mb-4">
              <label className="block text-[14px] text-gray-800 font-medium mb-1.5">Units</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-[14px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {getUnitsForTab().map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            {activeTab === 'point' ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={activeTab === 'point' && !isDrawing ? startDrawing : handleClearAll}
                  className={`w-full font-medium py-2 rounded text-[14px] transition-colors cursor-pointer ${isDrawing ? 'bg-blue-500 text-white' : activeTab === 'point' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {isDrawing ? "Clear Points" : getActiveFeaturesCount() > 0 ? "Clear Points" : "Start Adding Points"}
                </button>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <label className="block text-[12px] text-gray-700 mb-1.5">Current Point (DD)</label>
                    <div className="w-full border border-gray-200 rounded p-2 text-[12px] bg-[#f8fafc] text-gray-800 flex items-center h-[34px]">
                      {currentPointDD}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] text-gray-700 mb-1.5">Current Point (DMS)</label>
                    <div className="w-full border border-gray-200 rounded p-2 text-[12px] bg-[#f8fafc] text-gray-800 flex items-center h-[34px]">
                      {currentPointDMS}
                    </div>
                  </div>
                </div>

                {allPoints.length > 0 && (
                  <div className="mt-1">
                    <label className="block text-[13px] text-gray-800 mb-2">All Points ({allPoints.length})</label>
                    <div className="border border-gray-200 rounded-md overflow-hidden bg-white max-h-[120px] overflow-y-auto">
                      {allPoints.map((pt, idx) => (
                        <div key={idx} className={`px-3 py-2 text-[12px] text-gray-700 ${idx !== allPoints.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          {idx + 1}. {pt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[12px] text-gray-500 italic text-center mt-2">Click on the map to add points. Click 'Clear Points' to reset.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleCancel} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 rounded text-[13px] transition-colors cursor-pointer">Cancel</button>
                  <button onClick={handleClearAll} className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-[13px] transition-colors cursor-pointer">Clear All</button>
                </div>
                <button
                  onClick={startDrawing}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded text-[13px] transition-colors cursor-pointer"
                >
                  {isDrawing ? "Drawing in progress..." : `Start New ${activeTab === 'distance' ? 'Distance' : 'Area'} Measurement`}
                </button>

                <div className="mt-2">
                  <label className="block text-[13px] text-gray-700 mb-1.5">{activeTab === 'distance' ? 'Total Length' : 'Total Area'}</label>
                  <div className="w-full border border-gray-200 rounded p-3 text-[14px] text-center font-bold font-mono tracking-wide bg-gray-50 text-black">
                    {formatMeasurement(measurementValue)}
                  </div>
                </div>

                <p className="text-[12px] text-gray-500 italic text-center mt-1">
                  Click 'Start New {activeTab === 'distance' ? 'Distance' : 'Area'} Measurement' then click on map to draw {activeTab === 'distance' ? 'line' : 'polygon'}. Double-click to finish.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default MeasurementTool;