import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, FileText, Plus, Trash2, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Evidence() {
  const { user } = useAuth();
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('evidence_' + user?.id);
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', type: '', description: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('evidence_' + user?.id, JSON.stringify(updated));
    setShowForm(false);
    setForm({ date: '', type: '', description: '', notes: '' });
    toast.success('Evidence entry saved locally');
  };

  const handleDelete = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('evidence_' + user?.id, JSON.stringify(updated));
    toast.success('Entry deleted');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-3 rounded-xl"><FileText className="h-8 w-8 text-amber-600" /></div>
          <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Evidence Journal</h1><p className="text-gray-500">Document incidents securely on your device</p></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:opacity-90">
          {showForm ? 'Cancel' : <><Plus className="h-5 w-5" /> New Entry</>}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800 flex items-center gap-2"><Shield className="h-4 w-4" /> <strong>Privacy:</strong> All evidence is stored only on this device and never uploaded to any server.</p>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none bg-white">
                  <option value="">Select type</option>
                  <option value="PHYSICAL">Physical Abuse</option>
                  <option value="EMOTIONAL">Emotional Abuse</option>
                  <option value="VERBAL">Verbal Abuse</option>
                  <option value="FINANCIAL">Financial Abuse</option>
                  <option value="THREAT">Threats</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What happened? *</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none resize-none" placeholder="Describe the incident in detail..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none resize-none" placeholder="Witnesses, injuries, etc."></textarea>
            </div>
            <button type="submit" className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">Save Entry</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No evidence entries yet. Start documenting to build your case.</p></div>
        ) : entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{entry.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{entry.type}</span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{entry.description}</p>
                {entry.notes && <p className="text-gray-500 text-xs italic">Notes: {entry.notes}</p>}
              </div>
              <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
