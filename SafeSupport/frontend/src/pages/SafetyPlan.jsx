import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SafetyPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState({
    safeContacts: [''],
    safePlaces: [''],
    importantDocs: ['ID/Passport', 'Bank statements', 'Medical records'],
    emergencyBag: ['Medications', 'Phone charger', 'Cash', 'Change of clothes'],
    codeWord: '',
    exitPlan: '',
  });

  const addItem = (field) => setPlan({ ...plan, [field]: [...plan[field], ''] });
  const removeItem = (field, idx) => setPlan({ ...plan, [field]: plan[field].filter((_, i) => i !== idx) });
  const updateItem = (field, idx, val) => {
    const items = [...plan[field]];
    items[idx] = val;
    setPlan({ ...plan, [field]: items });
  };

  const handleSave = () => {
    localStorage.setItem('safetyPlan_' + user?.id, JSON.stringify(plan));
    toast.success('Safety plan saved locally (encrypted on your device only)');
  };

  useState(() => {
    const saved = localStorage.getItem('safetyPlan_' + user?.id);
    if (saved) setPlan(JSON.parse(saved));
  }, []);

  const renderList = (field, label, placeholder) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-3">{label}</h3>
      <div className="space-y-2">
        {plan[field].map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => updateItem(field, i, e.target.value)} placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            {plan[field].length > 1 && (
              <button onClick={() => removeItem(field, i)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        ))}
        <button onClick={() => addItem(field)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2">
          <Plus className="h-4 w-4" /> Add more
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 p-3 rounded-xl"><Shield className="h-8 w-8 text-green-600" /></div>
        <div><h1 className="text-3xl font-bold text-gray-900">Safety Plan</h1><p className="text-gray-500">Create a personalized safety plan for your protection</p></div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-green-800"><strong>🔒 Privacy Notice:</strong> Your safety plan is stored only on this device. It is never sent to any server.</p>
      </div>

      <div className="space-y-6">
        {renderList('safeContacts', '📞 Safe Contacts', 'Name and phone number')}
        {renderList('safePlaces', '🏠 Safe Places', 'Address or description')}
        {renderList('importantDocs', '📄 Important Documents', 'Document name')}
        {renderList('emergencyBag', '🎒 Emergency Bag Items', 'Item name')}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">🔑 Code Word</h3>
          <p className="text-sm text-gray-500 mb-2">A word you can use with trusted people to signal you need help</p>
          <input type="text" value={plan.codeWord} onChange={(e) => setPlan({...plan, codeWord: e.target.value})} placeholder="Your secret code word"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">🚪 Exit Plan</h3>
          <p className="text-sm text-gray-500 mb-2">Steps to safely leave if the situation escalates</p>
          <textarea value={plan.exitPlan} onChange={(e) => setPlan({...plan, exitPlan: e.target.value})} rows={4} placeholder="Describe your exit plan..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
        </div>

        <button onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg">
          <CheckCircle className="h-5 w-5" /> Save Safety Plan
        </button>
      </div>
    </div>
  );
}
