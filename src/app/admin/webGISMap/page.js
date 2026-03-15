'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import './webGISMap.css';
import { MapPin, Layers, List, BarChart2 } from 'lucide-react';
import { TbRulerMeasure } from "react-icons/tb";
import LocationTool from './components/LocationTool';
import MeasurementTool from './components/MeasurementTool';
import LayersTool from './components/LayersTool';
import LegendTool from './components/LegendTool';
import AnalyticsTool from './components/AnalyticsTool';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, toLonLat, getPointResolution } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls } from 'ol/control';

const BASEMAP_OPTIONS = [
  {
    id: 'osm',
    label: 'Open Street Map',
    preview: 'https://tile.openstreetmap.org/10/755/437.png',
  },
  {
    id: 'googleStreet',
    label: 'Google Street',
    preview: 'http://mt0.google.com/vt/lyrs=m&hl=en&x=755&y=437&z=10',
  },
  {
    id: 'satellite',
    label: 'Satellite',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/437/755',
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    preview: 'http://mt0.google.com/vt/lyrs=y&hl=en&x=755&y=437&z=10',
  },
  {
    id: 'terrain',
    label: 'Terrain',
    preview: 'http://mt0.google.com/vt/lyrs=p&hl=en&x=755&y=437&z=10',
  },
  {
    id: 'cartography',
    label: 'Cartography',
    preview: 'https://basemaps.cartocdn.com/light_all/10/755/437.png',
  },
  {
    id: 'none',
    label: 'No Map',
    preview: null,
  }
];

