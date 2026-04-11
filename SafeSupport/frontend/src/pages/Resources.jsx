import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { BookOpen, FileText, Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'LEGAL_RIGHTS', label: 'Legal Rights', color: 'blue' },
  { value: 'HEALTH', label: 'Health & Wellbeing', color: 'green' },
  { value: 'SAFETY', label: 'Safety Planning', color: 'red' },
  { value: 'SUPPORT_SERVICES', label: 'Support Services', color: 'purple' },
  { value: 'FINANCIAL', label: 'Financial Aid', color: 'orange' },
];

const CATEGORY_BADGE_CLASS = {
  LEGAL_RIGHTS: 'bg-blue-100 text-blue-700',
  HEALTH: 'bg-green-100 text-green-700',
  SAFETY: 'bg-red-100 text-red-700',
  SUPPORT_SERVICES: 'bg-purple-100 text-purple-700',
  FINANCIAL: 'bg-orange-100 text-orange-700',
};

const EMPTY_FORM = { title: '', description: '', category: '', content: '' };

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const canWrite = user?.role === 'ADMIN' || user?.role === 'LEGAL_ADVISOR';

  useEffect(() => { loadResources(); }, []);

  const loadResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data);
    } catch {
      toast.error('Failed to load resources');
    }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canWrite) {
      toast.error('Only Admin/Legal Advisor can manage resources');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      content: form.content.trim(),
    };

    if (!payload.title || !payload.description || !payload.category || !payload.content) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, payload);
        toast.success('Resource updated');
      } else {
        await api.post('/resources', payload);
        toast.success('Resource created');
      }

      resetForm();
      await loadResources();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save resource';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;

    try {
      await api.delete(`/resources/${id}`);
      toast.success('Resource deleted');
      await loadResources();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete resource';
      toast.error(message);
    }
  };

  const handleEditStart = (resource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || '',
      content: resource.content || '',
    });
    setShowForm(true);
  };

  const filtered = useMemo(
    () => (activeCategory === 'ALL' ? resources : resources.filter((r) => r.category === activeCategory)),
    [activeCategory, resources]
  );

  const toggleForm = () => {
    if (showForm) {
      resetForm();
      return;
    }
    setShowForm(true);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-xl"><BookOpen className="h-8 w-8 text-indigo-600" /></div>
          <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resources</h1><p className="text-gray-500">Information on legal rights, health, and support</p></div>
        </div>
        {canWrite && (
          <button onClick={toggleForm} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90">
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {showForm ? 'Cancel' : 'Add Resource'}
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setActiveCategory('ALL')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat.value} onClick={() => setActiveCategory(cat.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat.value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{cat.label}</button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Resource' : 'Add New Resource'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Resource title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Brief description" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={6} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Full resource content..."></textarea>
            </div>
            <div className="flex flex-wrap gap-2">
              <button disabled={saving} type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Update Resource' : 'Create Resource'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No resources found.</p></div>
        ) : filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_BADGE_CLASS[r.category] || 'bg-gray-100 text-gray-700'}`}>
                {CATEGORIES.find(c => c.value === r.category)?.label || r.category}
              </span>
              <div className="flex items-center gap-3">
                {canWrite && (
                  <button onClick={() => handleEditStart(r)} className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-800 transition-opacity flex items-center gap-1">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                )}
                {user?.role === 'ADMIN' && (
                  <button onClick={() => handleDelete(r.id)} className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 transition-opacity flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{r.description}</p>
            <p className="text-gray-500 text-sm line-clamp-4">{r.content}</p>
            {r.createdAt && (
              <p className="text-xs text-gray-400 mt-4">Updated: {new Date(r.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
