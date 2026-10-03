import React, { useState } from 'react';
import { 
  BellRing, 
  Plus, 
  Trash2, 
  Pin, 
  X, 
  Search, 
  Calendar, 
  AlertCircle, 
  Lock, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { NoticeItem } from '../../types/police';

interface NoticeBoardTabProps {
  notices: NoticeItem[];
  onAddNotice: (notice: NoticeItem) => void;
  onDeleteNotice: (noticeId: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const NoticeBoardTab: React.FC<NoticeBoardTabProps> = ({
  notices,
  onAddNotice,
  onDeleteNotice,
  isAdmin,
  onRequireAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [readingNotice, setReadingNotice] = useState<NoticeItem | null>(null);

  // New notice form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeItem['category']>('दैनिक रोलकल तथा आदेश');
  const [priority, setPriority] = useState<NoticeItem['priority']>('अति जरुरी');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(true);

  const categories = [
    'all',
    'दैनिक रोलकल तथा आदेश',
    'प्रशासनिक सूचना',
    'सरुवा तथा बढुवा',
    'विपद तथा मौसम अलर्ट',
    'तालिम तथा कल्याण',
  ];

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice: NoticeItem = {
      id: `notice-${Date.now()}`,
      title: title.trim(),
      date: new Date().toLocaleDateString('ne-NP'),
      category,
      priority,
      content: content.trim(),
      postedBy: 'गणपति कार्यालय / प्रशासन',
      isPinned,
    };

    onAddNotice(newNotice);
    setIsAddModalOpen(false);
    setTitle('');
    setContent('');
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              कार्यालय डिजिटल सूचना पाटी (Battalion Notice Board)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            दैनिक आदेश (Daily Orders), रोलकल निर्देशन, प्रशासनिक सूचना तथा मौसम एवं विपद् सम्बन्धी आधिकारिक सूचनाहरू। (व्यवस्थापन: Admin मात्र)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नयाँ सूचना टाँस्नुहोस् (Admin)</span>
            </button>
          ) : (
            <button
              onClick={onRequireAdmin}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>सूचना व्यवस्थापन (Admin लगइन)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="सूचना खोजी गर्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-yellow-600 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'सबै' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-2xl p-5 border transition shadow-lg space-y-3 ${
              notice.isPinned
                ? 'bg-gradient-to-r from-yellow-950/30 via-slate-900 to-slate-900 border-yellow-500/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {notice.isPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-400 bg-yellow-950/80 px-2 py-0.5 rounded border border-yellow-500/40">
                    <Pin className="w-3 h-3 fill-yellow-400" />
                    <span>टाँसिएको (Pinned)</span>
                  </span>
                )}

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  notice.priority === 'अति जरुरी'
                    ? 'bg-red-600 text-white'
                    : notice.priority === 'नयाँ'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {notice.priority}
                </span>

                <span className="text-xs text-slate-400">
                  {notice.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  {notice.date}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`के तपाईं '${notice.title}' सूचना हटाउन चाहनुहुन्छ?`)) {
                        onDeleteNotice(notice.id);
                      }
                    }}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 transition"
                    title="हटाउनुहोस्"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3 
                onClick={() => setReadingNotice(notice)}
                className="text-base font-bold text-white hover:text-yellow-400 cursor-pointer transition leading-snug"
              >
                {notice.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                {notice.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
              <span>जारीकर्ता: <strong className="text-slate-200">{notice.postedBy}</strong></span>
              <button
                onClick={() => setReadingNotice(notice)}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                पूरा सूचना पढ्नुहोस् &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal (Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-bold text-white">डिजिटल सूचना पाटीमा टाँस्नुहोस् (Admin)</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">सूचना शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: डिजिटल हाजिरी अनिवार्य सम्बन्धी अत्यन्त जरुरी आदेश"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">वर्ग (Category) *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeItem['category'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="दैनिक रोलकल तथा आदेश">दैनिक रोलकल तथा आदेश</option>
                    <option value="प्रशासनिक सूचना">प्रशासनिक सूचना</option>
                    <option value="सरुवा तथा बढुवा">सरुवा तथा बढुवा</option>
                    <option value="विपद तथा मौसम अलर्ट">विपद तथा मौसम अलर्ट</option>
                    <option value="तालिम तथा कल्याण">तालिम तथा कल्याण</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">प्राथमिकता *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticeItem['priority'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="अति जरुरी">अति जरुरी</option>
                    <option value="नयाँ">नयाँ</option>
                    <option value="सामान्य">सामान्य</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">सूचनाको पूर्ण व्यहोरा (Content) *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="सूचना सम्बन्धी विस्तृत व्यहोरा..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinToggle"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="pinToggle" className="text-slate-300 cursor-pointer">
                  शीर्ष स्थानमा पिन गरेर राख्नुहोस् (Pin to top)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold transition shadow cursor-pointer"
                >
                  सूचना प्रकाशित गर्नुहोस्
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Reader Modal */}
      {readingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] text-yellow-400 font-bold uppercase">{readingNotice.category}</span>
                <h3 className="text-base font-bold text-white">{readingNotice.title}</h3>
              </div>
              <button
                onClick={() => setReadingNotice(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
              {readingNotice.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>मिति: {readingNotice.date}</span>
              <span>जारीकर्ता: {readingNotice.postedBy}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