const WebGISMapPage = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const basemapsRef = useRef({});
  const [activeBasemap, setActiveBasemap] = useState('satellite');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pointerCoords, setPointerCoords] = useState({ lon: 81.79883, lat: 30.03175 });
  const [scaleData, setScaleData] = useState({ ratio: '1:1,000,000', width: 140, halfLabel: '25 km', fullLabel: '50 km' });
  const menuRef = useRef(null);
  const vectorSourceRef = useRef(null);

  const [activeTools, setActiveTools] = useState({
    location: false,
    measurement: false,
    layers: false,
    legend: false,
    analytics: false,
  });

  const toggleTool = (tool) => {
    setActiveTools(prev => {
      // If the tool is already open, simply close it
      if (prev[tool]) {
        if (tool === 'location' && vectorSourceRef.current) {
          vectorSourceRef.current.clear(); // Clear placed marker when tool is closed
        }
        return { ...prev, [tool]: false };
      }

      // If we are opening a new tool, close all others first
      if (vectorSourceRef.current) vectorSourceRef.current.clear(); // Always clear markers when switching tools

      return {
        location: false,
        measurement: false,
        layers: false,
        legend: false,
        analytics: false,
        [tool]: true
      };
    });
  };

  // Auto-collapse sidebar when component mounts
  useEffect(() => {
    const sidebarToggleEvent = new CustomEvent('sidebar-toggle', { detail: { collapsed: true } });
    document.dispatchEvent(sidebarToggleEvent);
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Function to change basemap
  const changeBasemap = (basemapId) => {
    setActiveBasemap(basemapId);
    if (!mapInstance.current) return;

    // Hide all basemaps
    Object.values(basemapsRef.current).forEach(layer => {
      if (layer) layer.setVisible(false);
    });

    // Show selected
    if (basemapId !== 'none' && basemapsRef.current[basemapId]) {
      basemapsRef.current[basemapId].setVisible(true);
    }
  };

  const handleZoomIn = () => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      view.animate({ zoom: (view.getZoom() || 0) + 1, duration: 250 });
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      view.animate({ zoom: (view.getZoom() || 0) - 1, duration: 250 });
    }
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        if (mapInstance.current) {
          mapInstance.current.getView().animate({
            center: fromLonLat([longitude, latitude]),
            zoom: 14,
            duration: 800,
          });
        }
      });
    }
  };

  const handleGoToLocation = (lon, lat) => {
    if (!mapInstance.current || !vectorSourceRef.current) return;

    // 1. Clear any existing markers
    vectorSourceRef.current.clear();

    // 2. Create coordinates in map projection
    const coordinates = fromLonLat([lon, lat]);

    // 3. Create a new Feature with a Point geometry
    const markerFeature = new Feature({
      geometry: new Point(coordinates),
    });

    // 4. Set the icon style for the marker
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // A standard map pin icon URL
          scale: 0.05,
        }),
      })
    );

    // 5. Add the marker to the vector source
    vectorSourceRef.current.addFeature(markerFeature);

    // 6. Animate view to the dropped marker
    mapInstance.current.getView().animate({
      center: coordinates,
      zoom: 15,
      duration: 1000,
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Create basemaps inside the effect to prevent Strict Mode re-render leakage
    const layers = {
      osm: new TileLayer({
        source: new XYZ({ url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' }),
        visible: false,
      }),
      googleStreet: new TileLayer({
        source: new XYZ({ url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}' }),
        visible: false,
      }),
      satellite: new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: ''
        }),
        visible: true, // Default active
      }),
      hybrid: new TileLayer({
        source: new XYZ({ url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}' }),
        visible: false,
      }),
      terrain: new TileLayer({
        source: new XYZ({ url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}' }),
        visible: false,
      }),
      cartography: new TileLayer({
        source: new XYZ({ url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' }),
        visible: false,
      })
    };

    basemapsRef.current = layers;

    // Create vector source for markers
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    // Initialize the map (fixes the duplicate item added error by proper initialization)
    const view = new View({
      center: fromLonLat([85.2090, 20.8139]),
      zoom: 8,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        layers.osm,
        layers.googleStreet,
        layers.satellite,
        layers.hybrid,
        layers.terrain,
        layers.cartography,
        new VectorLayer({ source: vectorSource }),
      ],
      view: view,
      controls: defaultControls({ attribution: false, zoom: false }),
    });

    const updateScale = () => {
      const resolution = view.getResolution();
      const center = view.getCenter();
      const proj = view.getProjection();

      if (!resolution || !center || !proj) return;

      const pointResolution = getPointResolution(proj, resolution, center, 'm');

      // Calculate Ratio
      const dpi = 90.714;
      const inchesPerMeter = 39.37;
      const ratio = Math.round(pointResolution * inchesPerMeter * dpi);
      const formattedRatio = `1:${ratio.toLocaleString()}`;

      // Calculate Bar
      const targetPixels = 140;
      let nominalMeters = targetPixels * pointResolution;
      let unit = 'm';

      if (nominalMeters > 1000) {
        nominalMeters /= 1000;
        unit = 'km';
      }

      const magnitude = Math.pow(10, Math.floor(Math.log10(nominalMeters)));
      const normalized = nominalMeters / magnitude;
      let niceMultiplier = 1;

      if (normalized >= 5) niceMultiplier = 5;
      else if (normalized >= 2) niceMultiplier = 2;
      else niceMultiplier = 1;

      const niceLength = niceMultiplier * magnitude;
      const actualWidth = (niceLength * (unit === 'km' ? 1000 : 1)) / pointResolution;

      setScaleData({
        ratio: formattedRatio,
        width: actualWidth,
        halfLabel: `${niceLength / 2} ${unit}`,
        fullLabel: `${niceLength} ${unit}`
      });
    };

    view.on('change:resolution', updateScale);
    view.on('change:center', updateScale);
    updateScale();

    mapInstance.current = map;

    map.on('click', (event) => {
      const coordinates = event.coordinate;
      console.log('Clicked at:', coordinates);
    });

    map.on('pointermove', (event) => {
      const lonLat = toLonLat(event.coordinate);
      setPointerCoords({ lon: lonLat[0], lat: lonLat[1] });
    });

    return () => {
      // Clean up layers and elements to fix Strict Mode duplicate elements caching errors
      map.setTarget(null);
      map.getLayers().clear();
      map.getControls().clear();
      map.getInteractions().clear();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="h-screen w-full relative">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full bg-[#e8eae6]"
      />

      {/* Basemap Switcher - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-1000 flex flex-col cursor-pointer" ref={menuRef}>

        {/* Popup Menu */}
        {isMenuOpen && (
          <div className="mb-4 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 transition-all duration-200" style={{ width: 'max-content' }}>
            <div className="grid grid-cols-4 gap-3">
              {BASEMAP_OPTIONS.map((basemap) => (
                <div
                  key={basemap.id}
                  onClick={() => { changeBasemap(basemap.id); setIsMenuOpen(false); }}
                  className={`flex flex-col p-[6px] rounded-xl cursor-pointer transition-all w-[100px] items-center ${activeBasemap === basemap.id
                    ? 'ring-2 ring-emerald-600 bg-emerald-50/50'
                    : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white shadow-sm hover:shadow'
                    }`}
                >
                  <div className="mb-2 w-full flex justify-center">
                    {basemap.id === 'none' ? (
                      <div className="w-[84px] h-[84px] bg-[#f8f9fa] border border-[#f0f0f0] rounded-lg flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
                        <svg className="w-10 h-10 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] text-[#c0c0c0] font-bold text-center leading-[1.2] w-full px-2">MAP NOT AVAILABLE</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={basemap.preview}
                        alt={basemap.label}
                        className={`w-[84px] h-[84px] object-cover rounded-lg ${activeBasemap !== basemap.id && 'border border-gray-100'
                          }`}
                      />
                    )}
                  </div>
                  <span className={`text-[12px] font-medium text-center pb-1 ${activeBasemap === basemap.id ? 'text-emerald-700' : 'text-gray-600'
                    }`}>
                    {basemap.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trigger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-[84px] h-[84px] rounded-2xl overflow-hidden ring-[3px] ring-white shadow-xl relative group transition-transform active:scale-95"
          style={{ alignSelf: 'flex-start' }}
        >
          {activeBasemap === 'none' ? (
            <div className="w-full h-full bg-[#f8f9fa] flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-gray-300 mb-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
          ) : (
            <img
              src={BASEMAP_OPTIONS.find(b => b.id === activeBasemap)?.preview}
              alt="Basemap"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
            />
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-6 pb-[4px] flex justify-center cursor-pointer">
            <span className="text-white text-[13px] font-inter tracking-wide drop-shadow-md">Basemap</span>
          </div>
        </button>

      </div>

      {/* Custom Bottom Right Controls */}
      <div className="custom-map-controls-container">

        {/* Compass */}
        <img
          src="/direction_black.png"
          alt="Compass"
          className="compass-icon"
        />

        {/* Action Buttons */}
        <div className="map-tools-stack">
          <button className="map-tool-btn" onClick={handleZoomIn} title="Zoom In">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>

          <button className="map-tool-btn" onClick={handleZoomOut} title="Zoom Out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>

          <button className="map-tool-btn" onClick={handleGeolocation} title="My Location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
              <line x1="12" y1="2" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="22"></line>
              <line x1="2" y1="12" x2="4" y2="12"></line>
              <line x1="20" y1="12" x2="22" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Bottom Info Row (Coords & Scale) */}
        <div className="bottom-info-row">
          <div className="font-inter coordinates-box">
            Lon: {pointerCoords.lon.toFixed(5)}&deg;, Lat: {pointerCoords.lat.toFixed(5)}&deg;
          </div>

          {/* Custom Built Scale */}
          <div className="flex flex-col items-center select-none" style={{ width: 'fit-content' }}>
            <div className="text-[12px] font-medium text-black mb-[2px] drop-shadow-sm" style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>
              {scaleData.ratio}
            </div>
            <div style={{ width: scaleData.width }} className="relative flex h-[6px] border border-black z-10 box-content">
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-[#333]"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-[#333]"></div>
            </div>
            <div style={{ width: scaleData.width }} className="relative h-4 mt-1">
              <span className="absolute left-0 -translate-x-1/2 text-[10px] font-bold text-black drop-shadow-sm" style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>0</span>
              <span className="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold text-black drop-shadow-sm" style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>{scaleData.halfLabel}</span>
              <span className="absolute right-0 translate-x-1/2 text-[10px] font-bold text-black drop-shadow-sm" style={{ textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' }}>{scaleData.fullLabel}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Top Right Tools */}
      <div className="top-right-tools-container">
        <button className={`top-right-tool-btn ${activeTools.location ? 'active' : ''}`} onClick={() => toggleTool('location')} title="Location">
          <MapPin />
        </button>
        <button className={`top-right-tool-btn ${activeTools.measurement ? 'active' : ''}`} onClick={() => toggleTool('measurement')} title="Measurement">
          <TbRulerMeasure />
        </button>
        <button className={`top-right-tool-btn ${activeTools.layers ? 'active' : ''}`} onClick={() => toggleTool('layers')} title="Layers">
          <Layers />
        </button>
        <button className={`top-right-tool-btn ${activeTools.legend ? 'active' : ''}`} onClick={() => toggleTool('legend')} title="Legend">
          <List />
        </button>
        {/* <button className={`top-right-tool-btn ${activeTools.analytics ? 'active' : ''}`} onClick={() => toggleTool('analytics')} title="Analytics">
          <BarChart2 />
        </button> */}
      </div>

      {/* Draggable Tool Panels */}
      <LocationTool isOpen={activeTools.location} onClose={() => toggleTool('location')} onGoTo={handleGoToLocation} />
      <MeasurementTool isOpen={activeTools.measurement} onClose={() => toggleTool('measurement')} mapInstance={mapInstance} />
      <LayersTool isOpen={activeTools.layers} onClose={() => toggleTool('layers')} />
      <LegendTool isOpen={activeTools.legend} onClose={() => toggleTool('legend')} />
      {/* <AnalyticsTool isOpen={activeTools.analytics} onClose={() => toggleTool('analytics')} /> */}

    </div>
  );
};

export default WebGISMapPage;