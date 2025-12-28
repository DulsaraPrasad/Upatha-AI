console.log("App Started");

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. UPDATED API KEY
const API_KEY = "AIzaSyCBRtRgiN1BiGhlQdlpyNdbbKnpQUDsbiw";

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
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });
    
    const prompt = `
ඔබ "සැකලකල" (Sakalakala) විශ්ලේෂකයෙක්. උපතේ සිට අනාගතය දක්වා සියලුම අංශ ගැඹුරු රාජකාරි සිංහලින් විග්‍රහ කරන්න.

උපන් විස්තර:
- නම: ${input.name}
- ස්ත්‍රී/පුරුෂ භාවය: ${input.gender}
- උපන් දිනය: ${input.birthDate}
- උපන් වේලාව: ${input.birthTime}

කරුණාකර පහත සිංහල ශීර්ෂයන් යටතේ සම්පූර්ණ විශ්ලේෂණයක් ලබා දෙන්න (එක් එක් කොටස් 250-350 වචන):

1. ලග්නය (Lagna/Ascendant Analysis):
   - උපන් වේලාව හා දිනය අනුව ලග්න රාශිය තීරණය කරන්න
   - පෞරුෂය, ශාරීරික ලක්ෂණ, මානසික ගුණාංග විස්තර කරන්න
   - 1 වන භාවයේ බලපෑම් විග්‍රහ කරන්න

2. අධ්‍යාපනය (Education & Career):
   - 4 වන සහ 5 වන භාව බලපෑම් අනුව අධ්‍යාපන ශක්‍යතාව
   - වඩාත් සුදුසු වෘත්තීය ක්ෂේත්‍ර
   - ඉගෙනීමේ රටා සහ බුද්ධි ශක්‍යතා

3. විවාහය සහ සහකරු (Marriage & Partner):
   - 7 වන භාවයේ බලපෑම් අනුව සහකරුගේ ස්වභාවය
   - සහකරුගේ ගුණාංග, පෞරුෂය, ශාරීරික ලක්ෂණ
   - විවාහ ජීවිතය හා සබඳතා ගතිකත්වය

4. සෞඛ්‍යය (Health & Vitality):
   - 6 වන සහ 8 වන භාව බලපෑම් අනුව ශාරීරික ශක්තිය
   - අවධානය යොමු කළ යුතු සෞඛ්‍ය අංශ
   - නිරෝගී ජීවන රටා පිළිබඳ යෝජනා

5. අනාගතය (Future Outlook):
   - දශක අනුව ජීවන ගමන් විස්තරය:
     * 0-10 වයස: ළමා කාලය
     * 11-20 වයස: යෞවන කාලය
     * 21-30 වයස: වැඩිහිටි ජීවිතයේ ආරම්භය
     * 31-40 වයස: වෘත්තීය හා පෞද්ගලික වර්ධනය
     * 41-50 වයස: මධ්‍ය වයස අභියෝග හා අවස්ථා
     * 51-60 වයස: පරිණත කාලය
     * 61-70 වයස: වැඩිහිටි කාලය
     * 71-80 වයස: ප්‍රඥාවේ කාලය
   - ප්‍රධාන අභියෝග හා අවස්ථා
   - සමස්ත ධනාත්මක සාරාංශය

6. ඓතිහාසික පසුබිම (Historical Era):
   - උපන් වසරේ ලෝක ප්‍රධාන සිදුවීම්
   - ශ්‍රී ලංකාවේ සංස්කෘතික හා සමාජ-ආර්ථික තත්ත්වය
   - තාක්ෂණ අවධියේ තත්ත්වය

4. CHART DATA - අවසානයේ හතර කේන්දරය:
   - උපන් දිනය හා වේලාව අනුව සත්‍ය ජ්‍යෝතිෂ් ගණනයක් කර ග්‍රහ පිහිටීම් තීරණය කරන්න
   - 12 භව සඳහා ග්‍රහ බෙදා හරින්න (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)

JSON ප්‍රතිදානය (සම්පූර්ණ JSON වස්තුවක් ලෙස):
{
  "ලග්නය": "විස්තරය මෙහි...",
  "අධ්‍යාපනය": "විස්තරය මෙහි...",
  "විවාහය සහ සහකරු": "විස්තරය මෙහි...",
  "සෞඛ්‍යය": "විස්තරය මෙහි...",
  "අනාගතය": "විස්තරය මෙහි...",
  "ඓතිහාසික පසුබිම": "විස්තරය මෙහි...",
  "hatharaKendraya": [
    { "house": 1, "planets": ["Sun", "Mercury"] },
    { "house": 2, "planets": [] },
    ...
    { "house": 12, "planets": ["Saturn"] }
  ]
}

සියලුම ප්‍රතිචාර රාජකාරි සිංහලෙන් ලබා දෙන්න. JSON ව්‍යුහය නිවැරදිව පවත්වා ගන්න.
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
    let errorMsg = "An unexpected error occurred while generating the dossier.";
    
    if (error.message?.includes("API_KEY_INVALID")) {
      errorMsg = "Invalid API key. Please check your Gemini API key configuration.";
    } else if (error.message?.includes("404")) {
      errorMsg = "Model not found. Please check the model name.";
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    showError(errorMsg);
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
        ${isSinhala ? 'ලග්නය' : 'Ascendant (Lagna)'}
      </h3>
      <div class="section-content first-letter">${report["ලග්නය"] || report.lagna || ''}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'අධ්‍යාපනය' : 'Education & Career'}
        <span class="section-number">02.</span>
      </h3>
      <div class="section-content">${report["අධ්‍යාපනය"] || report.education || ''}</div>
    </div>

    <div class="report-section-wrapper section-border-left">
      <h3 class="section-title">
        <span class="section-number">03.</span>
        ${isSinhala ? 'විවාහය සහ සහකරු' : 'Marriage & Partner'}
      </h3>
      <div class="section-content">${report["විවාහය සහ සහකරු"] || report.marriageAndPartner || ''}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'සෞඛ්‍යය' : 'Health & Vitality'}
        <span class="section-number">04.</span>
      </h3>
      <div class="section-content">${report["සෞඛ්‍යය"] || report.health || ''}</div>
    </div>

    <div class="report-section-wrapper section-border-left">
      <h3 class="section-title">
        <span class="section-number">05.</span>
        ${isSinhala ? 'අනාගතය' : 'Future Outlook'}
      </h3>
      <div class="section-content">${report["අනාගතය"] || report.futureOutlook || ''}</div>
    </div>

    <div class="report-section-wrapper section-border-right">
      <h3 class="section-title right">
        ${isSinhala ? 'ඓතිහාසික පසුබිම' : 'Historical Era'}
        <span class="section-number">06.</span>
      </h3>
      <div class="section-content">${report["ඓතිහාසික පසුබිම"] || report.historicalContext || ''}</div>
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
    1: { en: 'House #1 governs personality, physical appearance, and self-identity', si: '1 වන භාවය පෞරුෂය, ශාරීරික රූපය හා ස්වයං අනන්‍යතාවය නියෝජනය කරයි' },
    2: { en: 'House #2 governs wealth, family, and speech', si: '2 වන භාවය ධනය, පවුල හා කථනය නියෝජනය කරයි' },
    3: { en: 'House #3 governs siblings, courage, and communication', si: '3 වන භාවය සහෝදර, ධෛර්යය හා සන්නිවේදනය නියෝජනය කරයි' },
    4: { en: 'House #4 governs mother, property, and inner peace', si: '4 වන භාවය මව, දේපළ හා අභ්‍යන්තර සාමය නියෝජනය කරයි' },
    5: { en: 'House #5 governs education, children, and creativity', si: '5 වන භාවය අධ්‍යාපනය, දරුවන් හා නිර්මාණශීලීත්වය නියෝජනය කරයි' },
    6: { en: 'House #6 governs health, enemies, and daily work', si: '6 වන භාවය සෞඛ්‍යය, සතුරන් හා දෛනික කටයුතු නියෝජනය කරයි' },
    7: { en: 'House #7 governs marriage, partnerships, and relationships', si: '7 වන භාවය විවාහය, හවුල්කාරිත්ව හා සබඳතා නියෝජනය කරයි' },
    8: { en: 'House #8 governs longevity, transformation, and hidden matters', si: '8 වන භාවය ආයුෂ, පරිවර්තනය හා සැඟවුණු කරුණු නියෝජනය කරයි' },
    9: { en: 'House #9 governs fortune, higher learning, and spirituality', si: '9 වන භාවය වාසනාව, උසස් අධ්‍යාපනය හා අධ්‍යාත්මිකත්වය නියෝජනය කරයි' },
    10: { en: 'House #10 governs career, status, and public image', si: '10 වන භාවය වෘත්තිය, තත්ත්වය හා ප්‍රසිද්ධ රූපය නියෝජනය කරයි' },
    11: { en: 'House #11 governs gains, ambitions, and social networks', si: '11 වන භාවය ලාභ, අභිලාෂයන් හා සමාජ ජාල නියෝජනය කරයි' },
    12: { en: 'House #12 governs expenses, liberation, and spirituality', si: '12 වන භාවය වියදම්, විමුක්තිය හා අධ්‍යාත්මිකත්වය නියෝජනය කරයි' }
  };
  
  const desc = descriptions[selectedHouse];
  
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
