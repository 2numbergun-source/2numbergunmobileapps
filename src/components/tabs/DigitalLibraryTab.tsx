import React, { useState } from 'react';
import { BookOpen, Search, Eye, X } from 'lucide-react';

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  date: string;
  pages: string;
  summary: string;
  content: string;
}

export const DigitalLibraryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<LibraryDoc | null>(null);

  const documents: LibraryDoc[] = [
    {
      id: 'doc-01',
      title: 'दंगा नियन्त्रण तथा भीड व्यवस्थापन हातेपुस्तिका (Crowd Control SOP)',
      category: 'कार्यविधि (SOP)',
      date: '२०८०',
      pages: '२४ पृष्ठ',
      summary: 'दंगा नियन्त्रण टोली गठन, अश्रुग्याँस तथा वाटर क्यानन प्रयोगको वैधानिक मापदण्ड र न्यूनतम बल प्रयोगको नियम।',
      content: '१. दंगा नियन्त्रणको पहिलो चरण: सम्झाइबुझाई तथा लाउडस्पिकरबाट वैधानिक चेतावनी। २. दोस्रो चरण: पोलिकार्बोनेट सिल्ड तथा लाठीचार्ज। ३. तेस्रो चरण: अश्रुग्याँस तथा वाटर क्यानन। ४. कमाण्डरको आदेश बिना कुनै पनि हातहतियार वा अश्रुसेल प्रहार गर्न सख्त मनाही छ।',
    },
    {
      id: 'doc-02',
      title: 'नेपाल प्रहरी ऐन तथा नियमावली (संशोधनसहित)',
      category: 'कानून / ऐन',
      date: '२०१२ (संशोधित)',
      pages: '६८ पृष्ठ',
      summary: 'प्रहरी कर्मचारीको सेवा शर्त, अनुशासन, कर्तव्य, सरुवा बढुवा तथा आचारसंहिता।',
      content: 'प्रहरी कर्मचारीले राष्ट्र, संविधान र जनताको सुरक्षाको निम्ति अहोरात्र २४ घन्टा सेवामा समर्पित रहनुपर्नेछ। कुनै पनि राजनीतिक प्रभाव, पक्षपात वा गैरकानूनी कार्यमा संलग्न हुन पाइने छैन।',
    },
    {
      id: 'doc-03',
      title: 'सञ्चार सेट तथा VHF फ्रिक्वेन्सी सञ्चालन निर्देशिका',
      category: 'प्राविधिक SOP',
      date: '२०८२',
      pages: '१६ पृष्ठ',
      summary: 'च्यानल कोड, गोप्यता संकेत (Code Words) तथा आपतकालीन वायरलेस प्रोटोकल।',
      content: 'सञ्चार सेट च्यानल-२ (महाराजगञ्ज गण मुख्य फ्रिक्वेन्सी)। कोड-१० (तत्काल सहयोग), कोड-२० (स्थान पुगेको), कोड-९९ (अवस्था सामान्य)। कुनै पनि व्यक्तिगत कुराकानी गर्न प्रतिबन्ध छ।',
    },
    {
      id: 'doc-04',
      title: 'विपद् उद्धार तथा प्राथमिक उपचार गाइड (First Aid Manual)',
      category: 'उद्धार तथा स्वास्थ्य',
      date: '२०८१',
      pages: '३२ पृष्ठ',
      summary: 'भूकम्प, बाढी, आगलागी तथा घाइते जवानलाई दिइने आकस्मिक प्राथमिक उपचार विधि।',
      content: 'CPR दिने विधि, रगत बग्ने घाउमा टर्निकेट बाँध्ने तरिका, फ्र्याक्चर भएको अवस्थामा स्प्लिन्ट लगाउने र तत्काल टिचिङ अस्पताल रिफर गर्ने कार्यविधि।',
    },
  ];

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              डिजिटल ई-लाइब्रेरी तथा निर्देशिकाहरू (Digital Library & SOPs)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            प्रहरी ऐन, भीड नियन्त्रण निर्देशिका, सञ्चार कोड तथा आकस्मिक प्रोटोकलहरूको आधिकारिक संग्रह
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="निर्देशिका वा ऐन खोजी गर्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                  {doc.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{doc.pages}</span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{doc.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{doc.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">स्वीकृत: {doc.date}</span>
              <button
                onClick={() => setSelectedDoc(doc)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>पूरा पढ्नुहोस्</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white line-clamp-1">{selectedDoc.title}</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
              {selectedDoc.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
