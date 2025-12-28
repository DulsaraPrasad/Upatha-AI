
export type Language = 'en' | 'si';

export interface UserInput {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  language: Language;
}

export interface HouseData {
  house: number;
  planets: string[];
}

export interface DossierReport {
  historicalContext: string;
  biorhythmPsychology: string;
  generationalIdentity: string;
  lagna: string; // New: Ascendant description
  education: string; // New: Education analysis
  marriageAndPartner: string; // New: Marriage and partner analysis
  health: string; // New: Health analysis
  futureOutlook: string; // New: Decade-by-decade future outlook
  hatharaKendraya: HouseData[];
}

export const PLANET_METADATA: Record<string, { color: string; si: string }> = {
  Sun: { color: '#FFD700', si: 'රවි' },
  Moon: { color: '#B0C4DE', si: 'සඳු' },
  Mars: { color: '#FF4500', si: 'කුජ' },
  Mercury: { color: '#32CD32', si: 'බුධ' },
  Jupiter: { color: '#FFA500', si: 'ගුරු' },
  Venus: { color: '#FF69B4', si: 'ශුක්‍ර' },
  Saturn: { color: '#4169E1', si: 'ශනි' },
  Rahu: { color: '#708090', si: 'රාහු' },
  Ketu: { color: '#8B4513', si: 'කේතු' },
  Uranus: { color: '#40E0D0', si: 'යුරේනස්' },
  Neptune: { color: '#0000CD', si: 'නෙප්චූන්' },
  Pluto: { color: '#4B0082', si: 'ප්ලූටෝ' }
};

export const PLANETS_SI: Record<string, string> = Object.fromEntries(
  Object.entries(PLANET_METADATA).map(([key, val]) => [key, val.si])
);
