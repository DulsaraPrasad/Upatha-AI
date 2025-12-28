
import React, { useState } from 'react';
import { UserInput, DossierReport } from './types';
import { generateDossier } from './services/geminiService';
import HatharaKendraya from './components/HatharaKendraya';

const App: React.FC = () => {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: 'Male',
    birthDate: '',
    birthTime: '',
    language: 'si',
  });
  const [report, setReport] = useState<DossierReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = () => {
    setFormData(prev => ({ ...prev, language: prev.language === 'si' ? 'en' : 'si' }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.birthTime) {
      setError(formData.language === 'si' ? "කරුණාකර නම, දිනය සහ වේලාව ඇතුළත් කරන්න." : "Please provide name, date, and time.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await generateDossier(formData);
      setReport(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the dossier.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isSinhala = formData.language === 'si';

  const SectionTitle = ({ number, titleEn, titleSi, alignRight = false }: { number: number, titleEn: string, titleSi: string, alignRight?: boolean }) => (
    <h3 className={`text-3xl font-bold text-[#3e2723] mb-6 flex items-center gap-4 ${alignRight ? 'justify-end text-right' : ''}`}>
      {!alignRight && <span className="text-[#d4af37]">0{number}.</span>}
      {isSinhala ? titleSi : titleEn}
      {alignRight && <span className="text-[#d4af37]">0{number}.</span>}
    </h3>
  );

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="py-12 text-center animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-[#3e2723] mb-2">
          UPATHA <span className="text-[#d4af37]">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#8d6e63] font-medium italic">
          {isSinhala ? "උපතේ සිට ජීවිතය දක්වා වූ විද්‍යුත් දෝසියේ" : "A Definitive Life Dossier: From Birth to Identity"}
        </p>
        
        {/* Language Switch */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-6 py-2 bg-[#3e2723] text-[#f5f2eb] rounded-full hover:bg-[#5d4037] transition-all shadow-md active:scale-95"
          >
            <span className={isSinhala ? 'opacity-50' : 'font-bold'}>EN</span>
            <div className={`w-10 h-5 bg-[#8d6e63] rounded-full relative transition-colors`}>
               <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isSinhala ? 'translate-x-5' : ''}`}></div>
            </div>
            <span className={isSinhala ? 'font-bold' : 'opacity-50'}>සිංහල</span>
          </button>
        </div>
      </header>

      {/* Main Form */}
      {!report && (
        <section className="bg-white/80 p-8 md:p-12 antique-border rounded shadow-2xl animate-fade-in relative">
          <div className="absolute top-4 right-4 text-[#d4af37] opacity-20 hidden md:block">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v6h-2zm0-4h2v2h-2z"/></svg>
          </div>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <label className="block">
                <span className="text-[#5d4037] font-bold block mb-1">
                  {isSinhala ? 'පූර්ණ නාමය' : 'Full Name'}
                </span>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  className="w-full bg-[#fcfaf7] border-b-2 border-[#8d6e63] p-3 focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder={isSinhala ? 'ඔබේ නම ඇතුළත් කරන්න' : 'Enter your name'}
                />
              </label>

              <label className="block">
                <span className="text-[#5d4037] font-bold block mb-1">
                  {isSinhala ? 'ස්ත්‍රී/පුරුෂ භාවය' : 'Gender'}
                </span>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  className="w-full bg-[#fcfaf7] border-b-2 border-[#8d6e63] p-3 focus:outline-none focus:border-[#d4af37] transition-colors appearance-none"
                >
                  <option value="Male">{isSinhala ? 'පුරුෂ' : 'Male'}</option>
                  <option value="Female">{isSinhala ? 'ස්ත්‍රී' : 'Female'}</option>
                  <option value="Other">{isSinhala ? 'වෙනත්' : 'Other'}</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[#5d4037] font-bold block mb-1">
                  {isSinhala ? 'උපන් දිනය' : 'Birth Date'}
                </span>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={formData.birthDate} 
                  onChange={handleInputChange}
                  className="w-full bg-[#fcfaf7] border-b-2 border-[#8d6e63] p-3 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </label>

              <label className="block">
                <span className="text-[#5d4037] font-bold block mb-1">
                  {isSinhala ? 'උපන් වේලාව' : 'Birth Time'}
                </span>
                <input 
                  type="time" 
                  name="birthTime" 
                  value={formData.birthTime} 
                  onChange={handleInputChange}
                  className="w-full bg-[#fcfaf7] border-b-2 border-[#8d6e63] p-3 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </label>
            </div>

            <div className="md:col-span-2 pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 text-2xl font-bold uppercase tracking-widest text-white transition-all shadow-xl rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'gold-gradient hover:scale-[1.01] active:scale-95 text-[#3e2723]'}`}
              >
                {loading ? (isSinhala ? 'ගවේෂණය කරමින් පවතී...' : 'GENERATING DOSSIER...') : (isSinhala ? 'වාර්තාව උත්පාදනය කරන්න' : 'GENERATE LIFE DOSSIER')}
              </button>
              {error && <p className="text-red-600 mt-4 text-center font-bold animate-bounce">{error}</p>}
            </div>
          </form>
        </section>
      )}

      {/* Report View */}
      {report && (
        <article className="animate-fade-in bg-white/90 p-8 md:p-16 antique-border rounded shadow-2xl prose prose-stone max-w-none">
          <div className="text-center mb-12 border-b-2 border-[#d4af37] pb-8 relative">
             <div className="absolute top-0 left-0 text-[#d4af37] font-serif text-sm italic opacity-50">Confidential / විශ්වාසදායි</div>
            <h2 className="text-4xl md:text-5xl text-[#3e2723] font-bold mb-2">
              {isSinhala ? 'ජීවිත වාර්තාව' : 'THE LIFE DOSSIER'}
            </h2>
            <p className="text-[#8d6e63] uppercase tracking-widest text-lg font-bold">
              {formData.name} • {formData.birthDate} • {formData.birthTime}
            </p>
          </div>

          <div className="mb-20">
             <HatharaKendraya data={report.hatharaKendraya} language={formData.language} />
          </div>

          <section className="mb-20 border-l-8 border-[#d4af37] pl-8">
            <SectionTitle number={1} titleEn="Historical Context" titleSi="ඓතිහාසික සන්දර්භය" />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-[#d4af37] font-serif">
              {report.historicalContext}
            </div>
          </section>

          <section className="mb-20 border-r-8 border-[#8d6e63] pr-8 text-right">
            <SectionTitle number={2} titleEn="Biorhythm & Psychology" titleSi="ජෛව රිද්මය සහ මනෝවිද්‍යාව" alignRight />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.biorhythmPsychology}
            </div>
          </section>

          <section className="mb-20 border-l-8 border-[#3e2723] pl-8">
            <SectionTitle number={3} titleEn="Generational Identity" titleSi="පරම්පරාගත අනන්‍යතාවය" />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.generationalIdentity}
            </div>
          </section>

          {/* New Sections */}
          <section className="mb-20 border-r-8 border-[#d4af37] pr-8 text-right">
            <SectionTitle number={4} titleEn="Ascendant (Lagna)" titleSi="ලග්නය" alignRight />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.lagna}
            </div>
          </section>

          <section className="mb-20 border-l-8 border-[#8d6e63] pl-8">
            <SectionTitle number={5} titleEn="Education" titleSi="අධ්‍යාපනය" />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.education}
            </div>
          </section>

          <section className="mb-20 border-r-8 border-[#3e2723] pr-8 text-right">
            <SectionTitle number={6} titleEn="Marriage & Partner" titleSi="විවාහය සහ සහකරු" alignRight />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.marriageAndPartner}
            </div>
          </section>

          <section className="mb-20 border-l-8 border-[#d4af37] pl-8">
            <SectionTitle number={7} titleEn="Health Outlook" titleSi="සෞඛ්‍යය" />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.health}
            </div>
          </section>

          <section className="mb-20 border-r-8 border-[#8d6e63] pr-8 text-right">
            <SectionTitle number={8} titleEn="Future Outlook" titleSi="අනාගතය" alignRight />
            <div className="text-xl leading-relaxed text-[#4e342e] whitespace-pre-wrap font-serif">
              {report.futureOutlook}
            </div>
          </section>
          {/* End New Sections */}

          <div className="mt-20 pt-12 border-t-2 border-[#8d6e63] text-center">
            <button 
              onClick={() => { setReport(null); setError(null); }}
              className="px-10 py-4 bg-[#3e2723] text-white rounded font-bold hover:bg-[#5d4037] transition-all shadow-lg active:scale-95"
            >
              {isSinhala ? 'නව වාර්තාවක් සාදන්න' : 'CREATE NEW DOSSIER'}
            </button>
            <p className="text-sm text-[#8d6e63] mt-8 italic opacity-70">
              {isSinhala ? 'මෙම වාර්තාව Upatha AI කෘතිම බුද්ධිය මඟින් පූර්ණ වශයෙන් සකස් කරන ලද්දකි.' : 'Dossier generated with pride by Upatha AI. All cosmic logic is synthesized.'}
            </p>
          </div>
        </article>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#3e2723]/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-16 rounded-lg text-center shadow-2xl antique-border max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 gold-gradient animate-pulse"></div>
            <div className="w-24 h-24 border-8 border-t-[#d4af37] border-r-transparent border-b-[#8d6e63] border-l-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <h2 className="text-3xl font-bold text-[#3e2723] mb-4 uppercase tracking-widest">
              {isSinhala ? 'ජීවන රේඛා ගවේෂණය කරමින්...' : 'Charting Life\'s Course...'}
            </h2>
            <p className="text-[#8d6e63] font-medium text-lg italic">
              {isSinhala ? 'ඔබේ ජීවන වාර්තාව, කේන්දරය සහ අනාගත දර්ශන සකස් කරමින් පවතී. කරුණාකර රැඳී සිටින්න.' : 'Mapping planetary alignments, decoding generational narratives, and foretelling your future. One moment.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
