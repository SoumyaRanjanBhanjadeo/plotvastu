'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { defaults as defaultControls } from 'ol/control';

export function PropertyMapModal({ isOpen, onClose, coordinates }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  
  // Custom marker SVG (encoded to base64 or used directly as string)
  const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#dc2626" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`;

  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    // Default to a central fallback if no coordinates
    const lon = coordinates?.lng || 85.8195;
    const lat = coordinates?.lat || 20.3553;
    const center = fromLonLat([lon, lat]);

    // Create marker feature
    const markerFeature = new Feature({
      geometry: new Point(center),
    });

    const markerStyle = new Style({
      image: new Icon({
        src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markerSvg),
        anchor: [0.5, 1], // Anchor at bottom center of the pin
        scale: 1.2,
      }),
    });

    markerFeature.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [markerFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 2,
    });

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', // Google Street Basemap
          }),
          zIndex: 1,
        }),
        vectorLayer,
      ],
      view: new View({
        center: center,
        zoom: 16, // Zoomed in to place
      }),
      controls: defaultControls({ zoom: true, attribution: false }),
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(null);
      map.getLayers().clear();
      map.getControls().clear();
      mapInstance.current = null;
    };
  }, [isOpen, coordinates]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-4 right-4 top-4 bottom-4 md:left-[10%] md:right-[10%] md:top-[10%] md:bottom-[10%] bg-white rounded-2xl shadow-2xl z-101 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3 text-gray-800">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Property Location</h3>
                  <p className="text-xs text-gray-500">Interactive Map View</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Body */}
            <div className="flex-1 w-full bg-gray-100 relative">
              <div ref={mapRef} className="w-full h-full" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
