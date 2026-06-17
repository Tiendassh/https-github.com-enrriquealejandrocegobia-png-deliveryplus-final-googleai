import React, { useState } from 'react';
import { MapPin, Navigation, Map, CloudRain, Sun, Wind, Flame, Building2, Package } from 'lucide-react';

interface Marker {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'comercio' | 'emprendedor';
}

interface ArgentinaMapProps {
  gpsSimulating: boolean;
  gpsProgress: number;
  userCoords?: { lat: number; lng: number }; // Simplified for styling
  markers: Marker[];
}

interface RegionNode {
  id: string;
  name: string;
  x: number;
  y: number;
  weather: 'sunny' | 'rainy' | 'windy' | 'hot';
  multiplier: number;
  activeOrders: number;
  provincias: string;
}

export const ArgentinaMap: React.FC<ArgentinaMapProps> = ({
  gpsSimulating,
  gpsProgress,
  userCoords,
  markers
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('amba');

  // Interactive cities across Argentina with their B2B status
  const regions: RegionNode[] = [
    { id: 'amba', name: 'AMBA & CABA', x: 67, y: 46, weather: 'rainy', multiplier: 1.5, activeOrders: 14, provincias: 'Buenos Aires' },
    { id: 'cordoba', name: 'Córdoba Capital', x: 52, y: 32, weather: 'sunny', multiplier: 1.0, activeOrders: 6, provincias: 'Córdoba' },
    { id: 'rosario', name: 'Rosario Nodo B2B', x: 62, y: 39, weather: 'windy', multiplier: 1.2, activeOrders: 5, provincias: 'Santa Fe' },
    { id: 'mendoza', name: 'Mendoza Logística', x: 42, y: 38, weather: 'hot', multiplier: 1.3, activeOrders: 4, provincias: 'Mendoza' },
    { id: 'patagonia', name: 'Neuquén-Bariloche', x: 44, y: 68, weather: 'windy', multiplier: 1.2, activeOrders: 2, provincias: 'Neuquén / Río Negro' }
  ];

  const activeNode = regions.find(r => r.id === selectedRegion) || regions[0];

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-brand animate-bounce" />;
      case 'windy': return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'hot': return <Flame className="w-4 h-4 text-red-success text-[#FF3B30] animate-pulse" />;
      case 'sunny':
      default:
        return <Sun className="w-4 h-4 text-green-success" />;
    }
  };

  const getMultiplierColor = (mul: number) => {
    if (mul >= 1.5) return 'text-[#FF3B30]';
    if (mul >= 1.2) return 'text-[#FFC107]';
    return 'text-green-success';
  };

  return (
    <div className="flex-1 flex flex-col justify-end relative bg-[#05060A] shadow-inner rounded-3xl overflow-hidden border border-blue-brand/20 min-h-[350px]">
      
      {/* 1. Header label indicating physical map location */}
      <div className="absolute top-3 left-3 right-3 z-10 bg-black/80 backdrop-blur-md rounded-xl p-2.5 border border-blue-brand/30 flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-blue-brand" />
          <span className="font-bold text-white uppercase tracking-tight">Ecosistema Argentina</span>
        </div>
        <span className="text-[9px] bg-blue-brand/20 text-blue-brand px-1.5 py-0.5 rounded font-mono font-bold">
          LIVE DATA
        </span>
      </div>

      {/* 2. SVG Vector Map of Argentina & Nodes */}
      <div className="absolute inset-x-0 top-0 bottom-24 z-0 flex items-center justify-center bg-[#05060A] p-4 select-none">
        <svg 
          viewBox="10 -5 90 110" 
          className="w-full h-full stroke-blue-brand/10 opacity-90 transition-all duration-500"
        >
          <defs>
            <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Futuristic Grid */}
          <g className="opacity-10 stroke-blue-brand stroke-[0.25]" strokeDasharray="3 3">
            <line x1="20" y1="0" x2="20" y2="100" />
            <line x1="40" y1="0" x2="40" y2="100" />
            <line x1="60" y1="0" x2="60" y2="100" />
            <line x1="80" y1="0" x2="80" y2="100" />
            <line x1="0" y1="20" x2="100" y2="20" />
            <line x1="0" y1="40" x2="100" y2="40" />
            <line x1="0" y1="60" x2="100" y2="60" />
            <line x1="0" y1="80" x2="100" y2="80" />
          </g>

          {/* Region Halos */}
          {regions.map((region) => (
            <circle
              key={`halo-${region.id}`}
              cx={region.x}
              cy={region.y}
              r="8"
              className="fill-violet-500/10 stroke-violet-500/30 animate-pulse"
              strokeWidth="0.5"
            />
          ))}

          {/* Connection Circuits */}
          {regions.map((region, i) => (
             i < regions.length - 1 && (
               <path 
                 key={`path-${i}`}
                 d={`M ${region.x} ${region.y} L ${regions[i+1].x} ${regions[i+1].y}`}
                 className="stroke-blue-brand/40 stroke-[0.5]" 
                 strokeDasharray="2 2"
                 style={{ filter: 'url(#neon)' }}
               />
             )
          ))}

          {/* Styled visual silhouette of Argentina boundary */}
          <path
            d="M 52 4 C 56 4, 61 2, 65 4 C 67 4, 71 3, 72 6 C 74 10, 77 12, 79 17 C 81 22, 85 24, 82 28 C 79 32, 70 34, 68 36 C 67 39, 69 41, 71 43 C 74 46, 75 49, 73 52 C 70 55, 66 53, 63 56 C 60 59, 62 64, 60 67 C 58 72, 54 75, 52 79 C 49 84, 46 87, 44 91 C 42 95, 41 97, 39 96 C 38 95, 37 92, 36 88 C 35 83, 38 78, 38 74 C 38 69, 41 65, 40 60 C 39 55, 36 50, 36 45 C 36 40, 39 35, 39 30 C 38 25, 40 21, 41 17 C 41 12, 45 8, 48 6 Z"
            className="fill-[#0D1525] stroke-blue-brand/60 stroke-[1.2]"
            style={{ filter: 'url(#neon)' }}
          />

          {/* User Location Marker */}
          {userCoords && (
             <>
               <circle 
                 cx={67 + (userCoords.lng + 58.38) * 100} 
                 cy={46 - (userCoords.lat + 34.6) * 100} 
                 r="3" 
                 className="fill-blue-brand animate-ping" 
               />
               <circle 
                 cx={67 + (userCoords.lng + 58.38) * 100} 
                 cy={46 - (userCoords.lat + 34.6) * 100} 
                 r="1.5" 
                 className="fill-white" 
               />
             </>
          )}

          {/* Commerce/Entrepreneur Markers + Coverage Radius */}
          {markers.map((marker, i) => (
            <g key={i}>
              <circle
                cx={marker.x}
                cy={marker.y}
                r="6"
                className="fill-blue-brand/5 stroke-blue-brand/20"
              />
              <circle 
                cx={marker.x} cy={marker.y} r="2" 
                className={marker.type === 'comercio' ? 'fill-[#FF3B30] animate-pulse' : 'fill-[#FFC107] animate-pulse'}
                style={{ filter: 'url(#neon)' }}
              />
              <circle 
                cx={marker.x} cy={marker.y} r="4" 
                className={marker.type === 'comercio' ? 'fill-orange-400/20' : 'fill-emerald-400/20'}
              />
            </g>
          ))}
        </svg>

        {/* Branding Logo */}
        <div className="absolute bottom-2 left-4 text-[10px] text-gray-500 font-mono">
          Peluquería Canina Gustavo Bettiol
        </div>
      </div>

      {/* 3. Detailed control HUD beneath Argentina Map */}
      <div className="z-10 bg-[#0C121D]/95 backdrop-blur-md rounded-2xl p-3 border border-blue-brand/20 text-[10px] w-full space-y-2 shrink-0">
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-1.5">
          <div>
            <span className="text-[9px] text-gray-400 block uppercase font-mono font-bold">STATUS DE RED</span>
            <span className="font-bold text-white text-[11px] font-display flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-brand" />
              {activeNode.name}
            </span>
          </div>
          <div className="flex bg-black/35 px-2.5 py-1 rounded-lg items-center gap-1 font-mono">
            {getWeatherIcon(activeNode.weather)}
            <span className="text-white font-bold uppercase text-[8px]">{activeNode.weather}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-tight">
          <div className="bg-black/20 p-2 rounded-lg border border-blue-brand/10">
            <span className="text-gray-400 block text-[8px]">COMERCIOS</span>
            <div className="flex items-center gap-1 text-orange-400">
                <Building2 className="w-3 h-3"/>
                <strong className="text-xs font-bold">12</strong>
            </div>
          </div>
          <div className="bg-black/20 p-2 rounded-lg border border-blue-brand/10">
            <span className="text-gray-400 block text-[8px]">EMPRENDEDORES</span>
            <div className="flex items-center gap-1 text-emerald-400">
                <Package className="w-3 h-3"/>
                <strong className="text-xs font-bold">8</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
