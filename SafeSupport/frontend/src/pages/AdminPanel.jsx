import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Shield, Users, Trash2, Search, UserCog } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: 'VICTIM', gender: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/users'),
        api.get('/users/stats'),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (selectedUser) => {
    setEditingUser(selectedUser.id);
    setEditForm({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      phone: selectedUser.phone || '',
      role: selectedUser.role || 'VICTIM',
      gender: selectedUser.gender || '',
    });
  };

  const handleUpdateUser = async (userId) => {
    try {
      await api.put(`/users/${userId}`, editForm);
      toast.success('User details updated successfully');
      setEditingUser(null);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user details';
      toast.error(msg);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users
    .filter((u) => u.role !== 'ADMIN')
    .filter((u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-700',
      VICTIM: 'bg-blue-100 text-blue-700',
      COUNSELLOR: 'bg-green-100 text-green-700',
      LEGAL_ADVISOR: 'bg-purple-100 text-purple-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-100 p-3 rounded-xl">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500">Manage users, roles, and platform settings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Survivors</p>
          <p className="text-3xl font-bold text-blue-600">{stats.victims || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Counsellors</p>
          <p className="text-3xl font-bold text-green-600">{stats.counsellors || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Legal Advisors</p>
          <p className="text-3xl font-bold text-purple-600">{stats.legalAdvisors || 0}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" /> User Management
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text" placeholder="Search users..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingUser === u.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editingUser === u.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1"
                      />
                    ) : u.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editingUser === u.id ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1"
                        placeholder="Phone"
                      />
                    ) : (u.phone || '-')}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === u.id ? (
                      <div className="flex items-center gap-2">
                        <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          className="text-sm border rounded-lg px-2 py-1">
                          <option value="VICTIM">Victim/Survivor</option>
                          <option value="COUNSELLOR">Counsellor</option>
                          <option value="LEGAL_ADVISOR">Legal Advisor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    ) : (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editingUser === u.id ? (
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (u.gender || '-')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingUser === u.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateUser(u.id)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleStartEdit(u)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User">
                          <UserCog className="h-4 w-4" />
                        </button>
                        {u.id !== user?.id && (
                          <button onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
