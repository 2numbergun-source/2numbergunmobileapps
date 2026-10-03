import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  FileText, 
  Clock, 
  Smartphone, 
  Flame, 
  HeartHandshake, 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lock,
  Compass,
  FileSpreadsheet
} from 'lucide-react';

export const BenefitsGuideTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'personnel' | 'battalion'>('all');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-900/60 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-800/40 pb-4 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                विशेष रणनीतिक विश्लेषण प्रतिवेदन
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                काठमाडौं उपत्यका सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज मोबाइल एपको उपयोगिता र प्रभावकारिता
              </h2>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-200 bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/50 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>प्रतिवेदन प्रिन्ट / सेभ गर्नुहोस्</span>
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            काठमाडौं उपत्यका सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज नेपाल प्रहरीको एक रणनीतिक र संवेदनशील कार्यदल हो। यस मोबाइल एप्सले 
            <strong className="text-white"> गणका तल्लो दर्जाका प्रहरी जवानदेखि उच्च कमाण्डरसम्म</strong>लाई दैनिक कार्यसञ्चालनमा डिजिटल सुविधा 
            प्रदान गर्नुका साथै गण प्रशासनलाई चुस्त, पारदर्शी र तत्काल परिचालन योग्य बनाउँछ।
          </p>

          {/* Key Impact Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800/60">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-emerald-400 font-mono-nums">३ मिनेट</div>
              <div className="text-xs text-slate-400 mt-1">आपतकालीन QRF परिचालन समय</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-blue-400 font-mono-nums">९०%</div>
              <div className="text-xs text-slate-400 mt-1">कागजी ढड्डा र समयको बचत</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-amber-400 font-mono-nums">१००%</div>
              <div className="text-xs text-slate-400 mt-1">हतियार तथा गोलीगठ्ठाको डिजिटल अडिट</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-400 font-mono-nums">२४/७</div>
              <div className="text-xs text-slate-400 mt-1">पारदर्शी ड्युटी तथा कल्याणकारी पहुँच</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-800/80 border border-slate-700 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          सबै विश्लेषण (Complete)
        </button>
        <button
          onClick={() => setActiveSubTab('personnel')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'personnel'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          १. प्रहरी कर्मचारीलाई सुविधा
        </button>
        <button
          onClick={() => setActiveSubTab('battalion')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'battalion'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          २. कार्यालय / गणलाई फाइदा
        </button>
      </div>

      {/* SECTION 1: PERSONNEL FACILITIES (प्रहरी कर्मचारीहरुले पाउने सुविधाहरु) */}
      {(activeSubTab === 'all' || activeSubTab === 'personnel') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                भाग १: प्रहरी कर्मचारीहरूले पाउने प्रत्यक्ष सुविधाहरू
              </h3>
              <p className="text-xs text-slate-400">
                जवान, हवल्दार तथा कमाण्डरहरूले व्यक्तिगत मोबाइलबाटै प्राप्त गर्ने दैनिक सेवा र सुविधाहरू
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-blue-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  १
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  पारदर्शी र पूर्व-सूचित ड्युटी रोष्टर (Duty Roster Alerts)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                कर्मचारीले आफ्नो ड्युटी कहाँ (उदा: बालुवाटार, सिंहदरबार, टिचिङ परिसर वा महाराजगञ्ज चोक), कति बजेदेखि कति बजेसम्म छ 
                र कुन टोलीसँग खटिनुपर्ने हो भन्ने कुरा <strong>ड्युटी सुरु हुनु अगावै मोबाइलमै सूचना</strong> पाउँछन्। ड्युटी सूची खोज्न गणको बोर्डमा झुम्मिने झन्झट अन्त्य हुन्छ।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-blue-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-600/20 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  २
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  डिजिटल विदा प्रणाली (Online Leave Application)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                घर विदा, बिरामी विदा वा भैपरी विदा लिनका लागि प्रशासन शाखामा लाइन लाग्नु पर्दैन। 
                कर्मचारीले मोबाइलबाटै कारण र मिति राखी निवेदन पेस गर्छन् र आफ्नो विदा स्वीकृत वा अस्वीकृत भएको स्थिति तत्काल हेर्न पाउँछन्। 
                बाँकी विदाको कोटा पनि सिधै एपमा देखिन्छ।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-blue-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-600/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ३
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  हतियार तथा कोट पासबुक (Digital Weapon Clearance)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                आफ्नो नाममा जारी भएको हतियार (INSAS, SLR, ग्यास गन), म्यागजिन, गोली तथा दंगा नियन्त्रण सामग्री (हेल्मेट, सिल्ड) को 
                <strong> डिजिटल रेकर्ड</strong> एपमै हुन्छ। सामग्री बुझाउँदा वा लिँदा कुनै विवाद वा हराउने जोखिम रहँदैन।
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-blue-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ४
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  तलब स्लिप, भत्ता र रासन पारदर्शीता (Salary & Allowances)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                कर्मचारीले प्रत्येक महिनाको तलब स्लिप, ग्रेड रकम, रासन भत्ता, जोखिम भत्ता तथा कर्मचारी सञ्चय कोष / नागरिक लगानी कोष कट्टा 
                विवरण स्पष्ट रूपमा हेर्न र सुरक्षित डाउनलोड गर्न सक्छन्।
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-blue-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-rose-600/20 text-rose-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ५
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  नेपाल प्रहरी अस्पताल महाराजगञ्ज र स्वास्थ्य सुविधा
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                गण महाराजगञ्जसँगै रहेको <strong>नेपाल प्रहरी अस्पताल</strong>को ओपिडी समय, आकस्मिक स्वास्थ्य परामर्श तथा सिफारिस फारम 
                एपबाटै लिई शीघ्र स्वास्थ्य उपचार र औषधि सुविधा प्राप्त गर्न सकिन्छ।
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-blue-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyan-600/20 text-cyan-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ६
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  गोप्य गुनासो र सुझाव पेटिका (Grievance Redressal)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                ब्यारेक मेसको खाना, ड्युटी पक्षपात वा व्यक्तिगत पीरमर्का सम्बन्धी कुनै पनि गुनासो 
                <strong> पूर्ण गोपनीयताका साथ</strong> सिधै गणपति (Battalion Commander) समक्ष पुर्‍याउन सकिन्छ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: BATTALION OFFICE & COMMAND BENEFITS (कार्यालयलाई हुने फाइदाहरु) */}
      {(activeSubTab === 'all' || activeSubTab === 'battalion') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                भाग २: कार्यालय (गण प्रशासन र कमाण्ड) लाई हुने रणनीतिक फाइदाहरू
              </h3>
              <p className="text-xs text-slate-400">
                गणपति, अपरेसन शाखा, कोट शाखा र प्रशासन शाखाले प्राप्त गर्ने प्रशासनिक तथा कार्यगत लाभ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Office Benefit 1 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-emerald-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-600/20 text-emerald-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  १
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  रियलटाइम नफ्री मौज्दात (Real-time Force Strength Dashboard)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                गणपति र अपरेसन अफिसरले १ सेकेन्डमै स्क्रिनमा देख्न सक्छन्: 
                <strong> कुल कति जनशक्ति छन्, कति ड्युटीमा खटिएका छन्, कति स्ट्यान्डबाइ QRF मा छन्, कति बिदामा छन् र कति बिरामी छन्।</strong> 
                कागजी हाजिरी रजिस्टर पल्टाउने आवश्यकता समाप्त हुन्छ।
              </p>
            </div>

            {/* Office Benefit 2 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-emerald-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-red-600/20 text-red-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  २
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  आकस्मिक दंगा/विपद्‌मा ३ मिनेटमै QRF परिचालन (Rapid Call-out)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                काठमाडौं उपत्यकामा अचानक हिंसात्मक प्रदर्शन, भीड नियन्त्रण वा विपद् पर्दा कमाण्डरले 
                <strong> १-क्लिक साइरन कल-आउट अलर्ट</strong> पठाउन सक्छन्। सबै जवानहरूको मोबाइलमा तत्काल उच्च प्राथमिकताको अलार्म बज्छ र 
                ३ मिनेटभित्रै गियर सहित ड्रिल ग्राउन्डमा फल-इन हुन सम्भव हुन्छ।
              </p>
            </div>

            {/* Office Benefit 3 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-emerald-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-600/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ३
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  हतियार र गोलीगठ्ठाको चुस्त अडिट (Zero-Discrepancy Armory)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                कोट शाखामा रहेको प्रत्येक हतियार, अश्रुग्यास सेल र म्यागजिन कुन जवानसँग छ, कुन कम्पनीको जिम्मामा छ भन्ने कुरा 
                डिजिटल ट्र्याक हुन्छ। गोलीगठ्ठाको हिनामिना वा हराउने सम्भावना शून्यमा झर्छ।
              </p>
            </div>

            {/* Office Benefit 4 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-emerald-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ४
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  कागजी खर्च, मुद्रण र प्रशासनिक समयको ९०% बचत
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                दैनिक ड्युटी चिट, विदा स्वीकृतिका ढड्डा, सर्कुलर फोटोकपी र मिसिल व्यवस्थापनमा लाग्ने वार्षिक लाखौँ रुपैयाँ र जनशक्तिको समय बचत हुन्छ। 
                सबै निर्णयहरू डिजिटल ट्रेलमा सुरक्षित रहन्छन्।
              </p>
            </div>

            {/* Office Benefit 5 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-emerald-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ५
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  निष्पक्ष कमाण्ड र जवानहरूको उच्च मनोबल
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                ड्युटीको समान र वैज्ञानिक रोटेसन हुन्छ (कसैलाई लगातार कठीन रात्रिकालीन ड्युटी र कसैलाई सजिलो पर्ने गुनासो हट्छ)। 
                पारदर्शी प्रणालीले जवानहरूमा कमाण्डप्रति विश्वास र व्यावसायिक अनुशासन उच्च राख्छ।
              </p>
            </div>

            {/* Office Benefit 6 */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-emerald-500/40 transition-colors space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-teal-600/20 text-teal-400 text-xs font-bold flex items-center justify-center font-mono-nums">
                  ६
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  काठमाडौं उपत्यका प्रहरी कार्यालय (रानीपोखरी) सँग तीव्र समन्वय
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                माथिल्लो निकायबाट प्राप्त संवेदनशील सुरक्षा आदेश र उपत्यका समन्वय सूचनाहरू तत्काल मातहतका सबै कमाण्डर तथा टोलीसम्म 
                एकै सेकेन्डमा वितरण गर्न सकिन्छ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-1">
          परम्परागत कागजी प्रक्रिया बनाम डिजिटल मोबाइल एप्स प्रणाली
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          महाराजगञ्ज गण नं. २ मा एप्स लागू हुनु अघि र पछिको तुलनात्मक सूचक
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">कार्य / क्षेत्र</th>
                <th className="py-3 px-4 font-semibold text-rose-400">परम्परागत कागजी प्रणाली</th>
                <th className="py-3 px-4 font-semibold text-emerald-400">डिजिटल मोबाइल एप्स</th>
                <th className="py-3 px-4 font-semibold text-right">प्रत्यक्ष लाभ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-normal">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-white">ड्युटी रोष्टर वितरण</td>
                <td className="py-3 px-4 text-slate-400">गणको बोर्डमा टाँसिने, जवानहरू खोज्न आउनुपर्ने</td>
                <td className="py-3 px-4 text-emerald-300">ड्युटी अगावै मोबाइलमै व्यक्तिगत अलर्ट</td>
                <td className="py-3 px-4 text-right font-mono-nums text-emerald-400 font-semibold">१००% पारदर्शी</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-white">विदा निवेदन र स्वीकृति</td>
                <td className="py-3 px-4 text-slate-400">कागजी निवेदन बोकेर विभिन्न शाखा धाउनु पर्ने (२-३ दिन)</td>
                <td className="py-3 px-4 text-emerald-300">मोबाइलबाट १ मिनेटमा आवेदन, तत्काल डिजिटल स्वीकृति</td>
                <td className="py-3 px-4 text-right font-mono-nums text-emerald-400 font-semibold">९५% छिटो</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-white">नफ्री मौज्दात विवरण</td>
                <td className="py-3 px-4 text-slate-400">प्रत्येक कम्पनीले फोन वा रजिस्टरमा गनेर ल्याउनुपर्ने</td>
                <td className="py-3 px-4 text-emerald-300">कमाण्डर ड्यासबोर्डमा प्रत्यक्ष रियलटाइम स्थिति</td>
                <td className="py-3 px-4 text-right font-mono-nums text-emerald-400 font-semibold">तत्काल (Live)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-white">आपतकालीन दंगा कल-आउट</td>
                <td className="py-3 px-4 text-slate-400">ब्युगल फुक्ने वा कोठा-कोठामा सन्देशवाहक पठाउने</td>
                <td className="py-3 px-4 text-emerald-300">१-क्लिक साइरन मोबिलाइजेसन सिधै सबै जवानलाई</td>
                <td className="py-3 px-4 text-right font-mono-nums text-emerald-400 font-semibold">३ मिनेटमा रेडी</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-white">हतियार कोट जिम्मा</td>
                <td className="py-3 px-4 text-slate-400">ढड्डामा सही गराउने, कहिलेकाहीँ रेकर्ड नभेटिने</td>
                <td className="py-3 px-4 text-emerald-300">बारकोड / डिजिटल कोट पासबुक, स्पष्ट ट्र्याकिङ</td>
                <td className="py-3 px-4 text-right font-mono-nums text-emerald-400 font-semibold">शून्य जोखिम</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
