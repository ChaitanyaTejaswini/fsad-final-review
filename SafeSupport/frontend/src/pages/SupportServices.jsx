import { Users, MapPin, Phone, Heart, Home, DollarSign, Baby, Stethoscope } from 'lucide-react';

export default function SupportServices() {
  const services = [
    { icon: Home, title: 'Emergency Shelters', desc: 'Safe temporary housing for survivors and their children. Confidential locations with 24/7 security.', details: ['24/7 admission', 'Pet-friendly options', 'Child-safe spaces', 'Meals provided'], color: 'red' },
    { icon: Heart, title: 'Counseling Services', desc: 'Individual and group therapy with trauma-informed counselors specializing in domestic violence.', details: ['Individual therapy', 'Group sessions', 'Child counseling', 'Telehealth available'], color: 'pink' },
    { icon: Stethoscope, title: 'Health Services', desc: 'Medical care for injuries, mental health screenings, and referrals to specialists.', details: ['Injury treatment', 'Mental health screening', 'STI testing', 'Prescription assistance'], color: 'green' },
    { icon: DollarSign, title: 'Financial Assistance', desc: 'Emergency funds, financial planning, job training, and economic empowerment programs.', details: ['Emergency funds', 'Job training', 'Financial literacy', 'Housing assistance'], color: 'orange' },
    { icon: Baby, title: 'Child Services', desc: 'Support for children affected by domestic violence including counseling and safe childcare.', details: ['Child therapy', 'Safe childcare', 'School advocacy', 'Parenting support'], color: 'blue' },
    { icon: Users, title: 'Support Groups', desc: 'Peer-led groups where survivors share experiences and build community in a safe space.', details: ['Weekly meetings', 'Online options', 'Language support', 'Anonymous options'], color: 'purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 p-3 rounded-xl"><Users className="h-8 w-8 text-green-600" /></div>
        <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Support Services</h1><p className="text-gray-500">Community resources and support available to you</p></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all hover:-translate-y-1 group">
            <div className={`bg-${s.color}-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <s.icon className={`h-7 w-7 text-${s.color}-600`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{s.desc}</p>
            <ul className="space-y-1.5">
              {s.details.map((d, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${s.color}-400`}></div> {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Need Help Finding Services?</h2>
        <p className="text-green-100 mb-6">Our team can help connect you with local resources in your area. All inquiries are confidential.</p>
        <div className="flex flex-wrap gap-4">
          <a href="tel:1-800-799-7233" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors">
            <Phone className="h-5 w-5" /> Call Hotline
          </a>
          <div className="flex items-center gap-2 text-green-100">
            <MapPin className="h-5 w-5" /> Services available nationwide
          </div>
        </div>
      </div>
    </div>
  );
}
