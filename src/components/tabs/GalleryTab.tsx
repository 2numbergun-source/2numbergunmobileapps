import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Eye, 
  X, 
  Upload, 
  Camera, 
  Lock, 
  Calendar, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { GalleryPhoto } from '../../types/police';

interface GalleryTabProps {
  photos: GalleryPhoto[];
  onAddPhoto: (photo: GalleryPhoto) => void;
  onDeletePhoto: (photoId: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  isAdmin,
  onRequireAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectingPhoto, setInspectingPhoto] = useState<GalleryPhoto | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New photo form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryPhoto['category']>('परेड तथा कवाज');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'all',
    'परेड तथा कवाज',
    'दंगा नियन्त्रण अभ्यास',
    'विपद् उद्धार',
    'गण परिसर तथा भौतिक संरचना',
    'विशिष्ट सुरक्षा',
    'खेलकुद तथा कल्याण',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setImageUrl(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('कृपया फोटो शीर्षक र फोटो अनिवार्य राख्नुहोस्।');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      title: title.trim(),
      category,
      date: new Date().toLocaleDateString('ne-NP'),
      imageUrl,
      caption: caption.trim() || title.trim(),
      uploadedBy: 'Admin / कमाण्ड डेस्क',
    };

    onAddPhoto(newPhoto);
    setIsAddModalOpen(false);
    setTitle('');
    setImageUrl('');
    setCaption('');
  };

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              कार्यालय फोटो ग्यालरी (Battalion Photo Gallery)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            सशस्त्र प्रहरी गण नं. २ का औपचारिक गतिविधि, परेड, दंगा नियन्त्रण अभ्यास, विपद् उद्धार तथा परिसरका आधिकारिक तस्बिरहरू। (व्यवस्थापन: Admin मात्र)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ नयाँ फोटो थप्नुहोस् (Admin)</span>
            </button>
          ) : (
            <button
              onClick={onRequireAdmin}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>फोटो व्यवस्थापन (Admin लगइन)</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat === 'all' ? `सबै फोटोहरू (${photos.length})` : cat}
          </button>
        ))}
      </div>

      {/* Photos Masonry/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition flex flex-col justify-between"
          >
            <div 
              onClick={() => setInspectingPhoto(photo)}
              className="relative h-56 bg-slate-950 overflow-hidden cursor-pointer"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
              
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm">
                  {photo.category}
                </span>
              </div>

              <div className="absolute bottom-2 left-3 right-3 text-white">
                <h4 className="text-sm font-bold line-clamp-1 group-hover:text-emerald-300 transition">
                  {photo.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {photo.date}
                  </span>
                  <span className="text-cyan-300">हेर्नुहोस् &rarr;</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 line-clamp-1 flex-1 pr-2">
                {photo.caption}
              </span>

              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm(`के तपाईं '${photo.title}' फोटो ग्यालरीबाट हटाउन चाहनुहुन्छ?`)) {
                      onDeletePhoto(photo.id);
                    }
                  }}
                  className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 transition shrink-0"
                  title="हटाउनुहोस्"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal (Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">ग्यालरीमा नयाँ फोटो थप्नुहोस् (Admin)</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {/* Image Preview & Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-300">फोटो छान्नुहोस् वा अपलोड गर्नुहोस् *</label>
                
                {imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500 max-h-48 bg-black flex justify-center">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain max-h-48" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 p-6 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-emerald-400" />
                      <span>कम्प्युटर वा फोनबाट फोटो अपलोड गर्नुहोस्</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1">वा फोटोको वेब लिंक (Image URL) सिधै राख्नुहोस्:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">फोटो शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: वार्षिक कवाज तथा हतियार निरीक्षण"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">वर्ग (Category) *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryPhoto['category'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="परेड तथा कवाज">परेड तथा कवाज</option>
                  <option value="दंगा नियन्त्रण अभ्यास">दंगा नियन्त्रण अभ्यास</option>
                  <option value="विपद् उद्धार">विपद् उद्धार</option>
                  <option value="गण परिसर तथा भौतिक संरचना">गण परिसर तथा भौतिक संरचना</option>
                  <option value="विशिष्ट सुरक्षा">विशिष्ट सुरक्षा</option>
                  <option value="खेलकुद तथा कल्याण">खेलकुद तथा कल्याण</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">तस्बिर विवरण / क्याप्सन (Caption)</label>
                <textarea
                  rows={2}
                  placeholder="तस्बिर सम्बन्धी संक्षिप्त विवरण..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow cursor-pointer"
                >
                  ग्यालरीमा सुरक्षित गर्नुहोस्
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {inspectingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{inspectingPhoto.category}</span>
                <h3 className="text-sm font-bold text-white">{inspectingPhoto.title}</h3>
              </div>
              <button
                onClick={() => setInspectingPhoto(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={inspectingPhoto.imageUrl}
                alt={inspectingPhoto.title}
                className="w-full max-h-[520px] object-contain rounded-lg"
              />
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-300">{inspectingPhoto.caption}</span>
              <span className="text-slate-400 font-mono shrink-0 ml-4">मिति: {inspectingPhoto.date}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
