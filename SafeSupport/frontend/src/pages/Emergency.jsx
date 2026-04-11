import { Phone, AlertTriangle, Shield, MapPin, MessageCircle } from 'lucide-react';

export default function Emergency() {
  const contacts = [
    { name: 'Emergency Services', number: '911', desc: 'For life-threatening situations', color: 'red', icon: AlertTriangle },
    { name: 'National DV Hotline', number: '1-800-799-7233', desc: 'Confidential support 24/7', color: 'blue', icon: Phone },
    { name: 'Crisis Text Line', number: 'Text START to 88788', desc: 'Text-based crisis counseling', color: 'green', icon: MessageCircle },
    { name: 'RAINN Hotline', number: '1-800-656-4673', desc: 'Sexual assault support', color: 'purple', icon: Shield },
    { name: 'Childhelp Hotline', number: '1-800-422-4453', desc: 'Child abuse prevention', color: 'orange', icon: Phone },
    { name: 'Suicide Prevention', number: '988', desc: 'Mental health crisis', color: 'pink', icon: Phone },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-10 w-10" />
          <h1 className="text-3xl sm:text-4xl font-bold">Emergency Help</h1>
        </div>
        <p className="text-red-100 text-lg">If you are in immediate danger, please call emergency services right away. Your safety is the top priority.</p>
        <a href="tel:911" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 mt-4 px-6 py-3 bg-white text-red-600 rounded-xl font-bold text-lg hover:bg-red-50 transition-colors">
          <Phone className="h-5 w-5" /> Call 911 Now
        </a>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {contacts.map((c, i) => (
          <div key={i} className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow`}>
            <div className={`bg-${c.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <c.icon className={`h-6 w-6 text-${c.color}-600`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{c.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{c.number}</p>
            <p className="text-sm text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-600" /> Safety Tips
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Keep important documents (ID, passport, bank info) in a safe place outside the home</li>
          <li>• Memorize emergency numbers - don't rely on your phone</li>
          <li>• Identify safe places you can go to (friend, family, shelter)</li>
          <li>• Create a code word with trusted friends/family to signal you need help</li>
          <li>• If using a shared computer, use incognito mode and clear browsing history</li>
          <li>• Pack an emergency bag with essentials and keep it accessible</li>
        </ul>
      </div>
    </div>
  );
}
