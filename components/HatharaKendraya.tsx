
import React, { useState } from 'react';
import { HouseData, PLANET_METADATA, Language } from '../types';

interface Props {
  data: HouseData[];
  language: Language;
}

const HatharaKendraya: React.FC<Props> = ({ data, language }) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const isSinhala = language === 'si';

  const getPlanetsForHouse = (houseNum: number) => {
    return data.find(h => h.house === houseNum)?.planets || [];
  };

  const renderPlanetIcons = (planets: string[], x: number, y: number) => {
    return planets.map((p, idx) => {
      const meta = PLANET_METADATA[p] || { color: '#ccc', si: p };
      const offsetX = (idx % 3 - 1) * 18;
      const offsetY = Math.floor(idx / 3) * 18;
      return (
        <g key={`${p}-${idx}`} className="transition-transform duration-300 hover:scale-110 cursor-help">
          <circle cx={x + offsetX} cy={y + offsetY} r="7" fill={meta.color} stroke="#3e2723" strokeWidth="1" />
          <text x={x + offsetX} y={y + offsetY + 3} textAnchor="middle" className="text-[6px] font-bold fill-white" style={{ pointerEvents: 'none' }}>
            {p.charAt(0)}
          </text>
          <title>{isSinhala ? meta.si : p}</title>
        </g>
      );
    });
  };

  const housePaths = [
    { id: 1, d: "M200,10 L10,200 L200,390 L390,200 Z", center: [200, 200], label: [200, 80] }, // Large Diamond (actually house 1,4,7,10 are inside)
  ];

  // Manual Coordinates for each house "chamber"
  const houseConfig: Record<number, { path: string; labelPos: [number, number]; planetPos: [number, number] }> = {
    1: { path: "M200,10 L105,105 L200,200 L295,105 Z", labelPos: [200, 45], planetPos: [200, 100] },
    2: { path: "M200,10 L10,10 L105,105 Z", labelPos: [100, 40], planetPos: [70, 60] },
    3: { path: "M10,10 L10,200 L105,105 Z", labelPos: [40, 100], planetPos: [60, 130] },
    4: { path: "M10,200 L105,295 L200,200 L105,105 Z", labelPos: [110, 200], planetPos: [110, 220] },
    5: { path: "M10,200 L10,390 L105,295 Z", labelPos: [40, 300], planetPos: [60, 270] },
    6: { path: "M10,390 L200,390 L105,295 Z", labelPos: [100, 360], planetPos: [70, 330] },
    7: { path: "M200,390 L295,295 L200,200 L105,295 Z", labelPos: [200, 355], planetPos: [200, 300] },
    8: { path: "M200,390 L390,390 L295,295 Z", labelPos: [300, 360], planetPos: [330, 330] },
    9: { path: "M390,390 L390,200 L295,295 Z", labelPos: [360, 300], planetPos: [340, 270] },
    10: { path: "M390,200 L295,105 L200,200 L295,295 Z", labelPos: [290, 200], planetPos: [290, 220] },
    11: { path: "M390,200 L390,10 L295,105 Z", labelPos: [360, 100], planetPos: [340, 130] },
    12: { path: "M390,10 L200,10 L295,105 Z", labelPos: [300, 40], planetPos: [330, 60] },
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 my-12 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-2 bg-[#d4af37] opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
        <svg width="400" height="400" viewBox="0 0 400 400" className="relative drop-shadow-2xl bg-white/10 rounded-lg overflow-visible">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background & Outer Border */}
          <rect x="0" y="0" width="400" height="400" fill="#fffaf0" stroke="#3e2723" strokeWidth="4" />
          
          {/* Main Frames */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="#8d6e63" strokeWidth="1" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#8d6e63" strokeWidth="1" />
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#3e2723" strokeWidth="2" />

          {/* Individual Houses */}
          {Object.entries(houseConfig).map(([numStr, cfg]) => {
            const num = parseInt(numStr);
            const isSelected = selectedHouse === num;
            const housePlanets = getPlanetsForHouse(num);

            return (
              <g 
                key={num} 
                onClick={() => setSelectedHouse(isSelected ? null : num)} 
                className="cursor-pointer group/house"
              >
                <path 
                  d={cfg.path} 
                  fill={isSelected ? "#d4af3733" : "transparent"} 
                  stroke={isSelected ? "#d4af37" : "#3e2723"} 
                  strokeWidth={isSelected ? 3 : 1}
                  className="transition-all duration-300 group-hover/house:fill-[#d4af3711]"
                />
                
                {/* House Number Label */}
                <circle cx={cfg.labelPos[0]} cy={cfg.labelPos[1]} r="10" fill={isSelected ? "#d4af37" : "#fff"} stroke="#3e2723" strokeWidth="0.5" />
                <text 
                  x={cfg.labelPos[0]} 
                  y={cfg.labelPos[1] + 4} 
                  textAnchor="middle" 
                  className={`text-[10px] font-bold ${isSelected ? 'fill-white' : 'fill-[#8d6e63]'}`}
                >
                  {num}
                </text>

                {/* Planets as colored circles */}
                {renderPlanetIcons(housePlanets, cfg.planetPos[0], cfg.planetPos[1])}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="w-full max-w-sm bg-white/80 p-6 rounded-lg border-2 border-[#d4af37] shadow-xl min-h-[400px]">
        <h4 className="text-2xl font-bold text-[#3e2723] mb-4 border-b-2 border-[#8d6e63] pb-2">
          {isSinhala ? 'භව විස්තරය' : 'House Detail'}
        </h4>
        
        {!selectedHouse ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-60 italic">
            <svg className="w-12 h-12 mb-4 text-[#8d6e63]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{isSinhala ? 'තොරතුරු බැලීමට කොටුවක් තෝරන්න' : 'Select a house to view details'}</p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black text-[#d4af37]">#{selectedHouse}</span>
              <span className="text-lg font-bold text-[#8d6e63] uppercase tracking-tighter">
                {isSinhala ? 'භාවය' : 'BHAAVA'}
              </span>
            </div>
            
            <div>
              <p className="text-[#5d4037] font-bold mb-3 uppercase text-sm tracking-widest border-l-4 border-[#d4af37] pl-3">
                {isSinhala ? 'ග්‍රහයන්' : 'Planets'}
              </p>
              <div className="flex flex-wrap gap-3">
                {getPlanetsForHouse(selectedHouse).length > 0 ? (
                  getPlanetsForHouse(selectedHouse).map(p => (
                    <div key={p} className="flex items-center gap-2 px-3 py-1 bg-[#fcfaf7] rounded-full border border-[#8d6e63] shadow-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLANET_METADATA[p]?.color }}></div>
                      <span className="text-sm font-bold text-[#3e2723]">
                        {isSinhala ? PLANET_METADATA[p]?.si : p}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-[#8d6e63]">{isSinhala ? 'ග්‍රහයන් නොමැත' : 'No planets in this house'}</p>
                )}
              </div>
            </div>

            <div className="pt-4 text-[#4e342e] leading-relaxed">
              <p className="text-sm">
                {isSinhala 
                  ? `${selectedHouse} වන භාවය සාමාන්‍යයෙන් ජීවිතයේ ${selectedHouse === 1 ? 'පෞරුෂය සහ ශරීරය' : selectedHouse === 2 ? 'ධනය සහ පවුල' : selectedHouse === 4 ? 'මව සහ ඉඩකඩම්' : 'විවිධ අංශ'} නියෝජනය කරයි.` 
                  : `House #${selectedHouse} typically governs ${selectedHouse === 1 ? 'personality and physical appearance' : selectedHouse === 2 ? 'wealth and family' : selectedHouse === 4 ? 'mother and fixed assets' : 'various life aspects'}.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HatharaKendraya;
