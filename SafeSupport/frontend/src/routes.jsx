import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import SupportRequests from "./pages/SupportRequests";
import AdminPanel from "./pages/AdminPanel";
import Emergency from "./pages/Emergency";
import LegalHelp from "./pages/LegalHelp";
import Counselling from "./pages/Counselling";
import Evidence from "./pages/Evidence";
import SafetyPlan from "./pages/SafetyPlan";
import SupportServices from "./pages/SupportServices";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "resources", Component: Resources },
      { path: "support-services", Component: SupportServices },
      { path: "emergency", Component: Emergency },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "legal-help",
        element: <ProtectedRoute><LegalHelp /></ProtectedRoute>
      },
      {
        path: "counselling",
        element: <ProtectedRoute><Counselling /></ProtectedRoute>
      },
      {
        path: "evidence",
        element: <ProtectedRoute><Evidence /></ProtectedRoute>
      },
      {
        path: "safety-plan",
        element: <ProtectedRoute><SafetyPlan /></ProtectedRoute>
      },
      {
        path: "support-requests",
        element: <ProtectedRoute><SupportRequests /></ProtectedRoute>
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminPanel /></ProtectedRoute>
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
