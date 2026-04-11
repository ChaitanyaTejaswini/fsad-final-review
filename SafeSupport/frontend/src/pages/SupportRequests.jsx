import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { MessageSquare, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const SUPPORT_REQUESTS_LOAD_ERROR_TOAST_ID = 'support-requests-load-error';

export default function SupportRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: '', description: '', priority: 'MEDIUM' });
  const [selectedCounsellorByRequest, setSelectedCounsellorByRequest] = useState({});

  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toUpperCase() : '';
  const isAdminUser = normalizedRole === 'ADMIN';
  const isVictimUser = normalizedRole === 'VICTIM';
  const canUpdateStatus = normalizedRole === 'COUNSELLOR' || normalizedRole === 'ADMIN';

  useEffect(() => {
    if (!user) return;
    loadPageData();
  }, [user, isAdminUser]);

  const loadPageData = async () => {
    setLoading(true);
    let hasError = false;
    let requestData = [];
    let counsellorData = [];

    try {
      const reqRes = await api.get('/support-requests');
      requestData = reqRes.data || [];
      setRequests(requestData);
    } catch {
      hasError = true;
      requestData = [];
      setRequests([]);
    }

    if (isAdminUser) {
      try {
        const counsellorRes = await api.get('/users/role/COUNSELLOR');
        counsellorData = counsellorRes.data || [];
        setCounsellors(counsellorData);
      } catch {
        hasError = true;
        counsellorData = [];
        setCounsellors([]);
      }
    } else {
      counsellorData = [];
      setCounsellors([]);
    }

    setSelectedCounsellorByRequest((prev) => {
      const next = { ...prev };

      requestData.forEach((req) => {
        if (next[req.id]) {
          return;
        }

        if (req.assignedCounsellorId != null) {
          next[req.id] = String(req.assignedCounsellorId);
          return;
        }

        if (!req.assignedCounsellorName) {
          return;
        }

        const matchedCounsellor = counsellorData.find((c) =>
          typeof c.name === 'string' &&
          c.name.trim().toLowerCase() === req.assignedCounsellorName.trim().toLowerCase(),
        );

        if (matchedCounsellor?.id != null) {
          next[req.id] = String(matchedCounsellor.id);
        }
      });

      return next;
    });

    if (hasError) {
      toast.error('Failed to load support request data', { id: SUPPORT_REQUESTS_LOAD_ERROR_TOAST_ID });
    } else {
      toast.dismiss(SUPPORT_REQUESTS_LOAD_ERROR_TOAST_ID);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support-requests', form);
      toast.success('Support request created!');
      setShowForm(false);
      setForm({ type: '', description: '', priority: 'MEDIUM' });
      await loadPageData();
    } catch { toast.error('Failed to create request'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/support-requests/${id}/status`, { status });
      toast.success('Status updated');
      await loadPageData();
    } catch { toast.error('Failed to update status'); }
  };

  const handleAssignCounsellor = async (requestId) => {
    const selectedCounsellorId = selectedCounsellorByRequest[requestId];
    if (!selectedCounsellorId) {
      toast.error('Select counsellor first');
      return;
    }

    try {
      await api.put(`/support-requests/${requestId}/assign`, { counsellorId: Number(selectedCounsellorId) });
      toast.success('Counsellor assigned');
      await loadPageData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign counsellor';
      toast.error(msg);
    }
  };

  const getStatusColor = (s) => {
    const c = { PENDING: 'bg-yellow-100 text-yellow-700', ASSIGNED: 'bg-blue-100 text-blue-700', IN_PROGRESS: 'bg-indigo-100 text-indigo-700', COMPLETED: 'bg-green-100 text-green-700', CLOSED: 'bg-gray-100 text-gray-700' };
    return c[s] || 'bg-gray-100 text-gray-700';
  };

  const formatStatusLabel = (status) => (status || '').replace(/_/g, ' ');

  const getCounsellorName = (counsellorId) => {
    if (counsellorId == null) return null;
    const counsellor = counsellors.find((c) => Number(c.id) === Number(counsellorId));
    return counsellor?.name || `Counsellor #${counsellorId}`;
  };

  const getAssignedCounsellorLabel = (request) => request.assignedCounsellorName || getCounsellorName(request.assignedCounsellorId);
  const isAssignedToCounsellor = (request) => Boolean(request.assignedCounsellorName) || request.assignedCounsellorId != null;

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl"><MessageSquare className="h-8 w-8 text-blue-600" /></div>
          <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Support Requests</h1><p className="text-gray-500">Manage support and help requests</p></div>
        </div>
        {isVictimUser && (
          <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {showForm ? 'Cancel' : 'New Request'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Create Support Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select type</option>
                  <option value="EMOTIONAL_SUPPORT">Emotional Support</option>
                  <option value="LEGAL_HELP">Legal Help</option>
                  <option value="SHELTER">Shelter/Housing</option>
                  <option value="MEDICAL">Medical Assistance</option>
                  <option value="FINANCIAL">Financial Support</option>
                  <option value="SAFETY_PLANNING">Safety Planning</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe your situation and the help you need..."></textarea>
            </div>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">Submit Request</button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No support requests yet.</p></div>
        ) : requests.map((req) => (
          <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{req.type?.replace(/_/g, ' ')}</h3>
                {req.victimName && <p className="text-sm text-gray-500">By: {req.victimName}</p>}
                {isAssignedToCounsellor(req) && (
                  <p className="text-sm text-gray-500">Assigned: {getAssignedCounsellorLabel(req)}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${req.priority === 'URGENT' ? 'bg-red-100 text-red-700' : req.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>{req.priority}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}>{formatStatusLabel(req.status)}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{req.description}</p>

            {isAdminUser && req.status !== 'COMPLETED' && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <select
                  value={selectedCounsellorByRequest[req.id] || ''}
                  onChange={(e) => setSelectedCounsellorByRequest({
                    ...selectedCounsellorByRequest,
                    [req.id]: e.target.value,
                  })}
                  className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Select counsellor</option>
                  {counsellors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignCounsellor(req.id)}
                  className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  {isAssignedToCounsellor(req) ? 'Reassign Counsellor' : 'Assign Counsellor'}
                </button>
              </div>
            )}

            {canUpdateStatus && req.status !== 'COMPLETED' && (
              <div className="flex flex-wrap gap-2">
                {(req.status === 'PENDING' || req.status === 'ASSIGNED') && (
                  <button onClick={() => handleStatusUpdate(req.id, 'IN_PROGRESS')} className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">Mark In Progress</button>
                )}
                {req.status === 'IN_PROGRESS' && (
                  <button onClick={() => handleStatusUpdate(req.id, 'COMPLETED')} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Mark as Complete</button>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-3">{req.createdAt ? new Date(req.createdAt).toLocaleString() : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
