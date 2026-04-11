import { Shield, Heart, Target, Eye, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6">About SafeSupport</h1>
          <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto">
            A gender-responsive mechanism designed to combat domestic violence by providing comprehensive support, resources, and professional assistance to survivors.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide a safe, accessible, and gender-responsive digital platform that empowers domestic violence survivors with resources, professional support, and legal assistance. We aim to break the cycle of violence through education, intervention, and community support.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-8">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A world where every individual, regardless of gender, lives free from domestic violence. We envision communities where survivors are empowered, perpetrators are held accountable, and prevention is prioritized through education and systemic change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Address */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Health Risks We Address</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Physical Health', desc: 'Injuries, chronic pain, disabilities, and other physical consequences of domestic abuse.', color: 'red' },
              { title: 'Mental Health', desc: 'PTSD, depression, anxiety, and psychological trauma resulting from sustained abuse.', color: 'blue' },
              { title: 'Reproductive Health', desc: 'Forced pregnancies, STIs, and reproductive coercion faced by survivors.', color: 'pink' },
              { title: 'Substance Abuse', desc: 'Coping mechanisms including alcohol and drug dependency triggered by abuse.', color: 'orange' },
              { title: 'Social Isolation', desc: 'Withdrawal from social networks, financial dependence, and loss of autonomy.', color: 'purple' },
              { title: 'Child Impact', desc: 'Developmental issues, behavioral problems, and trauma in children exposed to domestic violence.', color: 'green' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-3 h-3 rounded-full bg-${item.color}-500 mb-4`}></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gender Responsive Approach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gender-Responsive Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform ensures equality in support services, recognizing that domestic violence affects people of all genders.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Equal Protection</h3>
              <p className="text-sm text-gray-600">Support for all gender identities and expressions</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Trauma-Informed</h3>
              <p className="text-sm text-gray-600">Care that understands the impact of gender-based violence</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Inclusive Services</h3>
              <p className="text-sm text-gray-600">Culturally sensitive and accessible to all communities</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Empowerment</h3>
              <p className="text-sm text-gray-600">Building resilience and self-sufficiency in survivors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Roles</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-red-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl font-bold">A</div>
              <h3 className="text-lg font-bold mb-2">Admin</h3>
              <p className="text-gray-300 text-sm">Manages content, user roles, platform settings, and ensures data security across the system.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl font-bold">V</div>
              <h3 className="text-lg font-bold mb-2">Victim / Survivor</h3>
              <p className="text-gray-300 text-sm">Access resources, seek help, create support requests, and connect with counselors and legal advisors.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl font-bold">C</div>
              <h3 className="text-lg font-bold mb-2">Counsellor</h3>
              <p className="text-gray-300 text-sm">Provide emotional support, conduct sessions, track progress, and guide survivors through recovery.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl font-bold">L</div>
              <h3 className="text-lg font-bold mb-2">Legal Advisor</h3>
              <p className="text-gray-300 text-sm">Offer legal advice, update resources, manage cases, and assist with protection orders and legal actions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
