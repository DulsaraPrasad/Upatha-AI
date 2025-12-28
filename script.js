console.log("App Started");

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. HARDCODED API KEY - Replace with your actual key
const GEMINI_API_KEY = "AIzaSyBLdn4EsHcp6etwtfTpERV6WSTQOYN-HOU";

// Planet metadata
const PLANET_METADATA = {
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

// State
let currentLanguage = 'si';
let currentReport = null;
let selectedHouse = null;

// DOM Elements
const langToggle = document.getElementById('langToggle');
const toggleKnob = document.getElementById('toggleKnob');
const dossierForm = document.getElementById('dossierForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const formSection = document.getElementById('formSection');
const reportSection = document.getElementById('reportSection');
const outputContainer = document.getElementById('outputContainer');
const errorMessage = document.getElementById('errorMessage');
const generateBtn = document.getElementById('generateBtn');

// Language Toggle
langToggle.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'si' ? 'en' : 'si';
  updateLanguage();
});

function updateLanguage() {
  const isSinhala = currentLanguage === 'si';
  
  // Toggle language visibility
  document.querySelectorAll('.lang-en').forEach(el => {
    el.classList.toggle('hidden', isSinhala);
  });
  document.querySelectorAll('.lang-si').forEach(el => {
    el.classList.toggle('hidden', !isSinhala);
  });
  
  // Update toggle knob
  toggleKnob.classList.toggle('active', isSinhala);
  
  // Update language labels
  document.getElementById('langEn').classList.toggle('font-bold', !isSinhala);
  document.getElementById('langEn').classList.toggle('opacity-50', isSinhala);
  document.getElementById('langSi').classList.toggle('font-bold', isSinhala);
  document.getElementById('langSi').classList.toggle('opacity-50', !isSinhala);
  
  // Update select options
  const genderSelect = document.getElementById('gender');
  Array.from(genderSelect.options).forEach(option => {
    if (isSinhala && option.dataset.si) {
      option.textContent = option.dataset.si;
    } else {
      option.textContent = option.value;
    }
  });
}

// Form Submit
dossierForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    gender: document.getElementById('gender').value,
    birthDate: document.getElementById('birthDate').value,
    birthTime: document.getElementById('birthTime').value,
    language: currentLanguage
  };
  
  if (!formData.name || !formData.birthDate || !formData.birthTime) {
    showError(currentLanguage === 'si' 
      ? "කරුණාකර නම, දිනය සහ වේලාව ඇතුළත් කරන්න."
      : "Please provide name, date, and time.");
    return;
  }
  
  await generateDossier(formData);
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 5000);
}

