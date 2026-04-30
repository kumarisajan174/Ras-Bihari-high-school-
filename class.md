# MASTER PROMPT FOR TRAE AI

Create a complete production-ready full-stack school internship web application named:

# “Mahabodhi Internship Program”

This project is for:

* Mahabodhi Mahavidyalaya B.Ed & D.El.Ed College
* Internship School: Ras Bihari High School Nalanda

The application must be:

* Mobile-first
* PWA enabled (Add to Home Screen on Android)
* Beautiful modern UI
* Optimized for low-end Android devices
* Easy to deploy on Vercel
* Built for students and admin usage
* Responsive and lightweight
* Professional but simple

---

# TECH STACK (MANDATORY)

---

Use ONLY these technologies:

Frontend:

* Next.js 15 App Router
* Tailwind CSS
* TypeScript

Backend:

* Next.js API Routes

Database:

* Neon PostgreSQL

ORM:

* Prisma

Authentication:

* Simple admin password auth only
* No OTP
* No email verification
* No complex auth system

Hosting:

* Vercel compatible

PWA:

* next-pwa

Icons:

* Lucide React

Animations:

* Framer Motion

UI:

* Clean school-style dashboard
* Glassmorphism
* Gradient cards
* Rounded corners
* Smooth animations
* Phone-first layout

---

# IMPORTANT REQUIREMENTS

---

The project MUST:

* Work perfectly on Android phones
* Have installable PWA support
* Support Add to Home Screen
* Have fast loading
* Use optimized components
* Use dark/light friendly colors
* Use modern gradients
* Use bottom mobile navigation
* Be easy for non-technical teachers/admins

Do NOT:

* Create separate Express backend
* Use Supabase
* Use Firebase
* Use MongoDB
* Use Clerk/Auth.js
* Use heavy authentication
* Use Redux
* Use complicated role systems

---

# PROJECT NAME & BRANDING

---

Project Name:
“Mahabodhi Internship Program”

Subtitle:
“Ras Bihari High School Nalanda”

Use a professional school-style design.

Theme:

* Blue
* Indigo
* Purple gradients
* White cards
* Clean typography

---

# MAIN FEATURES

---

# STUDENT SIDE (NO LOGIN REQUIRED)

Students can directly:

* Open website
* Browse classes
* Browse sections
* Browse teachers
* View homework
* View classwork
* View notices
* View today highlights

Students should NOT need login.

Optional student profile:
Students may create a simple profile with:

* Name
* Roll
* Class
* Section
* Father Name
* Mobile Number

No verification required.

---

# CLASS FLOW

---

Home
↓
Select Class
↓
Select Section
↓
Select Teacher/Subject
↓
View Homework & Classwork by Date

---

# CLASSES

---

Classes:

* 9
* 10
* 11
* 12

---

# SECTIONS

---

Sections:

* A
* B
* C
* D
* E
* F
* G

Admin should be able to:

* Add section
* Edit section
* Delete section

---

# TEACHERS

---

Teachers should contain:

* Name
* Subject
* Class
* Section
* WhatsApp link
* Instagram link
* Facebook link
* Optional profile photo

Teacher examples:

* Mr Sunny
* Shivani
* Akash
* Ritik
* Anamika
* Chinki
* Babli
* Ravindra
* Aman

Admin must be able to:

* Add teacher
* Edit teacher
* Delete teacher

---

# SOCIAL BUTTONS

---

Do NOT visibly show usernames.

Instead:

* Show social icons only
* Clicking opens:

  * WhatsApp
  * Instagram
  * Facebook

Instagram should redirect to:

* sunnyni62 profile

But never visibly show the username text.

---

# HOMEWORK / CLASSWORK SYSTEM

---

Admin can create posts with:

* Title
* Content
* Type:

  * Homework
  * Classwork
  * Notice
* Date
* Class
* Section
* Teacher

Students can:

* Filter by date
* View latest first
* View today highlighted

Highlight:

* Today’s homework
* Today’s classwork

Use beautiful glowing highlight cards.

---

# NOTICE BOARD

---

Create animated notice board section.

Features:

* Important notices
* Exam notices
* Holiday notices
* Announcements

---

# ADMIN PANEL

---

Create simple admin dashboard.

Admin login:

* Simple password login
* Use environment variable

ENV Example:
ADMIN_PASSWORD=admin123

Admin dashboard features:

* Add homework
* Edit homework
* Delete homework
* Add notices
* Manage teachers
* Manage classes
* Manage sections
* Highlight important posts

Admin UI must:

* Work well on phones
* Use large buttons
* Be simple for teachers

---

# DATABASE STRUCTURE

---

Create Prisma schema with tables:

students
teachers
classes
sections
posts

Relationships:

* Classes have sections
* Sections have teachers
* Posts belong to class + section + teacher

---

# PWA REQUIREMENTS

---

Configure:

* next-pwa
* manifest.json
* service worker
* offline support basics

The website must:

* Be installable on Android
* Open fullscreen like app
* Have app icon support

---

# DESIGN REQUIREMENTS

---

Create AMAZING UI.

Use:

* Glassmorphism
* Soft shadows
* Gradient backgrounds
* Modern mobile cards
* Sticky bottom navbar
* Smooth page transitions
* Framer Motion animations

Pages should feel:

* Modern
* Lightweight
* School-oriented
* Professional

---

# HOME PAGE SECTIONS

---

Home page should contain:

1. Hero Banner
2. Welcome message
3. Internship details
4. Quick class cards
5. Today highlights
6. Notice board
7. Teacher spotlight
8. Footer

Welcome message example:
“Welcome Students 👋”

---

# FOOTER

---

Footer should include:

* College name
* School name
* Internship information
* Social icons

---

# FILE STRUCTURE

---

Use clean scalable structure.

Example:

/app
/(student)
/(admin)
/api

/components
/lib
/prisma
/public
/styles

---

# IMPORTANT CODING RULES

---

* Use reusable components
* Use server actions where useful
* Optimize images
* Use TypeScript properly
* Avoid unnecessary libraries
* Use clean architecture
* Add loading states
* Add empty states
* Add error handling
* Add responsive layouts

---

# DEPLOYMENT REQUIREMENTS

---

Project must be:

* Fully Vercel deployable
* Production-ready
* Environment variable ready
* Neon compatible

Provide:

* .env.example
* README setup instructions

---

# FINAL REQUIREMENT

---

Generate:

* Complete frontend
* Complete backend
* Prisma schema
* API routes
* Admin dashboard
* Student dashboard
* PWA configuration
* Responsive UI
* Mobile-first design
* Deployment-ready code

The final project should feel like a polished real school management and homework platform optimized for Android students and internship demonstration.
