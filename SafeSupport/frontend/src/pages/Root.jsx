import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
