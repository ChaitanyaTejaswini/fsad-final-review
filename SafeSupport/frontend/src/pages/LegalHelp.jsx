import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Scale, Plus, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function LegalHelp() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ caseType: '', description: '' });
  const [editingCase, setEditingCase] = useState(null);
  const [advice, setAdvice] = useState('');

  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toUpperCase() : '';
  const canCreateCase = normalizedRole === 'VICTIM';
  const canReviewCases = normalizedRole === 'ADMIN' || normalizedRole === 'LEGAL_ADVISOR';

  useEffect(() => { loadCases(); }, []);

  const loadCases = async () => {
    try { const res = await api.get('/legal-cases'); setCases(res.data); }
    catch { toast.error('Failed to load cases'); }
    finally { setLoading(false); }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      await api.post('/legal-cases', form);
      toast.success('Legal case created');
      setShowForm(false);
      setForm({ caseType: '', description: '' });
      loadCases();
    } catch { toast.error('Failed to create case'); }
  };

  const handleUpdateAdvice = async (id) => {
    try {
      await api.put(`/legal-cases/${id}`, { legalAdvice: advice, status: 'IN_PROGRESS' });
      toast.success('Legal advice updated');
      setEditingCase(null);
      setAdvice('');
      loadCases();
    } catch { toast.error('Failed to update'); }
  };

  const getStatusColor = (s) => {
    const c = { OPEN: 'bg-orange-100 text-orange-700', ASSIGNED: 'bg-blue-100 text-blue-700', IN_PROGRESS: 'bg-indigo-100 text-indigo-700', RESOLVED: 'bg-green-100 text-green-700', CLOSED: 'bg-gray-100 text-gray-700' };
    return c[s] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-xl"><Scale className="h-8 w-8 text-purple-600" /></div>
          <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Legal Help</h1><p className="text-gray-500">Legal assistance and case management</p></div>
        </div>
        {canCreateCase && (
          <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:opacity-90">
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {showForm ? 'Cancel' : 'New Case'}
          </button>
        )}
      </div>

      {canReviewCases && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Survivors submit legal cases. You can verify, track, and resolve them here.
        </div>
      )}

      {/* Legal Rights Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-purple-600" /> Know Your Legal Rights</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div><strong>Protection Orders:</strong> You can file for a restraining order against your abuser to legally prohibit contact.</div>
          <div><strong>Right to Safety:</strong> Everyone has the right to live free from violence. Law provides criminal penalties for domestic abuse.</div>
          <div><strong>Free Legal Aid:</strong> Many organizations provide free legal representation for domestic violence survivors.</div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Request Legal Assistance</h2>
          <form onSubmit={handleCreateCase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Type *</label>
              <select value={form.caseType} onChange={(e) => setForm({...form, caseType: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                <option value="">Select type</option>
                <option value="PROTECTION_ORDER">Protection Order</option>
                <option value="DIVORCE">Divorce Filing</option>
                <option value="CUSTODY">Child Custody</option>
                <option value="CRIMINAL_COMPLAINT">Criminal Complaint</option>
                <option value="PROPERTY">Property Rights</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Describe your legal situation..."></textarea>
            </div>
            <button type="submit" className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">Submit Case</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {cases.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No legal cases yet.</p></div>
        ) : cases.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{c.caseType?.replace(/_/g, ' ')}</h3>
                {c.victimName && <p className="text-sm text-gray-500">Client: {c.victimName}</p>}
                {c.advisorName && <p className="text-sm text-gray-500">Advisor: {c.advisorName}</p>}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(c.status)}`}>{c.status}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{c.description}</p>
            {c.legalAdvice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">Legal Advice:</p>
                <p className="text-sm text-blue-700">{c.legalAdvice}</p>
              </div>
            )}
            {canReviewCases && (
              editingCase === c.id ? (
                <div className="space-y-2">
                  <textarea value={advice} onChange={(e) => setAdvice(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none text-sm resize-none" placeholder="Enter legal advice..."></textarea>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleUpdateAdvice(c.id)} className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg">Save Advice</button>
                    <button onClick={() => setEditingCase(null)} className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setEditingCase(c.id); setAdvice(c.legalAdvice || ''); }} className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                  {c.legalAdvice ? 'Update Advice' : 'Add Legal Advice'}
                </button>
              )
            )}
            <p className="text-xs text-gray-400 mt-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
