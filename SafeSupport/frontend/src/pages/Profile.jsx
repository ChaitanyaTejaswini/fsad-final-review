import { useEffect, useState } from 'react';
import { User, Mail, Phone, Save, Shield, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function Profile() {
  const { user, updateCurrentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    role: '',
  });

  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toUpperCase() : '';
  const isAdmin = normalizedRole === 'ADMIN';
  const baseInputClass = 'w-full h-12 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

  const toFormState = (userData) => ({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    gender: userData?.gender || '',
    role: userData?.role || '',
  });

  useEffect(() => {
    if (!user) return;
    if (!isEditing) {
      setForm(toFormState(user));
    }
  }, [user, isEditing]);

  useEffect(() => {
    setIsEditing(false);
  }, [user?.id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      return;
    }

    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        gender: form.gender,
      };

      if (isAdmin) {
        payload.email = form.email.trim().toLowerCase();
        payload.phone = form.phone.trim();
      }

      const res = await api.put('/users/profile', payload);
      updateCurrentUser(res.data);
      setForm(toFormState(res.data));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm(toFormState(user));
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">Manage your account details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!isEditing}
              className={`${baseInputClass} px-4`}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing || !isAdmin}
                  className={`${baseInputClass} pl-10 pr-4`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={!isEditing || !isAdmin}
                  className={`${baseInputClass} pl-10 pr-4`}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                disabled={!isEditing}
                className={`${baseInputClass} px-4 bg-white`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <div className="w-full h-12 rounded-xl border border-gray-300 px-4 bg-gray-50 text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>{form.role || '-'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-white font-medium hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
                Edit Details
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
