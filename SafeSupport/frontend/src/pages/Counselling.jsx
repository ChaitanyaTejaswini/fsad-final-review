import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Heart, Plus, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const toLocalDateTimeInputValue = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function Counselling() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [victims, setVictims] = useState([]);
  const [form, setForm] = useState({ victimId: '', sessionDate: '', notes: '' });
  const minSessionDate = toLocalDateTimeInputValue(new Date());

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/counselling');
      setSessions(res.data);
      if (user?.role === 'COUNSELLOR' || user?.role === 'ADMIN') {
        const vRes = await api.get('/users/role/VICTIM').catch(() => ({ data: [] }));
        setVictims(vRes.data);
      }
    } catch { toast.error('Failed to load sessions'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(form.sessionDate);
    const currentMinute = new Date();
    currentMinute.setSeconds(0, 0);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < currentMinute) {
      toast.error('Session date/time must be current or future');
      return;
    }

    try {
      await api.post('/counselling', { ...form, victimId: Number(form.victimId) });
      toast.success('Session scheduled');
      setShowForm(false);
      setForm({ victimId: '', sessionDate: '', notes: '' });
      loadData();
    } catch { toast.error('Failed to create session'); }
  };

  const handleUpdate = async (id, updates) => {
    try {
      await api.put(`/counselling/${id}`, updates);
      toast.success('Session updated');
      loadData();
    } catch { toast.error('Failed to update session'); }
  };

  const getStatusColor = (s) => {
    const c = { SCHEDULED: 'bg-purple-100 text-purple-700', IN_PROGRESS: 'bg-blue-100 text-blue-700', COMPLETED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700' };
    return c[s] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-3 rounded-xl"><Heart className="h-8 w-8 text-pink-600" /></div>
          <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Counselling Sessions</h1><p className="text-gray-500">Emotional support and progress tracking</p></div>
        </div>
        {(user?.role === 'COUNSELLOR' || user?.role === 'ADMIN') && (
          <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90">
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {showForm ? 'Cancel' : 'Schedule Session'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Schedule New Session</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <select value={form.victimId} onChange={(e) => setForm({...form, victimId: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                  <option value="">Select client</option>
                  {victims.map(v => <option key={v.id} value={v.id}>{v.name} ({v.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
                <input type="datetime-local" min={minSessionDate} value={form.sessionDate} onChange={(e) => setForm({...form, sessionDate: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 resize-none" placeholder="Session notes..."></textarea>
            </div>
            <button type="submit" className="px-6 py-2.5 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700">Schedule Session</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No counselling sessions yet.</p></div>
        ) : sessions.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar className="h-4 w-4 text-pink-600" /> Session #{s.id}</h3>
                {s.victimName && <p className="text-sm text-gray-500">Client: {s.victimName}</p>}
                {s.counsellorName && <p className="text-sm text-gray-500">Counsellor: {s.counsellorName}</p>}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(s.status)}`}>{s.status}</span>
            </div>
            {s.sessionDate && <p className="text-sm text-gray-600 mb-2"><strong>Date:</strong> {new Date(s.sessionDate).toLocaleString()}</p>}
            {s.notes && <p className="text-sm text-gray-600 mb-2"><strong>Notes:</strong> {s.notes}</p>}
            {s.progressScore != null && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1"><strong>Progress:</strong> {s.progressScore}/10</p>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{width: `${s.progressScore * 10}%`}}></div></div>
              </div>
            )}
            {(user?.role === 'COUNSELLOR' || user?.role === 'ADMIN') && s.status !== 'COMPLETED' && (
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => handleUpdate(s.id, { status: 'COMPLETED', progressScore: 8 })} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Complete</button>
                <button onClick={() => handleUpdate(s.id, { status: 'IN_PROGRESS' })} className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">In Progress</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
