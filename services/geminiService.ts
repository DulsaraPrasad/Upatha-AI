
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, DossierReport } from "../types";

export const generateDossier = async (input: UserInput): Promise<DossierReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
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
    The astrological insights for Lagna, Education, Marriage, Health, and Future Outlook should be derived from the simulated planetary positions provided in the 'hatharaKendraya' array. Use the planet names directly for analysis (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu).

    JSON Structure:
    {
      "historicalContext": "Detailed analysis of the birth year. Include major global events, specific insights into Sri Lankan culture and socio-economic climate of that era, and the state of technology at the time.",
      "biorhythmPsychology": "Deep analysis based on the specific hour of birth (dawn, midnight, afternoon, etc.). Connect this to psychological archetypes and energy levels.",
      "generationalIdentity": "Discuss how they fit into their specific social era (e.g., Baby Boomer, Gen X, Millennial, Zillennial, Gen Z, or Gen Alpha). Analyze the collective consciousness of their peers.",
      "lagna": "Identify the Lagna (Ascendant) based on the birth time and provide a detailed description of its physical and mental nature. Analyze the influence of any planets posited in or aspecting the 1st house (Lagna) from the hatharaKendraya.",
      "education": "Analyze the 4th and 5th house influences from the hatharaKendraya for academic success, potential field of study, learning style, and intellectual capabilities. Consider the planets in these houses and their lords.",
      "marriageAndPartner": "Analyze the 7th house influences from the hatharaKendraya. Describe the personality, characteristics, and potential compatibility of the life partner. Discuss marital prospects and relationship dynamics based on the 7th house and its ruler.",
      "health": "Based on the planetary positions throughout the hatharaKendraya, particularly in the 6th and 8th houses, identify potential physical strengths and areas requiring health caution or specific wellness practices. Provide general health insights.",
      "futureOutlook": "Provide a decade-by-decade (e.g., 0-10, 11-20, ..., 71-80) outlook for the person's life path, highlighting key phases, challenges, and opportunities based on the simulated astrological influences from the entire hatharaKendraya. Conclude with an overall positive summary.",
      "hatharaKendraya": [
        // An array of 12 objects, each with 'house' (1-12) and 'planets' (array of strings).
        // Distribute planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) logically
        // across the 12 houses based on the provided birth details, simulating an astrological chart.
        // Each object: { "house": 1, "planets": ["Sun", "Mercury"] }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      temperature: 0.8,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          historicalContext: { type: Type.STRING, description: 'Historical context based on birth year.' },
          biorhythmPsychology: { type: Type.STRING, description: 'Psychological analysis based on birth time.' },
          generationalIdentity: { type: Type.STRING, description: 'Generational identity analysis.' },
          lagna: { type: Type.STRING, description: 'Ascendant (Lagna) description.' },
          education: { type: Type.STRING, description: 'Education and academic analysis.' },
          marriageAndPartner: { type: Type.STRING, description: 'Marriage and partner characteristics.' },
          health: { type: Type.STRING, description: 'Health strengths and cautions.' },
          futureOutlook: { type: Type.STRING, description: 'Decade-by-decade future outlook.' },
          hatharaKendraya: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                house: { type: Type.INTEGER, description: 'House number (1-12).' },
                planets: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }, 
                  description: 'List of planets in the house.' 
                }
              },
              required: ["house", "planets"]
            },
            description: 'The 12-house Hathara Kendraya chart with planet positions.'
          }
        },
        required: [
          "historicalContext", "biorhythmPsychology", "generationalIdentity",
          "lagna", "education", "marriageAndPartner", "health", "futureOutlook",
          "hatharaKendraya"
        ]
      },
      thinkingConfig: { thinkingBudget: 30000 }, // Increased budget for more detailed response
    }
  });

  const jsonStr = response.text || "{}";
  try {
    const data = JSON.parse(jsonStr);
    return data as DossierReport;
  } catch (e) {
    console.error("Critical error parsing Gemini JSON output", e);
    throw new Error("The AI provided a response that could not be parsed. Please try again.");
  }
};
