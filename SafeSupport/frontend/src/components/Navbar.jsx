import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen, profileOpen]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
    setProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/resources', label: 'Resources' },
    { to: '/support-services', label: 'Support Services' },
  ];

  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toUpperCase() : '';
  const isAdminUser = normalizedRole === 'ADMIN';
  const isVictimUser = normalizedRole === 'VICTIM';

  const authLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        {
          to: '/support-requests',
          label: isVictimUser ? 'My Requests' : 'Support Requests',
        },
      ]
    : [];
  const profileTriggerClassName = isAdminUser
    ? 'flex items-center gap-5 px-4 py-2.5 rounded-full border border-black/40 bg-white shadow-sm hover:bg-gray-50 transition-colors'
    : 'flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors';

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SafeSupport
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                {isAdminUser && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setMobileMenuOpen(false);
                  }}
                  className={profileTriggerClassName}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-tight min-w-[112px]">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-sm" ref={mobileMenuRef}>
          <div className="px-4 py-3 pb-[max(14px,env(safe-area-inset-bottom))] space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.to) ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.to) ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600">
                  Profile
                </Link>
                {isAdminUser && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600">
                    Admin Panel
                  </Link>
                )}
              </>
            )}

            <hr className="my-2 border-gray-100" />

            {!user ? (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg">
                  Log In
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  Sign Up
                </Link>
              </div>
            ) : (
              <button onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 font-medium w-full">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
