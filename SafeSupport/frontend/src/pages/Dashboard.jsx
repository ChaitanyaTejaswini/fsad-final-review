import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import {
  Shield, Heart, Scale, FileText, AlertTriangle, Calendar,
  ArrowRight, Clock, MessageSquare
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [supportRequests, setSupportRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [legalCases, setLegalCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reqRes, sessRes, caseRes] = await Promise.all([
        api.get('/support-requests').catch(() => ({ data: [] })),
        api.get('/counselling').catch(() => ({ data: [] })),
        api.get('/legal-cases').catch(() => ({ data: [] })),
      ]);
      setSupportRequests(reqRes.data);
      setSessions(sessRes.data);
      setLegalCases(caseRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      ASSIGNED: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700',
      OPEN: 'bg-orange-100 text-orange-700',
      SCHEDULED: 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const quickActions = {
    VICTIM: [
      { to: '/support-requests', icon: MessageSquare, label: 'Request Support', desc: 'Create a new support request', color: 'blue' },
      { to: '/legal-help', icon: Scale, label: 'Legal Help', desc: 'Get legal assistance', color: 'purple' },
      { to: '/counselling', icon: Heart, label: 'Counselling', desc: 'View your sessions', color: 'pink' },
      { to: '/safety-plan', icon: Shield, label: 'Safety Plan', desc: 'Create safety plan', color: 'green' },
      { to: '/resources', icon: FileText, label: 'Resources', desc: 'Browse resources', color: 'indigo' },
      { to: '/emergency', icon: AlertTriangle, label: 'Emergency', desc: 'Emergency contacts', color: 'red' },
    ],
    COUNSELLOR: [
      { to: '/support-requests', icon: MessageSquare, label: 'Support Requests', desc: 'View assigned requests', color: 'blue' },
      { to: '/counselling', icon: Heart, label: 'Sessions', desc: 'Manage sessions', color: 'pink' },
      { to: '/resources', icon: FileText, label: 'Resources', desc: 'Browse resources', color: 'indigo' },
    ],
    LEGAL_ADVISOR: [
      { to: '/legal-help', icon: Scale, label: 'Legal Cases', desc: 'Manage cases', color: 'purple' },
      { to: '/resources', icon: FileText, label: 'Resources', desc: 'Update resources', color: 'indigo' },
      { to: '/support-requests', icon: MessageSquare, label: 'Support Requests', desc: 'View requests', color: 'blue' },
    ],
    ADMIN: [
      { to: '/admin', icon: Shield, label: 'Admin Panel', desc: 'Manage platform', color: 'red' },
      { to: '/support-requests', icon: MessageSquare, label: 'All Requests', desc: 'View all requests', color: 'blue' },
      { to: '/counselling', icon: Heart, label: 'All Sessions', desc: 'View all sessions', color: 'pink' },
      { to: '/legal-help', icon: Scale, label: 'All Cases', desc: 'View all cases', color: 'purple' },
      { to: '/resources', icon: FileText, label: 'Resources', desc: 'Manage resources', color: 'indigo' },
    ],
  };

  const actions = quickActions[user?.role] || quickActions.VICTIM;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Here's your overview
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-blue-100">
            <Clock className="h-5 w-5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl"><MessageSquare className="h-6 w-6 text-blue-600" /></div>
            <span className="text-3xl font-bold text-gray-900">{supportRequests.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Support Requests</h3>
          <p className="text-sm text-gray-500">{supportRequests.filter(r => r.status === 'PENDING').length} pending</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-100 p-3 rounded-xl"><Calendar className="h-6 w-6 text-pink-600" /></div>
            <span className="text-3xl font-bold text-gray-900">{sessions.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Counselling Sessions</h3>
          <p className="text-sm text-gray-500">{sessions.filter(s => s.status === 'SCHEDULED').length} upcoming</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl"><Scale className="h-6 w-6 text-purple-600" /></div>
            <span className="text-3xl font-bold text-gray-900">{legalCases.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Legal Cases</h3>
          <p className="text-sm text-gray-500">{legalCases.filter(c => c.status === 'OPEN').length} active</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          {actions.map((action, i) => (
            <Link key={i} to={action.to}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-all group text-center">
              <div className={`bg-${action.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-6 w-6 text-${action.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{action.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Support Requests */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Support Requests</h2>
            <Link to="/support-requests" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {supportRequests.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No support requests yet.</p>
          ) : (
            <div className="space-y-3">
              {supportRequests.slice(0, 5).map((req) => (
                <div key={req.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{req.type}</p>
                    <p className="text-xs text-gray-500">{req.description?.substring(0, 50)}...</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Legal Cases */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Legal Cases</h2>
            <Link to="/legal-help" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {legalCases.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No legal cases yet.</p>
          ) : (
            <div className="space-y-3">
              {legalCases.slice(0, 5).map((c) => (
                <div key={c.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{c.caseType}</p>
                    <p className="text-xs text-gray-500">{c.description?.substring(0, 50)}...</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
