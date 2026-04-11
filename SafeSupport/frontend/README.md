# Domestic Violence Support App - Complete Setup Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend API

```bash
cd ../student-management-system
./mvnw spring-boot:run
```

### Step 2: Install & Run Frontend

```bash
npm install
npm run dev
```

### Step 3: Create Account

1. Open http://localhost:5173
2. You'll see the **Login page** (this is correct!)
3. Click **"Sign up"**
4. Fill the form and create your account
5. You'll be logged in automatically

## ✅ What's Working

### Authentication Flow
- ✅ Website opens to **Login page** (not home)
- ✅ Login redirects to **Dashboard**
- ✅ All pages are **protected** (need login)
- ✅ Logout returns to **Login**
- ✅ Direct URL access blocked without login

### All Pages Available

1. **/** - Login Page (default)
2. **/signup** - Create Account
3. **/dashboard** - Main Dashboard (protected)
4. **/emergency** - SOS & Emergency Help (protected)
5. **/legal-help** - Legal Rights & Information (protected)
6. **/counselling** - Mental Health Support (protected)
7. **/evidence** - Document Incidents (protected)
8. **/safety-plan** - Safety Planning & Risk Assessment (protected)
9. **/support-services** - Directory of Services (protected)
10. **/resources** - Educational Resources (protected)
11. **/support-requests** - Request Help (protected)
12. **/admin** - Admin Panel (admin only, protected)
13. **/home** - Public Home Page

### Features Implemented

✅ **Emergency System**
- SOS panic button
- Emergency contacts
- Quick exit button
- Location sharing
- Nearby services

✅ **Legal Help**
- Your rights information
- Protection orders guide
- Filing complaints
- Evidence documentation tips

✅ **Counselling**
- Request counseling
- Crisis support hotlines
- Self-care resources
- Types of therapy

✅ **Evidence Upload**
- Document incidents
- Upload photos/videos
- Secure storage
- Timeline view
- Export for legal use

✅ **Safety Planning**
- Risk assessment questionnaire
- Escape plan creation
- Emergency bag checklist
- Safe places list
- Trusted contacts

✅ **Support Services**
- Shelters directory
- Hospitals
- Police stations
- NGOs
- Legal aid providers
- Search by location

✅ **Resources**
- What is domestic violence
- Types of abuse
- Warning signs
- Safety tips
- How to get help
- How to help others

✅ **Support Requests**
- Request counselor
- Request legal advisor
- Track request status
- Message advisors

✅ **Admin Panel**
- User management
- Statistics dashboard
- Case monitoring
- Resource management

## 📝 How to Use

### For Victims/Survivors

1. **Sign up** with role: "Victim/Survivor seeking help"
2. **Dashboard** shows all available features
3. **Emergency** - Use SOS button if in danger
4. **Legal Help** - Learn your rights
5. **Counselling** - Get mental health support
6. **Evidence** - Document abuse incidents
7. **Safety Plan** - Create escape plan
8. **Support Services** - Find nearby help
9. **Support Requests** - Connect with professionals

### For Counselors

1. **Sign up** with role: "Counselor/Therapist"
2. View support requests
3. Respond to clients
4. Track sessions

### For Legal Advisors

1. **Sign up** with role: "Legal Advisor"
2. View legal assistance requests
3. Provide legal guidance
4. Track consultations

### For Administrators

1. **Sign up** with role: "Administrator"
2. Access admin panel
3. Manage users
4. Monitor system
5. Manage resources

## 🎨 All Input Fields Included

### Login Page
- Email input
- Password input
- Remember me checkbox
- Login button
- Sign up link

### Signup Page
- Full name input
- Email input
- Role selection dropdown (4 roles)
- Password input
- Confirm password input
- Create account button
- Sign in link

### Emergency Page
- SOS button
- Quick exit button
- Emergency contact buttons
- Location search

### Legal Help Page
- Tabs for different sections
- Information display
- Action buttons

### Counselling Page
- Request form
- Session scheduling
- Contact preferences

### Evidence Upload Page
- Date picker
- Time picker
- Location input
- Description textarea
- Witnesses input
- File upload (photos/videos)
- Save button

### Safety Plan Page
- Risk assessment radio buttons
- Safe places inputs (3 fields)
- Trusted contacts (name + phone)
- Escape route textarea
- Code word input
- Emergency checklist checkboxes
- Save button

### Support Services Page
- Search input
- Location filter
- Service type tabs
- Contact buttons

### Support Requests Page
- Support type dropdown
- Urgency level dropdown
- Subject input
- Description textarea
- Preferred contact dropdown
- Phone number input
- Submit button

### Admin Panel
- User search input
- User table with actions
- Statistics cards
- Activity log

## 🔒 Security Features

- ✅ JWT authentication via Spring Boot backend
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Session management
- ✅ Auto logout on session expire
- ✅ Secure password requirements (6+ chars)

## 🎯 User Roles

1. **Victim/Survivor** - Full access to support features
2. **Counselor** - View and respond to counseling requests
3. **Legal Advisor** - Provide legal assistance
4. **Administrator** - Full system management

## 📱 Responsive Design

- ✅ Mobile friendly
- ✅ Tablet optimized
- ✅ Desktop layout
- ✅ Touch-friendly buttons

## 🐛 Troubleshooting

### "Invalid login credentials"
- Make sure you created an account first
- Password must be 6+ characters

### Page blank after login
- Check browser console (F12)
- Clear cache (Ctrl + Shift + R)
- Check backend API is running on port 9092

### Can't access dashboard
- Make sure you're logged in
- Check if session is active
- Try logging out and back in

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod
```

## 📞 Emergency Contacts (Built-in)

- **911** - Emergency Services
- **1-800-799-7233** - National DV Hotline
- **988** - Suicide Prevention Lifeline
- **Text HOME to 741741** - Crisis Text Line

## 🎓 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Spring Boot + Spring Security + JWT + MySQL
- **Build Tool**: Vite 6
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner

## 📄 License

This project is for educational purposes.

## 🤝 Support

For issues or questions:
1. Check this README
2. Check browser console for errors
3. Check backend logs for API errors

---

**Remember**: This is a support platform for domestic violence survivors. Handle all data with care and respect privacy.
