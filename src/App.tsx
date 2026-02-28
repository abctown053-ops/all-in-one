import React, { useState, useEffect, useMemo } from 'react';
import { 
  Moon,
  Sun,
  Home, 
  BookOpen, 
  Layers, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  ExternalLink, 
  X,
  Play,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Course, Feature } from './types';
import { ADMIN_CREDENTIALS, INITIAL_COURSES, INITIAL_FEATURES } from './constants';

// --- Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'features' | 'admin'>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleNavClick = (tab: 'home' | 'courses' | 'features' | 'admin') => {
    setActiveTab(tab);
    setSelectedCourse(null);
    setSelectedFeature(null);
    setGeneratedLink(null);
    setIsGeneratingLink(false);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const handleSaveCourse = (course: Course) => {
    if (courses.find(c => c.id === course.id)) {
      setCourses(courses.map(c => c.id === course.id ? course : c));
    } else {
      setCourses([...courses, course]);
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSaveFeature = (feature: Feature) => {
    if (features.find(f => f.id === feature.id)) {
      setFeatures(features.map(f => f.id === feature.id ? feature : f));
    } else {
      setFeatures([...features, feature]);
    }
    setIsFeatureModalOpen(false);
    setEditingFeature(null);
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      setFeatures(features.filter(f => f.id !== id));
    }
  };

  // --- Views ---

  const DetailView = ({ 
    title, 
    description, 
    image, 
    link, 
    onClose,
    badges = []
  }: { 
    title: string, 
    description: string, 
    image: string, 
    link: string, 
    onClose: () => void,
    badges?: string[]
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className={`fixed inset-0 z-40 overflow-y-auto pb-24 max-w-[360px] mx-auto shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="relative aspect-video">
        <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full active:scale-90 transition-transform"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {badges.map((badge, idx) => (
            <span key={idx} className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${darkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
              {badge}
            </span>
          ))}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
        
        <div className={`p-4 rounded-2xl border mb-6 transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-sm font-bold uppercase mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Description</h3>
          <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{description}</p>
        </div>

        {!generatedLink ? (
          <button 
            onClick={() => setGeneratedLink(link)}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Generate Link Now
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
              <p className="text-emerald-700 font-mono text-sm truncate mr-4">{generatedLink}</p>
              <button 
                onClick={() => handleCopyLink(generatedLink)}
                className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm active:scale-90 transition-transform"
              >
                <Layers size={18} />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 font-medium">Link generated successfully! You can now copy it.</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const HomeView = () => {
    const categories: (Category | 'All')[] = ['YouTube', 'Facebook', 'Instagram', 'TikTok', 'All'];
    
    const filteredCourses = useMemo(() => {
      if (selectedCategory === 'All') return courses.filter(c => c.status === 'Published');
      return courses.filter(c => c.category === selectedCategory && c.status === 'Published');
    }, [selectedCategory, courses]);

    return (
      <div className="p-4 animate-fade-in">
        <header className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Discover</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Upgrade your skills today</p>
        </header>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-md' 
                : darkMode 
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-4 mt-2">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} darkMode={darkMode} />
          ))}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="mx-auto mb-2 opacity-20" size={48} />
              <p>No courses found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CoursesView = () => (
    <div className="p-4 animate-fade-in">
      <header className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>All Courses</h1>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Browse our full catalog</p>
      </header>
      
      <div className="grid grid-cols-1 gap-4">
        {courses.filter(c => c.status === 'Published').map(course => (
          <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );

  const FeaturesView = () => {
    const bundles = features.filter(f => f.type === 'Bundle' && f.isActive);
    const materials = features.filter(f => f.type === 'Material' && f.isActive);

    return (
      <div className="p-4 animate-fade-in">
        <header className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Features</h1>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Premium resources for creators</p>
        </header>

        <section className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            <Layers size={20} className="text-indigo-600" />
            Video Bundles
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {bundles.map(item => (
              <FeatureCard key={item.id} item={item} onClick={() => setSelectedFeature(item)} darkMode={darkMode} />
            ))}
          </div>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            <Layers size={20} className="text-indigo-600" />
            Editing Materials
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {materials.map(item => (
              <FeatureCard key={item.id} item={item} onClick={() => setSelectedFeature(item)} darkMode={darkMode} />
            ))}
          </div>
        </section>
      </div>
    );
  };

  const AdminView = () => {
    if (!isAdminLoggedIn) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-slate-700 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Lock size={32} />
              </div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Admin Login</h2>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Access management dashboard</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                <input 
                  type="email" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-indigo-400' : 'bg-white border-slate-200 focus:ring-indigo-500'}`}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-indigo-400' : 'bg-white border-slate-200 focus:ring-indigo-500'}`}
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="button"
                onClick={() => {
                  if (adminEmail === ADMIN_CREDENTIALS.email && adminPassword === ADMIN_CREDENTIALS.password) {
                    setIsAdminLoggedIn(true);
                  } else {
                    alert('Invalid credentials');
                  }
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 animate-fade-in pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Admin Panel</h1>
          <button onClick={() => setIsAdminLoggedIn(false)} className="text-sm text-red-500 font-medium">Logout</button>
        </div>

        <div className="space-y-8">
          {/* Course Management */}
          <section className={`p-4 rounded-2xl border shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Courses</h2>
              <button 
                onClick={() => {
                  setEditingCourse({
                    id: Math.random().toString(36).substr(2, 9),
                    name: '',
                    category: 'YouTube',
                    isPaid: false,
                    link: '',
                    image: 'https://picsum.photos/seed/course/800/450',
                    language: 'English',
                    description: '',
                    status: 'Published'
                  });
                  setIsCourseModalOpen(true);
                }}
                className="p-2 bg-indigo-600 text-white rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {courses.map(c => (
                <div key={c.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <img src={c.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className={`font-semibold text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                      <p className="text-xs text-slate-500">{c.category} • {c.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingCourse(c);
                        setIsCourseModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Feature Management */}
          <section className={`p-4 rounded-2xl border shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Features</h2>
              <button 
                onClick={() => {
                  setEditingFeature({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'Bundle',
                    title: '',
                    description: '',
                    image: 'https://picsum.photos/seed/feature/800/450',
                    link: '',
                    isActive: true
                  });
                  setIsFeatureModalOpen(true);
                }}
                className="p-2 bg-indigo-600 text-white rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {features.map(f => (
                <div key={f.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <img src={f.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className={`font-semibold text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{f.title}</p>
                      <p className="text-xs text-slate-500">{f.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingFeature(f);
                        setIsFeatureModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteFeature(f.id)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Course Edit Modal */}
        <AnimatePresence>
          {isCourseModalOpen && editingCourse && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`fixed inset-0 z-50 overflow-y-auto max-w-[360px] mx-auto transition-colors ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{courses.find(c => c.id === editingCourse.id) ? 'Edit Course' : 'Add New Course'}</h2>
                  <button onClick={() => setIsCourseModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={24} /></button>
                </div>
                
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Course Name</label>
                    <input 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      value={editingCourse.name}
                      onChange={e => setEditingCourse({...editingCourse, name: e.target.value})}
                      placeholder="Enter course name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select 
                        className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                        value={editingCourse.category}
                        onChange={e => setEditingCourse({...editingCourse, category: e.target.value as any})}
                      >
                        <option value="YouTube">YouTube</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Language</label>
                      <input 
                        className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                        value={editingCourse.language}
                        onChange={e => setEditingCourse({...editingCourse, language: e.target.value})}
                        placeholder="e.g. English"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      value={editingCourse.image}
                      onChange={e => setEditingCourse({...editingCourse, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Link</label>
                    <input 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      value={editingCourse.link}
                      onChange={e => setEditingCourse({...editingCourse, link: e.target.value})}
                      placeholder="Course destination link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      rows={4}
                      value={editingCourse.description}
                      onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                      placeholder="Describe the course..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="isPaid"
                        checked={editingCourse.isPaid}
                        onChange={e => setEditingCourse({...editingCourse, isPaid: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="isPaid" className="text-sm font-medium">Is Paid?</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select 
                        className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                        value={editingCourse.status}
                        onChange={e => setEditingCourse({...editingCourse, status: e.target.value as any})}
                      >
                        <option value="Published">Published</option>
                        <option value="Unlisted">Unlisted</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleSaveCourse(editingCourse)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-6 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
                  >
                    {courses.find(c => c.id === editingCourse.id) ? 'Update Course' : 'Add Course Now'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Edit Modal */}
        <AnimatePresence>
          {isFeatureModalOpen && editingFeature && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`fixed inset-0 z-50 overflow-y-auto max-w-[360px] mx-auto transition-colors ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{features.find(f => f.id === editingFeature.id) ? 'Edit Feature' : 'Add New Feature'}</h2>
                  <button onClick={() => setIsFeatureModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={24} /></button>
                </div>
                
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      value={editingFeature.title}
                      onChange={e => setEditingFeature({...editingFeature, title: e.target.value})}
                      placeholder="Enter feature title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select 
                        className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                        value={editingFeature.type}
                        onChange={e => setEditingFeature({...editingFeature, type: e.target.value as any})}
                      >
                        <option value="Bundle">Video Bundle</option>
                        <option value="Material">Editing Material</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input 
                        type="checkbox"
                        id="isActive"
                        checked={editingFeature.isActive}
                        onChange={e => setEditingFeature({...editingFeature, isActive: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium">Is Active?</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      value={editingFeature.image}
                      onChange={e => setEditingFeature({...editingFeature, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Link</label>
                    <input 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      value={editingFeature.link}
                      onChange={e => setEditingFeature({...editingFeature, link: e.target.value})}
                      placeholder="Feature destination link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className={`w-full p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                      rows={4}
                      value={editingFeature.description}
                      onChange={e => setEditingFeature({...editingFeature, description: e.target.value})}
                      placeholder="Describe the feature..."
                    />
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleSaveFeature(editingFeature)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-6 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
                  >
                    {features.find(f => f.id === editingFeature.id) ? 'Update Feature' : 'Add Feature Now'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`max-w-[360px] mx-auto min-h-screen relative shadow-2xl transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      {/* Global Header */}
      <header className={`sticky top-0 z-30 px-4 py-3 flex justify-between items-center backdrop-blur-md border-b transition-colors h-14 ${darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white/80 border-slate-100 text-slate-900'}`}>
        <h1 className="text-xl font-black tracking-tighter uppercase">All In One</h1>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="pb-20 overflow-y-auto h-[calc(100vh-112px)]">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'courses' && <CoursesView />}
        {activeTab === 'features' && <FeaturesView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Detail View Overlays */}
      <AnimatePresence>
        {selectedCourse && (
          <DetailView 
            title={selectedCourse.name}
            description={selectedCourse.description}
            image={selectedCourse.image}
            link={selectedCourse.link}
            badges={[selectedCourse.category, selectedCourse.language]}
            onClose={() => {
              setSelectedCourse(null);
              setGeneratedLink(null);
              setIsGeneratingLink(false);
            }}
          />
        )}
        {selectedFeature && (
          <DetailView 
            title={selectedFeature.title}
            description={selectedFeature.description}
            image={selectedFeature.image}
            link={selectedFeature.link}
            badges={[selectedFeature.type]}
            onClose={() => {
              setSelectedFeature(null);
              setGeneratedLink(null);
              setIsGeneratingLink(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto border-t h-14 px-6 flex items-center justify-between z-40 transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => handleNavClick('home')} 
          icon={<Home size={24} />} 
          label="Home" 
          darkMode={darkMode}
        />
        <NavButton 
          active={activeTab === 'courses'} 
          onClick={() => handleNavClick('courses')} 
          icon={<BookOpen size={24} />} 
          label="Courses" 
          darkMode={darkMode}
        />
        <NavButton 
          active={activeTab === 'features'} 
          onClick={() => handleNavClick('features')} 
          icon={<Layers size={24} />} 
          label="Features" 
          darkMode={darkMode}
        />
        <NavButton 
          active={activeTab === 'admin'} 
          onClick={() => handleNavClick('admin')} 
          icon={<Settings size={24} />} 
          label="Admin" 
          darkMode={darkMode}
        />
      </nav>
    </div>
  );
}

// --- Sub-components ---

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  darkMode?: boolean;
}

function NavButton({ active, onClick, icon, label, darkMode }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}
    >
      <div className={`p-1 rounded-xl transition-colors ${active ? (darkMode ? 'bg-indigo-900/40' : 'bg-indigo-50') : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  darkMode?: boolean;
  key?: React.Key;
}

function CourseCard({ course, onClick, darkMode }: CourseCardProps) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-2xl overflow-hidden border shadow-sm active:shadow-md transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
    >
      <div className="relative aspect-video">
        <img src={course.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${course.isPaid ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {course.isPaid ? 'Paid' : 'Free'}
          </span>
          <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-black/40 backdrop-blur-md text-white flex items-center gap-1">
            <Globe size={10} /> {course.language}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{course.name}</h3>
          <ExternalLink size={16} className="text-slate-300" />
        </div>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-xs line-clamp-2`}>{course.description}</p>
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  item: Feature;
  onClick: () => void;
  darkMode?: boolean;
  key?: React.Key;
}

function FeatureCard({ item, onClick, darkMode }: FeatureCardProps) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-2xl border shadow-sm flex gap-4 items-center transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
    >
      <img src={item.image} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" referrerPolicy="no-referrer" />
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-sm mb-1 line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-xs line-clamp-2 mb-2`}>{item.description}</p>
        <button className="text-indigo-600 text-xs font-bold flex items-center gap-1">
          Open Now <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
