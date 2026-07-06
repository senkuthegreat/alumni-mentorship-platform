// Alumni Mentorship Platform - Application Driver
(function() {
  
  // ==================== STATE & PERSISTENCE ====================
  const DB = {
    get: (key, fallback) => {
      try {
        const data = localStorage.getItem(`amp_${key}`);
        return data ? JSON.parse(data) : fallback;
      } catch (e) {
        console.error("Local storage access failed, using fallback.", e);
        return fallback;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(`amp_${key}`, JSON.stringify(value));
      } catch (e) {
        console.error("Local storage save failed.", e);
      }
    }
  };

  // State initialization
  let mentors = DB.get('mentors', null);
  let bookings = DB.get('bookings', null);
  let posts = DB.get('posts', null);

  // If local storage is empty, initialize with mock data from window
  if (!mentors || mentors.length === 0) {
    mentors = window.initialMentors || [];
    DB.set('mentors', mentors);
  }
  if (!bookings || bookings.length === 0) {
    bookings = window.initialBookings || [];
    DB.set('bookings', bookings);
  }
  if (!posts || posts.length === 0) {
    posts = window.initialForumPosts || [];
    DB.set('posts', posts);
  }

  // App Global UI State
  const AppState = {
    currentRole: 'student', // 'student' or 'admin'
    currentView: 'home',    // 'home', 'mentors', 'forum', 'dashboard'
    forumCategory: 'all',   // 'all', 'Career Advice', 'Tech Stack', 'Interview Prep', 'Resume Review'
    dashboardTab: 'overview', // 'overview', 'bookings', 'mentors', 'forum'
    likedPosts: DB.get('liked_posts', []) // track posts liked by this session
  };

  // User details mapped to active role simulator
  const Users = {
    student: {
      name: "Devansh Gupta",
      email: "devansh.gupta@student.nsut.ac.in",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh"
    },
    admin: {
      name: "Siddharth Khare (Admin/Alum)",
      email: "siddharth.khare@alumni.nsut.ac.in",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth"
    }
  };

  // ==================== DOM ELEMENTS ====================
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const headerTitle = document.getElementById('header-title');
  const headerSubtitle = document.getElementById('header-subtitle');
  const userRoleToggle = document.getElementById('user-role-toggle');
  const globalUserAvatar = document.getElementById('global-user-avatar');
  const globalUserName = document.getElementById('global-user-name');
  
  // Home elements
  const statMentorsCount = document.getElementById('stat-mentors-count');
  const statBookingsCount = document.getElementById('stat-bookings-count');
  const statForumCount = document.getElementById('stat-forum-count');
  const homeForumFeed = document.getElementById('home-forum-feed');
  const homeMentorsList = document.getElementById('home-mentors-list');

  // Mentors elements
  const mentorsGrid = document.getElementById('mentors-grid');
  const mentorSearchInput = document.getElementById('mentor-search-input');
  const mentorFilterDomain = document.getElementById('mentor-filter-domain');
  const mentorFilterAvailability = document.getElementById('mentor-filter-availability');

  // Forum elements
  const forumCategoryBtns = document.querySelectorAll('.category-filter-btn');
  const forumFeedContainer = document.getElementById('forum-feed-container');
  const submitPostBtn = document.getElementById('btn-submit-forum-post');
  const newPostTitle = document.getElementById('forum-post-title');
  const newPostCategory = document.getElementById('forum-post-category');
  const newPostContent = document.getElementById('forum-post-content');

  // Modals elements
  const bookingModal = document.getElementById('booking-modal');
  const mentorModal = document.getElementById('mentor-modal');
  const postDetailModal = document.getElementById('post-detail-modal');

  // Booking Form elements
  const bookingForm = document.getElementById('booking-request-form');
  const bookingMentorId = document.getElementById('booking-mentor-id');
  const bookingMentorName = document.getElementById('booking-mentor-name');
  const bookingStudentName = document.getElementById('booking-student-name');
  const bookingStudentEmail = document.getElementById('booking-student-email');
  const bookingDate = document.getElementById('booking-date');
  const bookingSlot = document.getElementById('booking-slot');
  const bookingPurpose = document.getElementById('booking-purpose');

  // Add Mentor Form elements
  const addMentorForm = document.getElementById('add-mentor-form');
  const newMentorName = document.getElementById('mentor-name');
  const newMentorDomain = document.getElementById('mentor-domain');
  const newMentorCompany = document.getElementById('mentor-company');
  const newMentorExp = document.getElementById('mentor-experience');
  const newMentorAvatarSeed = document.getElementById('mentor-avatar-seed');
  const newMentorAvailability = document.getElementById('mentor-availability-slots');
  const newMentorBio = document.getElementById('mentor-bio');

  // Dashboard elements
  const dbTabButtons = document.querySelectorAll('.dashboard-tab-btn');
  const dbViews = document.querySelectorAll('.dashboard-view');
  const dbStatPendingBookings = document.getElementById('db-stat-pending-bookings');
  const dbStatApprovedBookings = document.getElementById('db-stat-approved-bookings');
  const dbStatNewMentors = document.getElementById('db-stat-new-mentors');
  const dbRecentBookingsList = document.getElementById('db-recent-bookings-list');
  const dbSimulatorName = document.getElementById('db-simulator-name');
  const dbBookingsTableBody = document.getElementById('db-bookings-table-body');
  const dbMentorsTableBody = document.getElementById('db-mentors-table-body');
  const dbForumTableBody = document.getElementById('db-forum-table-body');

  // ==================== SYSTEM TOASTS / ALERTS ====================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '10px';
    toast.style.color = '#fff';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.animation = 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    toast.style.backdropFilter = 'blur(10px)';

    let bg, icon;
    if (type === 'success') {
      bg = 'rgba(16, 185, 129, 0.95)';
      icon = '<i data-lucide="check-circle" style="width:18px;height:18px"></i>';
    } else if (type === 'error') {
      bg = 'rgba(239, 68, 68, 0.95)';
      icon = '<i data-lucide="alert-triangle" style="width:18px;height:18px"></i>';
    } else {
      bg = 'rgba(99, 102, 241, 0.95)';
      icon = '<i data-lucide="info" style="width:18px;height:18px"></i>';
    }

    toast.style.backgroundColor = bg;
    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);
    
    lucide.createIcons();

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  // ==================== INITIALIZATION & ROUTING ====================
  function init() {
    setupEventListeners();
    handleRoleChange(AppState.currentRole);
    updateGlobalStats();
    
    // Initial view load from hash or default
    const hash = window.location.hash.substring(1) || 'home';
    switchView(hash);
  }

  function handleRouting() {
    const hash = window.location.hash.substring(1) || 'home';
    switchView(hash);
  }

  function switchView(viewName) {
    if (!['home', 'mentors', 'forum', 'dashboard'].includes(viewName)) {
      viewName = 'home';
    }
    
    AppState.currentView = viewName;
    
    // Update active nav-link
    navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle sections visibility
    viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update Header Content
    updateHeaderContent(viewName);

    // Refresh view specific components
    if (viewName === 'home') {
      renderHomeView();
    } else if (viewName === 'mentors') {
      renderMentorsView();
    } else if (viewName === 'forum') {
      renderForumView();
    } else if (viewName === 'dashboard') {
      renderDashboardView();
    }

    // Smooth scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Redraw Lucide icons
    lucide.createIcons();
  }

  function updateHeaderContent(viewName) {
    const user = Users[AppState.currentRole];
    if (viewName === 'home') {
      headerTitle.textContent = `Hello, ${user.name.split(' ')[0]} 👋`;
      headerSubtitle.textContent = "Welcome to your mentorship bridge. What are we building today?";
    } else if (viewName === 'mentors') {
      headerTitle.textContent = "Alumni Directory";
      headerSubtitle.textContent = "Book 1-on-1 sessions with graduates working in leading industries.";
    } else if (viewName === 'forum') {
      headerTitle.textContent = "Open Discussion Forum";
      headerSubtitle.textContent = "Ask questions, share strategies, and seek career insights.";
    } else if (viewName === 'dashboard') {
      headerTitle.textContent = "Control Center";
      headerSubtitle.textContent = "Manage profiles, evaluate bookings, and oversee discussions.";
    }
  }

  function updateGlobalStats() {
    statMentorsCount.textContent = mentors.length;
    statBookingsCount.textContent = bookings.length;
    statForumCount.textContent = posts.length;
  }

  // ==================== CORE EVENT LISTENERS ====================
  function setupEventListeners() {
    // Hash Routing
    window.addEventListener('hashchange', handleRouting);

    // Sidebar navigation click handler
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const view = this.getAttribute('data-view');
        window.location.hash = view;
      });
    });

    // User switch selector
    userRoleToggle.addEventListener('change', function() {
      handleRoleChange(this.value);
    });

    // Quick navigation button headers
    document.getElementById('btn-quick-nav-mentors').addEventListener('click', () => {
      window.location.hash = 'mentors';
    });
    document.getElementById('btn-quick-nav-forum').addEventListener('click', () => {
      window.location.hash = 'forum';
      setTimeout(() => {
        newPostTitle.focus();
      }, 500);
    });

    // Hero buttons
    document.getElementById('hero-btn-mentors').addEventListener('click', () => {
      window.location.hash = 'mentors';
    });
    document.getElementById('hero-btn-forum').addEventListener('click', () => {
      window.location.hash = 'forum';
    });

    // Mentors search and filters
    mentorSearchInput.addEventListener('input', renderMentorsView);
    mentorFilterDomain.addEventListener('change', renderMentorsView);
    mentorFilterAvailability.addEventListener('change', renderMentorsView);

    // Forum category filter buttons
    forumCategoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        forumCategoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        AppState.forumCategory = this.getAttribute('data-category');
        renderForumView();
      });
    });

    // Forum Post Composer Submit
    submitPostBtn.addEventListener('click', handleCreateForumPost);

    // Dashboard tab toggles
    dbTabButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        dbTabButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const selectedTab = this.getAttribute('data-tab');
        AppState.dashboardTab = selectedTab;
        
        dbViews.forEach(view => {
          if (view.id === `db-tab-${selectedTab}`) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
        
        renderDashboardView();
      });
    });

    // Modals controls
    // Booking modal close buttons
    document.getElementById('btn-close-booking-modal').addEventListener('click', closeBookingModal);
    document.getElementById('btn-cancel-booking').addEventListener('click', (e) => {
      e.preventDefault();
      closeBookingModal();
    });
    bookingForm.addEventListener('submit', handleBookingSubmit);

    // Add Mentor modal close buttons
    document.getElementById('btn-add-mentor-modal').addEventListener('click', openMentorModal);
    document.getElementById('btn-close-mentor-modal').addEventListener('click', closeMentorModal);
    document.getElementById('btn-cancel-mentor').addEventListener('click', (e) => {
      e.preventDefault();
      closeMentorModal();
    });
    addMentorForm.addEventListener('submit', handleAddMentorSubmit);

    // Post detail close button
    document.getElementById('btn-close-post-modal').addEventListener('click', closePostDetailModal);
    document.getElementById('post-comment-form').addEventListener('submit', handleCommentSubmit);
  }

  // ==================== ROLE SWITCHER CONTROLLER ====================
  function handleRoleChange(role) {
    AppState.currentRole = role;
    
    // Update local variables
    const user = Users[role];
    globalUserAvatar.src = user.avatar;
    globalUserName.textContent = user.name;
    
    // Auto-fill forms where appropriate
    bookingStudentName.value = user.name;
    bookingStudentEmail.value = user.email;
    
    // Re-fill simulator status card in dashboard
    dbSimulatorName.textContent = role === 'student' ? 'Student Sandbox' : 'Alumni & Administrator';
    
    // Show feedback
    showToast(`Switched view to: ${role === 'student' ? 'Student View' : 'Alumni / Admin View'}`, 'info');

    // Re-render UI
    switchView(AppState.currentView);
  }

  // ==================== RENDERING: HOME VIEW ====================
  function renderHomeView() {
    updateGlobalStats();

    // Render Recent Forum posts (take top 3)
    const recentPosts = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    
    if (recentPosts.length === 0) {
      homeForumFeed.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-secondary);">No forum posts yet. Ask the first question!</div>`;
    } else {
      homeForumFeed.innerHTML = recentPosts.map(post => `
        <div class="forum-post-card" data-post-id="${post.id}">
          <div class="post-header">
            <div class="post-author-group">
              <span style="font-weight: 700;">${post.author}</span>
              <span class="post-author-role ${post.role.toLowerCase().includes('alumni') ? 'alumni' : ''}">${post.role}</span>
            </div>
            <span class="post-time">${formatDate(post.date)}</span>
          </div>
          <h4 class="post-title">${post.title}</h4>
          <p class="post-excerpt">${post.content}</p>
          <div class="post-footer">
            <span class="post-action-btn ${AppState.likedPosts.includes(post.id) ? 'liked' : ''}" onclick="event.stopPropagation(); window.togglePostLike(${post.id})">
              <i data-lucide="heart"></i> <span>${post.likes}</span>
            </span>
            <span class="post-action-btn">
              <i data-lucide="message-square"></i> <span>${post.comments.length} replies</span>
            </span>
            <span class="post-category-tag" style="margin-left: auto;">${post.category}</span>
          </div>
        </div>
      `).join('');

      // Add click listener to posts cards
      document.querySelectorAll('#home-forum-feed .forum-post-card').forEach(card => {
        card.addEventListener('click', function() {
          const postId = parseInt(this.getAttribute('data-post-id'));
          openPostDetailModal(postId);
        });
      });
    }

    // Render Active Mentors (highest rating, limit to 3)
    const activeMentors = [...mentors].sort((a, b) => b.rating - a.rating).slice(0, 3);
    
    homeMentorsList.innerHTML = activeMentors.map(mentor => `
      <div class="mentor-card" style="padding: 16px;">
        <div class="mentor-card-header" style="gap:12px;">
          <img src="${mentor.avatar}" alt="${mentor.name}" class="mentor-profile-pic" style="width: 44px; height: 44px;">
          <div class="mentor-meta">
            <div class="mentor-name" style="font-size:0.95rem;">${mentor.name}</div>
            <div class="mentor-title" style="font-size:0.75rem;">${mentor.company}</div>
          </div>
          <div class="mentor-rating" style="padding:1px 6px; font-size:0.7rem;">
            <i data-lucide="star" style="width:10px; height:10px; fill:currentColor;"></i> ${mentor.rating}
          </div>
        </div>
        <div class="mentor-domain-tag" style="padding: 2px 8px; font-size: 0.7rem;">${mentor.domain}</div>
        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="window.openBookingModal(${mentor.id})">
          Request Session
        </button>
      </div>
    `).join('');
  }

  // ==================== RENDERING: MENTORS DIRECTORY ====================
  function renderMentorsView() {
    const searchVal = mentorSearchInput.value.toLowerCase();
    const domainVal = mentorFilterDomain.value;
    const availabilityVal = mentorFilterAvailability.value;

    const filtered = mentors.filter(mentor => {
      // Search text match
      const textMatch = mentor.name.toLowerCase().includes(searchVal) ||
                        mentor.company.toLowerCase().includes(searchVal) ||
                        mentor.domain.toLowerCase().includes(searchVal) ||
                        mentor.bio.toLowerCase().includes(searchVal);
      
      // Domain select match
      const domainMatch = domainVal === 'all' || mentor.domain === domainVal;
      
      // Availability select match
      const availabilityMatch = availabilityVal === 'all' || 
        mentor.availability.some(slot => slot.toLowerCase().includes(availabilityVal.toLowerCase()));

      return textMatch && domainMatch && availabilityMatch;
    });

    if (filtered.length === 0) {
      mentorsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary);">
          <i data-lucide="users-2" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--text-muted);"></i>
          <p>No mentors found matching your filters. Try clearing the search or filters.</p>
        </div>
      `;
    } else {
      mentorsGrid.innerHTML = filtered.map(mentor => `
        <div class="mentor-card">
          <div class="mentor-card-header">
            <img src="${mentor.avatar}" alt="${mentor.name}" class="mentor-profile-pic">
            <div class="mentor-meta">
              <div class="mentor-name">${mentor.name}</div>
              <div class="mentor-title">${mentor.company}</div>
              <div class="mentor-rating">
                <i data-lucide="star" style="width: 12px; height: 12px; fill: currentColor;"></i> ${mentor.rating}
              </div>
            </div>
          </div>
          <div class="mentor-domain-tag">${mentor.domain}</div>
          <p class="mentor-bio">${mentor.bio}</p>
          <div class="mentor-exp">
            <i data-lucide="briefcase" style="width: 14px; height: 14px;"></i>
            <span>${mentor.experience} Years of Industry Experience</span>
          </div>
          <div class="mentor-availability">
            <div class="availability-label">Slots Available</div>
            <div class="availability-pills">
              ${mentor.availability.map(slot => `<span class="availability-pill">${slot}</span>`).join('')}
            </div>
          </div>
          <div class="mentor-card-actions">
            <button class="btn btn-primary" style="width: 100%;" onclick="window.openBookingModal(${mentor.id})">
              Book Mentorship Session
            </button>
          </div>
        </div>
      `).join('');
    }

    lucide.createIcons();
  }

  // ==================== RENDERING: DISCUSSION FORUM ====================
  function renderForumView() {
    // 1. Update left categories counts badge
    const counts = { all: posts.length };
    posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });

    document.getElementById('badge-cat-all').textContent = counts.all;
    document.getElementById('badge-cat-career').textContent = counts['Career Advice'] || 0;
    document.getElementById('badge-cat-tech').textContent = counts['Tech Stack'] || 0;
    document.getElementById('badge-cat-interview').textContent = counts['Interview Prep'] || 0;
    document.getElementById('badge-cat-resume').textContent = counts['Resume Review'] || 0;

    // 2. Filter posts
    const catVal = AppState.forumCategory;
    const filtered = catVal === 'all' ? posts : posts.filter(p => p.category === catVal);
    
    // Sort by recent date
    const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
      forumFeedContainer.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color);">
          <i data-lucide="message-square" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--text-muted);"></i>
          <p>No questions yet in this category. Be the first to start the thread!</p>
        </div>
      `;
    } else {
      forumFeedContainer.innerHTML = sorted.map(post => `
        <div class="forum-post-card" data-post-id="${post.id}">
          <div class="post-header">
            <div class="post-author-group">
              <span style="font-weight: 700;">${post.author}</span>
              <span class="post-author-role ${post.role.toLowerCase().includes('alumni') ? 'alumni' : ''}">${post.role}</span>
            </div>
            <span class="post-time">${formatDate(post.date)}</span>
          </div>
          <h4 class="post-title">${post.title}</h4>
          <p class="post-excerpt">${post.content}</p>
          <div class="post-footer">
            <button class="post-action-btn ${AppState.likedPosts.includes(post.id) ? 'liked' : ''}" onclick="event.stopPropagation(); window.togglePostLike(${post.id})">
              <i data-lucide="heart"></i> <span>${post.likes}</span>
            </button>
            <button class="post-action-btn">
              <i data-lucide="message-square"></i> <span>${post.comments.length} replies</span>
            </button>
            <span class="post-category-tag" style="margin-left: auto;">${post.category}</span>
          </div>
        </div>
      `).join('');

      // Add click listener
      document.querySelectorAll('#forum-feed-container .forum-post-card').forEach(card => {
        card.addEventListener('click', function() {
          const postId = parseInt(this.getAttribute('data-post-id'));
          openPostDetailModal(postId);
        });
      });
    }

    lucide.createIcons();
  }

  // ==================== RENDERING: DASHBOARD ====================
  function renderDashboardView() {
    const tab = AppState.dashboardTab;
    
    // Always recalculate stats
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const approvedBookings = bookings.filter(b => b.status === 'Approved').length;
    
    dbStatPendingBookings.textContent = pendingBookings;
    dbStatApprovedBookings.textContent = approvedBookings;
    dbStatNewMentors.textContent = mentors.length;

    if (tab === 'overview') {
      renderDashboardOverview();
    } else if (tab === 'bookings') {
      renderDashboardBookings();
    } else if (tab === 'mentors') {
      renderDashboardMentors();
    } else if (tab === 'forum') {
      renderDashboardForum();
    }
  }

  function renderDashboardOverview() {
    // Show top 3 pending bookings in activity feed
    const pending = bookings.filter(b => b.status === 'Pending').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
    
    if (pending.length === 0) {
      dbRecentBookingsList.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No pending session requests at the moment.
        </div>
      `;
    } else {
      dbRecentBookingsList.innerHTML = pending.map(b => {
        const mentor = mentors.find(m => m.id === b.mentorId) || { name: 'Unknown Mentor' };
        return `
          <div class="activity-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(b.studentName)}" class="activity-avatar" alt="Avatar">
            <div class="activity-content">
              <div class="activity-title">${b.studentName} requested <span style="color:var(--accent-cyan);">${mentor.name}</span></div>
              <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Slot: ${b.date} (${b.timeSlot})</div>
              <div class="activity-time">${formatDate(b.timestamp)}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function renderDashboardBookings() {
    if (bookings.length === 0) {
      dbBookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-secondary);">No bookings recorded.</td></tr>`;
      return;
    }
    
    // Sort bookings: pending first, then by date descending
    const sortedBookings = [...bookings].sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    dbBookingsTableBody.innerHTML = sortedBookings.map(b => {
      const mentor = mentors.find(m => m.id === b.mentorId) || { name: 'Deleted Mentor' };
      const badgeClass = `badge-${b.status.toLowerCase()}`;
      
      let actionButtons = '';
      if (b.status === 'Pending') {
        actionButtons = `
          <div class="action-cell">
            <button class="btn btn-success" style="padding: 6px 12px; font-size:0.75rem;" onclick="window.updateBookingStatus(${b.id}, 'Approved')">Approve</button>
            <button class="btn btn-danger" style="padding: 6px 12px; font-size:0.75rem;" onclick="window.updateBookingStatus(${b.id}, 'Declined')">Decline</button>
          </div>
        `;
      } else {
        actionButtons = `<span style="font-size:0.8rem; color:var(--text-muted)">Action Complete</span>`;
      }

      return `
        <tr>
          <td>
            <div style="font-weight:600; color:white;">${b.studentName}</div>
            <div style="font-size:0.75rem; color:var(--text-muted)">${b.studentEmail}</div>
          </td>
          <td>${mentor.name}</td>
          <td>
            <div>${b.date}</div>
            <div style="font-size:0.75rem; color:var(--text-muted)">${b.timeSlot}</div>
          </td>
          <td><div style="max-width: 250px; font-size:0.85rem;" title="${b.purpose}">${b.purpose}</div></td>
          <td><span class="badge ${badgeClass}">${b.status}</span></td>
          <td>${actionButtons}</td>
        </tr>
      `;
    }).join('');
  }

  function renderDashboardMentors() {
    if (mentors.length === 0) {
      dbMentorsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-secondary);">No mentors registered.</td></tr>`;
      return;
    }

    dbMentorsTableBody.innerHTML = mentors.map(m => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${m.avatar}" style="width:32px; height:32px; border-radius:50%; border:1px solid var(--accent-indigo);">
            <div style="font-weight:600; color:white;">${m.name}</div>
          </div>
        </td>
        <td><span class="mentor-domain-tag" style="padding: 2px 8px; font-size: 0.7rem;">${m.domain}</span></td>
        <td>${m.company}</td>
        <td>${m.experience} Years</td>
        <td><span style="font-size: 0.8rem;">${m.availability.join(', ')}</span></td>
        <td>
          <button class="btn btn-danger" style="padding: 6px 12px; font-size:0.75rem;" onclick="window.deleteMentor(${m.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function renderDashboardForum() {
    if (posts.length === 0) {
      dbForumTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-secondary);">No posts registered.</td></tr>`;
      return;
    }

    dbForumTableBody.innerHTML = posts.map(p => `
      <tr>
        <td><div style="font-weight:600; color:white; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.title}</div></td>
        <td><span class="post-category-tag" style="padding: 2px 8px; font-size: 0.7rem;">${p.category}</span></td>
        <td>${p.author}</td>
        <td>${p.comments.length}</td>
        <td>${p.likes}</td>
        <td><span style="font-size: 0.8rem;">${formatDate(p.date)}</span></td>
        <td>
          <button class="btn btn-danger" style="padding: 6px 12px; font-size:0.75rem;" onclick="window.deleteForumPost(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // ==================== INTERACTION LOGIC (MODALS & ACTIONS) ====================
  
  // Booking requests
  window.openBookingModal = function(mentorId) {
    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) {
      showToast("Mentor profile not found.", "error");
      return;
    }

    bookingMentorId.value = mentor.id;
    bookingMentorName.value = mentor.name;
    
    // Fill availability slots
    bookingSlot.innerHTML = mentor.availability.map(slot => `<option value="${slot}">${slot}</option>`).join('');
    
    // Trigger modal reveal
    bookingModal.style.display = 'flex';
  };

  function closeBookingModal() {
    bookingModal.style.display = 'none';
    bookingForm.reset();
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    
    const mentorId = parseInt(bookingMentorId.value);
    const studentName = bookingStudentName.value.trim();
    const studentEmail = bookingStudentEmail.value.trim();
    const date = bookingDate.value;
    const timeSlot = bookingSlot.value;
    const purpose = bookingPurpose.value.trim();

    if (!mentorId || !studentName || !studentEmail || !date || !timeSlot || !purpose) {
      showToast("Please fill in all details.", "error");
      return;
    }

    // Insert new booking
    const newBooking = {
      id: Date.now(), // simple numeric ID
      mentorId: mentorId,
      studentName: studentName,
      studentEmail: studentEmail,
      purpose: purpose,
      date: date,
      timeSlot: timeSlot,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    bookings.push(newBooking);
    DB.set('bookings', bookings);

    showToast("Mentorship requested successfully! Evaluated on Dashboard.", "success");
    closeBookingModal();
    
    // Transition to Dashboard
    window.location.hash = 'dashboard';
    setTimeout(() => {
      // Auto toggle to bookings tab
      document.querySelector('.dashboard-tab-btn[data-tab="bookings"]').click();
    }, 100);
  }

  window.updateBookingStatus = function(bookingId, newStatus) {
    const b = bookings.find(item => item.id === bookingId);
    if (b) {
      b.status = newStatus;
      DB.set('bookings', bookings);
      showToast(`Booking request ${newStatus.toLowerCase()} successfully!`, 'success');
      renderDashboardView();
    }
  };

  // Manage Mentors
  function openMentorModal() {
    mentorModal.style.display = 'flex';
  }

  function closeMentorModal() {
    mentorModal.style.display = 'none';
    addMentorForm.reset();
  }

  function handleAddMentorSubmit(e) {
    e.preventDefault();

    const name = newMentorName.value.trim();
    const domain = newMentorDomain.value;
    const company = newMentorCompany.value.trim();
    const exp = parseInt(newMentorExp.value);
    const avatarSeed = newMentorAvatarSeed.value.trim() || name;
    const availText = newMentorAvailability.value.trim();
    const bio = newMentorBio.value.trim();

    if (!name || !company || isNaN(exp) || !availText || !bio) {
      showToast("Please fill in all details.", "error");
      return;
    }

    const availSlots = availText.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const newMentor = {
      id: Date.now(),
      name: name,
      domain: domain,
      company: company,
      experience: exp,
      bio: bio,
      availability: availSlots,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`,
      rating: 5.0
    };

    mentors.push(newMentor);
    DB.set('mentors', mentors);

    showToast(`Mentor profile for ${name} registered!`, "success");
    closeMentorModal();
    renderDashboardView();
  };

  window.deleteMentor = function(mentorId) {
    if (confirm("Are you sure you want to delete this mentor profile?")) {
      mentors = mentors.filter(m => m.id !== mentorId);
      DB.set('mentors', mentors);
      showToast("Mentor profile deleted successfully.", "success");
      renderDashboardView();
    }
  };

  // Manage Forum posts
  window.togglePostLike = function(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const hasLiked = AppState.likedPosts.includes(postId);
    if (hasLiked) {
      post.likes -= 1;
      AppState.likedPosts = AppState.likedPosts.filter(id => id !== postId);
    } else {
      post.likes += 1;
      AppState.likedPosts.push(postId);
    }
    
    DB.set('posts', posts);
    DB.set('liked_posts', AppState.likedPosts);

    // Dynamic UI update without full view rebuild
    if (AppState.currentView === 'home') {
      renderHomeView();
    } else if (AppState.currentView === 'forum') {
      renderForumView();
    }
  };

  function handleCreateForumPost() {
    const title = newPostTitle.value.trim();
    const category = newPostCategory.value;
    const content = newPostContent.value.trim();

    if (!title || !content) {
      showToast("Question title and details are required.", "error");
      return;
    }

    const user = Users[AppState.currentRole];
    const newPost = {
      id: Date.now(),
      title: title,
      content: content,
      category: category,
      author: user.name.split(' (')[0], // strip admin suffix
      role: AppState.currentRole === 'student' ? 'Student' : 'Alumni (Admin)',
      date: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };

    posts.push(newPost);
    DB.set('posts', posts);

    showToast("Your question was posted successfully!", "success");
    
    // Clear forms
    newPostTitle.value = '';
    newPostContent.value = '';

    renderForumView();
  }

  window.deleteForumPost = function(postId) {
    if (confirm("Are you sure you want to delete this forum post?")) {
      posts = posts.filter(p => p.id !== postId);
      DB.set('posts', posts);
      showToast("Forum post deleted successfully.", "success");
      renderDashboardView();
    }
  };

  // Forum detailed view Comments Modal
  function openPostDetailModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    document.getElementById('comment-post-id').value = post.id;
    document.getElementById('detail-modal-category').textContent = post.category;
    document.getElementById('detail-modal-title').textContent = post.title;
    document.getElementById('detail-modal-author').textContent = post.author;
    
    const roleBadge = document.getElementById('detail-modal-role');
    roleBadge.textContent = post.role;
    if (post.role.toLowerCase().includes('alumni')) {
      roleBadge.classList.add('alumni');
    } else {
      roleBadge.classList.remove('alumni');
    }

    document.getElementById('detail-modal-date').textContent = formatDate(post.date);
    document.getElementById('detail-modal-content').textContent = post.content;
    
    // Render comments list
    renderPostComments(post);

    postDetailModal.style.display = 'flex';
    lucide.createIcons();
  }

  function closePostDetailModal() {
    postDetailModal.style.display = 'none';
    document.getElementById('post-comment-form').reset();
  }

  function renderPostComments(post) {
    document.getElementById('detail-comments-count').textContent = post.comments.length;
    const list = document.getElementById('detail-comments-list');

    if (post.comments.length === 0) {
      list.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 12px 0;">No responses yet. Be the first to answer!</div>`;
      return;
    }

    list.innerHTML = post.comments.map(c => `
      <div class="comment-card">
        <img src="${c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author}`}" class="comment-avatar" alt="Avatar">
        <div class="comment-content">
          <div class="comment-meta">
            <span class="comment-author">${c.author} <span style="font-weight:normal; font-size:0.75rem; color:var(--text-muted)">(${c.role})</span></span>
            <span style="font-size:0.7rem; color:var(--text-muted)">${formatDate(c.date)}</span>
          </div>
          <div class="comment-text">${c.content}</div>
        </div>
      </div>
    `).join('');
  }

  function handleCommentSubmit(e) {
    e.preventDefault();

    const postId = parseInt(document.getElementById('comment-post-id').value);
    const text = document.getElementById('comment-text').value.trim();

    if (!postId || !text) {
      showToast("Reply text cannot be empty.", "error");
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const user = Users[AppState.currentRole];
    const newComment = {
      id: Date.now(),
      author: user.name.split(' (')[0],
      role: AppState.currentRole === 'student' ? 'Student' : 'Alumni (Admin)',
      avatar: user.avatar,
      content: text,
      date: new Date().toISOString()
    };

    post.comments.push(newComment);
    DB.set('posts', posts);

    showToast("Reply posted successfully!", "success");
    document.getElementById('comment-text').value = '';

    // Re-render
    renderPostComments(post);
    if (AppState.currentView === 'home') {
      renderHomeView();
    } else if (AppState.currentView === 'forum') {
      renderForumView();
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  function formatDate(isoString) {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      
      // format date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  // ==================== INIT LAUNCH ====================
  document.addEventListener('DOMContentLoaded', init);

})();
