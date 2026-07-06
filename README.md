# Alumni Mentorship Platform (AlumConnect)

This repository contains the implementation of the **Alumni Mentorship Platform**, built as a Single Page Application (SPA) using standard HTML5, Vanilla CSS, and modern JavaScript.

> **Note**: This project is submitted for the **NALUM Junior Developer Recruitment Form** evaluation.

---

## 🚀 Live Demo & Repository

- **Live URL**: [alumni-mentorship-platform-amber.vercel.app](https://alumni-mentorship-platform-amber.vercel.app)
- **GitHub Repository**: [github.com/senkuthegreat/alumni-mentorship-platform](https://github.com/senkuthegreat/alumni-mentorship-platform)

---

## 🛠️ Features Implemented

1. **Mentor Profiles Directory**:
   - Lists verified alumni from top tier companies (Google, Meta, Microsoft, Airbnb, Netflix).
   - Filter and search functionality: search by keywords, filter by domain, or filter by day of week availability.
2. **Mentorship Session Booking**:
   - 1-on-1 booking session request modal.
   - Dynamic time-slots loading based on mentor availability.
3. **Open Discussion Forum**:
   - Categorized thread filters (Career Advice, Tech Stack, Interview Prep, Resume Review).
   - Post questions, view full comments, like threads, and add replies.
4. **Control Center Dashboard**:
   - **Overview**: High-level platform statistics and recent booking activity.
   - **Booking Requests**: Review pending requests, evaluate student messages, and approve (green badge) or decline (red badge) them.
   - **Manage Mentors**: Add new mentor profiles with custom availability and seeds or delete existing ones.
   - **Manage Forum**: View and moderate discussion posts.

---

## 🎨 Design & Aesthetic

- Built with a **premium flat dark/cobalt blue theme** (similar to Vercel/Linear).
- Utilizes absolute charcoal cards, thin borders, electric blue accents (`#2563eb`), and custom typography via the `Plus Jakarta Sans` Google Font.
- Responsive design tailored for desktops, tablets, and mobile devices.

---

## 💾 State & Persistence

- Data is managed entirely client-side using a mock database layered on top of `localStorage`.
- Includes initial seed data for mentors, bookings, and forum threads. Any additions (new mentors, bookings, comments, likes) persist across page reloads.
- Includes a **Role Switcher** dropdown in the sidebar to simulate both the **Student** and **Alumni/Admin** viewpoints in real time.

---

## 💻 How to Run Locally

Since this is a static frontend project, you can launch a local HTTP server:

### Option A: Using Python
Run in the root folder:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

### Option B: Using Node (npx)
Run in the root folder:
```bash
npx serve -l 8000
```
Then navigate to `http://localhost:8000`.