// Generate Dossier
async function generateDossier(input) {
  loadingOverlay.classList.remove('hidden');
  generateBtn.disabled = true;
  errorMessage.classList.add('hidden');
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-thinking-exp-1219"
    });
    
    const languagePrompt = input.language === 'si' 
      ? "Return all text content in formal, scholarly Sinhala (රාජකාරි භාෂාව)." 
      : "Return all text content in high-end, sophisticated English.";

    const prompt = `
Generate a comprehensive "Life Dossier" for a person based on their birth details.

Birth Details:
Name: ${input.name}
Gender: ${input.gender}
Birth Date: ${input.birthDate}
Birth Time: ${input.birthTime}

${languagePrompt}

The entire response must be a single JSON object with the specified keys. Each text-based section (excluding hatharaKendraya) should be between 200-300 words.

IMPORTANT: Conduct deep astrological thinking to calculate the accurate planetary positions based on the birth date and time. Use your knowledge of Vedic astrology to determine the Ascendant (Lagna) and place planets in their correct houses (1-12).

The astrological insights for Lagna, Education, Marriage, Health, and Future Outlook should be derived from the actual planetary positions you calculate in the 'hatharaKendraya' array.

JSON Structure:
{
  "historicalContext": "Detailed analysis of the birth year. Include major global events, specific insights into Sri Lankan culture and socio-economic climate of that era, and the state of technology at the time.",
  "biorhythmPsychology": "Deep analysis based on the specific hour of birth (dawn, midnight, afternoon, etc.). Connect this to psychological archetypes and energy levels.",
  "generationalIdentity": "Discuss how they fit into their specific social era (e.g., Baby Boomer, Gen X, Millennial, Zillennial, Gen Z, or Gen Alpha). Analyze the collective consciousness of their peers.",
  "lagna": "Identify the Lagna (Ascendant) based on the birth time and provide a detailed description of its physical and mental nature. Analyze the influence of any planets posited in or aspecting the 1st house (Lagna) from the hatharaKendraya.",
  "education": "Analyze the 4th and 5th house influences from the hatharaKendraya for academic success, potential field of study, learning style, and intellectual capabilities. Consider the planets in these houses and their lords.",
  "marriageAndPartner": "Analyze the 7th house influences from the hatharaKendraya. Describe the personality, characteristics, and potential compatibility of the life partner. Discuss marital prospects and relationship dynamics based on the 7th house and its ruler.",
  "health": "Based on the planetary positions throughout the hatharaKendraya, particularly in the 6th and 8th houses, identify potential physical strengths and areas requiring health caution or specific wellness practices. Provide general health insights.",
  "futureOutlook": "Provide a decade-by-decade (e.g., 0-10, 11-20, ..., 71-80) outlook for the person's life path, highlighting key phases, challenges, and opportunities based on the calculated astrological influences from the entire hatharaKendraya. Conclude with an overall positive summary.",
  "hatharaKendraya": [
    // An array of 12 objects, each with 'house' (1-12) and 'planets' (array of strings).
    // Calculate and distribute planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
    // accurately across the 12 houses based on the birth date and time using Vedic astrology principles.
    // Each object: { "house": 1, "planets": ["Sun", "Mercury"] }
  ]
}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
      }
    });
    
    const response = await result.response;
    const jsonStr = response.text();
    console.log("AI Response:", jsonStr);
    
    const data = JSON.parse(jsonStr);
    currentReport = data;
    
    renderReport(input, data);
    formSection.classList.add('hidden');
    reportSection.classList.remove('hidden');
    
  } catch (error) {
    console.error("Error generating dossier:", error);
    showError(error.message || "An unexpected error occurred while generating the dossier.");
  } finally {
    loadingOverlay.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

// Render Report
function renderReport(input, report) {
  const isSinhala = input.language === 'si';
  
  const html = `
    <div class="report-header">
      <div class="confidential-mark">${isSinhala ? 'විශ්වාසදායී' : 'Confidential'}</div>
      <h2 class="report-title">${isSinhala ? 'ජීවිත වාර්තාව' : 'THE LIFE DOSSIER'}</h2>
      <p class="report-subtitle">
        ${input.name} • ${input.birthDate} • ${input.birthTime}
      </p>
    </div>

    <div class="chart-container">
      ${renderHatharaKendraya(report.hatharaKendraya, input.language)}
    </div>

    <div class="report-section-wrapper section-border-left">
      <h3 class="section-title">
        <span class="section-number">01.</span>
        ${isSinhala ? 'ඓතිහාසික සන්දර්භය' : 'Historical Context'}
      </h3>
      <div class="section-content first-letter">${report.historicalContext}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'ජෛව රිද්මය සහ මනෝවිද්‍යාව' : 'Biorhythm & Psychology'}
        <span class="section-number">02.</span>
      </h3>
      <div class="section-content">${report.biorhythmPsychology}</div>
    </div>

    <div class="report-section-wrapper section-border-left">
      <h3 class="section-title">
        <span class="section-number">03.</span>
        ${isSinhala ? 'පරම්පරාගත අනන්‍යතාවය' : 'Generational Identity'}
      </h3>
      <div class="section-content">${report.generationalIdentity}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'ලග්නය' : 'Ascendant (Lagna)'}
        <span class="section-number">04.</span>
      </h3>
      <div class="section-content">${report.lagna}</div>
    </div>

    <div class="report-section-wrapper section-border-left">
      <h3 class="section-title">
        <span class="section-number">05.</span>
        ${isSinhala ? 'අධ්‍යාපනය' : 'Education'}
      </h3>
      <div class="section-content">${report.education}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'විවාහය සහ සහකරු' : 'Marriage & Partner'}
        <span class="section-number">06.</span>
      </h3>
      <div class="section-content">${report.marriageAndPartner}</div>
    </div>

    <div class="report-section-wrapper section-border-left">
      <h3 class="section-title">
        <span class="section-number">07.</span>
        ${isSinhala ? 'සෞඛ්‍යය' : 'Health Outlook'}
      </h3>
      <div class="section-content">${report.health}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'අනාගතය' : 'Future Outlook'}
        <span class="section-number">08.</span>
      </h3>
      <div class="section-content">${report.futureOutlook}</div>
    </div>

    <div class="report-footer">
      <button class="new-dossier-button" onclick="resetApp()">
        ${isSinhala ? 'නව වාර්තාවක් සාදන්න' : 'CREATE NEW DOSSIER'}
      </button>
      <p class="footer-note">
        ${isSinhala 
          ? 'මෙම වාර්තාව Upatha AI කෘතිම බුද්ධිය මඟින් පූර්ණ වශයෙන් සකස් කරන ලද්දකි.' 
          : 'Dossier generated with pride by Upatha AI. All cosmic logic is synthesized.'}
      </p>
    </div>
  `;
  
  outputContainer.innerHTML = html;
}

// Render Hathara Kendraya Chart
function renderHatharaKendraya(data, language) {
  const isSinhala = language === 'si';
  
  const houseConfig = {
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
  
  let svgContent = `
    <svg width="400" height="400" viewBox="0 0 400 400" class="chart-svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="400" fill="#fffaf0" stroke="#3e2723" stroke-width="4" />
      <line x1="0" y1="0" x2="400" y2="400" stroke="#8d6e63" stroke-width="1" />
      <line x1="400" y1="0" x2="0" y2="400" stroke="#8d6e63" stroke-width="1" />
      <rect x="0" y="0" width="400" height="400" fill="none" stroke="#3e2723" stroke-width="2" />
  `;
  
  Object.entries(houseConfig).forEach(([numStr, cfg]) => {
    const num = parseInt(numStr);
    const housePlanets = data.find(h => h.house === num)?.planets || [];
    const isSelected = selectedHouse === num;
    
    svgContent += `
      <path 
        d="${cfg.path}" 
        fill="${isSelected ? '#d4af3733' : 'transparent'}" 
        stroke="${isSelected ? '#d4af37' : '#3e2723'}" 
        stroke-width="${isSelected ? 3 : 1}"
        class="house-path ${isSelected ? 'house-selected' : ''}"
        data-house="${num}"
        style="cursor: pointer;"
      />
      <circle cx="${cfg.labelPos[0]}" cy="${cfg.labelPos[1]}" r="10" 
              fill="${isSelected ? '#d4af37' : '#fff'}" stroke="#3e2723" stroke-width="0.5" />
      <text x="${cfg.labelPos[0]}" y="${cfg.labelPos[1] + 4}" text-anchor="middle" 
            style="font-size: 10px; font-weight: bold; fill: ${isSelected ? '#fff' : '#8d6e63'};">
        ${num}
      </text>
    `;
    
    housePlanets.forEach((p, idx) => {
      const meta = PLANET_METADATA[p] || { color: '#ccc', si: p };
      const offsetX = (idx % 3 - 1) * 18;
      const offsetY = Math.floor(idx / 3) * 18;
      svgContent += `
        <g class="planet-icon">
          <circle cx="${cfg.planetPos[0] + offsetX}" cy="${cfg.planetPos[1] + offsetY}" 
                  r="7" fill="${meta.color}" stroke="#3e2723" stroke-width="1" />
          <text x="${cfg.planetPos[0] + offsetX}" y="${cfg.planetPos[1] + offsetY + 3}" 
                text-anchor="middle" style="font-size: 6px; font-weight: bold; fill: white; pointer-events: none;">
            ${p.charAt(0)}
          </text>
          <title>${isSinhala ? meta.si : p}</title>
        </g>
      `;
    });
  });
  
  svgContent += `</svg>`;
  
  const detailPanel = renderHouseDetailPanel(data, language);
  
  return `
    <div class="hathara-chart">
      <div class="chart-svg-wrapper">
        <div class="chart-glow"></div>
        ${svgContent}
      </div>
      ${detailPanel}
    </div>
  `;
}

function renderHouseDetailPanel(data, language) {
  const isSinhala = language === 'si';
  
  if (selectedHouse === null) {
    return `
      <div class="house-detail-panel">
        <div class="house-detail-header">
          <h4 class="house-detail-title">${isSinhala ? 'භව විස්තරය' : 'House Detail'}</h4>
        </div>
        <div class="house-empty-state">
          <svg class="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>${isSinhala ? 'තොරතුරු බැලීමට කොටුවක් තෝරන්න' : 'Select a house to view details'}</p>
        </div>
      </div>
    `;
  }
  
  const housePlanets = data.find(h => h.house === selectedHouse)?.planets || [];
  
  const descriptions = {
    1: { en: 'House #1 typically governs personality and physical appearance', si: '1 වන භාවය සාමාන්‍යයෙන් පෞරුෂය සහ ශරීරය නියෝජනය කරයි' },
    2: { en: 'House #2 typically governs wealth and family', si: '2 වන භාවය සාමාන්‍යයෙන් ධනය සහ පවුල නියෝජනය කරයි' },
    4: { en: 'House #4 typically governs mother and fixed assets', si: '4 වන භාවය සාමාන්‍යයෙන් මව සහ ඉඩකඩම් නියෝජනය කරයි' }
  };
  
  const defaultDesc = { 
    en: `House #${selectedHouse} typically governs various life aspects`, 
    si: `${selectedHouse} වන භාවය සාමාන්‍යයෙන් ජීවිතයේ විවිධ අංශ නියෝජනය කරයි` 
  };
  
  const desc = descriptions[selectedHouse] || defaultDesc;
  
  return `
    <div class="house-detail-panel">
      <div class="house-detail-header">
        <h4 class="house-detail-title">${isSinhala ? 'භව විස්තරය' : 'House Detail'}</h4>
      </div>
      <div class="house-detail-content">
        <div class="house-number-display">
          <span class="house-number-large">#${selectedHouse}</span>
          <span class="house-label">${isSinhala ? 'භාවය' : 'BHAAVA'}</span>
        </div>
        <div>
          <p class="planets-section-title">${isSinhala ? 'ග්‍රහයන්' : 'Planets'}</p>
          <div class="planets-list">
            ${housePlanets.length > 0 ? housePlanets.map(p => `
              <div class="planet-badge">
                <div class="planet-color-dot" style="background-color: ${PLANET_METADATA[p]?.color}"></div>
                <span class="planet-name">${isSinhala ? PLANET_METADATA[p]?.si : p}</span>
              </div>
            `).join('') : `<p style="font-size: 0.875rem; font-style: italic; color: #8d6e63;">${isSinhala ? 'ග්‍රහයන් නොමැත' : 'No planets in this house'}</p>`}
          </div>
        </div>
        <div class="house-description">
          <p>${isSinhala ? desc.si : desc.en}</p>
        </div>
      </div>
    </div>
  `;
}

// Handle house selection
document.addEventListener('click', (e) => {
  const housePath = e.target.closest('.house-path');
  if (housePath) {
    const houseNum = parseInt(housePath.dataset.house);
    selectedHouse = selectedHouse === houseNum ? null : houseNum;
    if (currentReport) {
      renderReport({ 
        name: document.getElementById('name').value, 
        birthDate: document.getElementById('birthDate').value, 
        birthTime: document.getElementById('birthTime').value,
        language: currentLanguage 
      }, currentReport);
    }
  }
});

// Reset App
window.resetApp = function() {
  formSection.classList.remove('hidden');
  reportSection.classList.add('hidden');
  currentReport = null;
  selectedHouse = null;
  dossierForm.reset();
  errorMessage.classList.add('hidden');
};

// Initialize
updateLanguage();
