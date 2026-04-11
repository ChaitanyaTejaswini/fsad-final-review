import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Heart, Scale, Users, ArrowRight, Phone, AlertCircle, Star, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen home-page">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span><strong>In immediate danger?</strong> Call <strong>911</strong> or National DV Hotline: <strong>1-800-799-7233</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Gender-Responsive Support Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                You Are <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Not Alone</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Access confidential support, legal resources, and professional counseling to help navigate through domestic violence. Our platform ensures everyone gets the help they deserve.
              </p>
              <div className="flex flex-wrap gap-4">
                {!user ? (
                  <Link to="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40">
                    Get Help Now <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <Link to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg">
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
                <Link to="/resources"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                  View Resources
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <Heart className="h-10 w-10 text-pink-500 mb-3" />
                    <h3 className="font-bold text-gray-900">Counseling</h3>
                    <p className="text-sm text-gray-500 mt-1">24/7 Support</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <Scale className="h-10 w-10 text-blue-500 mb-3" />
                    <h3 className="font-bold text-gray-900">Legal Aid</h3>
                    <p className="text-sm text-gray-500 mt-1">Expert Advice</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <Shield className="h-10 w-10 text-green-500 mb-3" />
                    <h3 className="font-bold text-gray-900">Safety Plans</h3>
                    <p className="text-sm text-gray-500 mt-1">Personalized</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <Users className="h-10 w-10 text-purple-500 mb-3" />
                    <h3 className="font-bold text-gray-900">Community</h3>
                    <p className="text-sm text-gray-500 mt-1">Support Groups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-3xl sm:text-4xl font-bold mb-2">10M+</p>
              <p className="text-blue-100">People Affected Annually</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold mb-2">24/7</p>
              <p className="text-blue-100">Support Available</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold mb-2">100%</p>
              <p className="text-blue-100">Confidential</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold mb-2">Free</p>
              <p className="text-blue-100">All Services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How We Can Help</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive support services designed with gender-responsive approach to combat domestic violence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Counseling Support</h3>
              <p className="text-gray-600 mb-4">Connect with trained counselors who provide emotional support, guidance, and help develop safety plans.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Individual therapy sessions</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Progress tracking</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Crisis intervention</li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Assistance</h3>
              <p className="text-gray-600 mb-4">Access legal advisors who help understand your rights and navigate legal processes effectively.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Know your legal rights</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />File protection orders</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Case management</li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Resources</h3>
              <p className="text-gray-600 mb-4">Access shelters, support groups, health services, and other community resources in your area.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Emergency shelters</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Health services</li>
                <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-green-500" />Financial assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Need Immediate Help?</h2>
                <p className="text-blue-100 text-lg mb-6">Our support team is available 24/7 to assist you. Your safety is our priority.</p>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Phone className="h-8 w-8" />
                  <div>
                    <p className="text-sm text-blue-100">National DV Hotline</p>
                    <p className="text-2xl font-bold">1-800-799-7233</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-6 w-6 text-yellow-300" />
                    <h3 className="text-xl font-bold">Secure & Confidential</h3>
                  </div>
                  <p className="text-blue-100">Your privacy and safety are our top priorities. All data is encrypted and protected.</p>
                </div>
                {!user && (
                  <Link to="/signup"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
                    Create Secure Account <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">SafeSupport</span>
              </div>
              <p className="text-gray-400 text-sm">Gender-responsive support and resources for those facing domestic violence.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link to="/support-services" className="hover:text-white transition-colors">Support Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Help</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/emergency" className="hover:text-white transition-colors">Emergency</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency Contacts</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>National DV Hotline: 1-800-799-7233</li>
                <li>Emergency: 911</li>
                <li>Crisis Text Line: Text START to 88788</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 SafeSupport. All rights reserved. Gender-Responsive Mechanism to Combat Domestic Violence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
