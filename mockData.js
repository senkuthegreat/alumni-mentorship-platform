// Initial seed data for the Alumni Mentorship Platform
const initialMentors = [
  {
    id: 1,
    name: "Aarav Sharma",
    domain: "Software Engineering",
    company: "Google",
    experience: 6,
    bio: "Ex-NSUT. Specialized in scalable distributed systems, cloud computing, and backend architecture (Go/Java). Passionate about helping students break into tier-1 tech companies.",
    availability: ["Monday 4:00 PM - 6:00 PM", "Wednesday 2:00 PM - 4:00 PM"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
    rating: 4.9
  },
  {
    id: 2,
    name: "Dr. Priyamvada Sen",
    domain: "Artificial Intelligence & ML",
    company: "Meta AI",
    experience: 8,
    bio: "AI researcher focusing on Large Language Models and computer vision. Happy to discuss graduate school applications, research proposals, and machine learning career pathways.",
    availability: ["Tuesday 10:00 AM - 12:00 PM", "Thursday 3:00 PM - 5:00 PM"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priyamvada",
    rating: 5.0
  },
  {
    id: 3,
    name: "Rohan Verma",
    domain: "Product Management",
    company: "Microsoft",
    experience: 5,
    bio: "Product Lead managing cloud developer tools. Can help with transition from engineering to product management, product case study preparation, and resume reviews.",
    availability: ["Friday 3:00 PM - 6:00 PM"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    rating: 4.8
  },
  {
    id: 4,
    name: "Sneha Patel",
    domain: "UI/UX Design",
    company: "Airbnb",
    experience: 4,
    bio: "UX Designer crafting premium booking experiences. Specialized in design systems, user research, and wireframing. Let's review your design portfolio together!",
    availability: ["Wednesday 5:00 PM - 7:00 PM", "Saturday 11:00 AM - 1:00 PM"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    rating: 4.9
  },
  {
    id: 5,
    name: "Kabir Mehta",
    domain: "Data Science & Analytics",
    company: "Netflix",
    experience: 7,
    bio: "Data scientist working on recommendation engines. Skilled in Python, SQL, statistical modeling, and A/B testing. Ask me anything about data structures, analytics, and business insights.",
    availability: ["Monday 1:00 PM - 3:00 PM", "Friday 4:00 PM - 6:00 PM"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
    rating: 4.7
  }
];

const initialBookings = [
  {
    id: 1,
    mentorId: 1,
    studentName: "Aditya Roy",
    studentEmail: "aditya.roy@student.nsut.ac.in",
    purpose: "Seeking guidance on preparing for Google software engineering internship interviews and backend system design concepts.",
    date: "2026-07-13",
    timeSlot: "Monday 4:00 PM - 6:00 PM",
    status: "Approved",
    timestamp: "2026-07-06T10:30:00Z"
  },
  {
    id: 2,
    mentorId: 3,
    studentName: "Meera Nair",
    studentEmail: "meera.nair@student.nsut.ac.in",
    purpose: "Transitioning from QA to Product Management. I want to review my resume and mock-drill a product estimation case study.",
    date: "2026-07-17",
    timeSlot: "Friday 3:00 PM - 6:00 PM",
    status: "Pending",
    timestamp: "2026-07-06T12:15:00Z"
  },
  {
    id: 3,
    mentorId: 4,
    studentName: "Devansh Gupta",
    studentEmail: "devansh.gupta@student.nsut.ac.in",
    purpose: "Portfolio feedback session. I have built a design system for a fintech application and want critique on user flow.",
    date: "2026-07-15",
    timeSlot: "Wednesday 5:00 PM - 7:00 PM",
    status: "Pending",
    timestamp: "2026-07-06T13:40:00Z"
  }
];

const initialForumPosts = [
  {
    id: 1,
    title: "How to prepare for off-campus software engineering roles in 2026?",
    content: "Hi seniors, I am a pre-final year student at NSUT. With the current market scenario, what is the best strategy for off-campus applications? Should I focus more on open-source contributions, high-quality development projects, or intensive LeetCode solving? Any tips on networking on LinkedIn would also be highly appreciated!",
    category: "Career Advice",
    author: "Ishaan Goel",
    role: "Student",
    date: "2026-07-05T09:12:00Z",
    likes: 12,
    likedBy: [],
    comments: [
      {
        id: 1,
        author: "Aarav Sharma",
        role: "Alumni (Google)",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
        content: "Great question, Ishaan! Off-campus is all about standing out. A balance of DSA and 1-2 deep projects is key. For networking, send personalized notes explaining what specifically about their work interests you, or share a project feedback request. Consistency is key!",
        date: "2026-07-05T11:45:00Z"
      },
      {
        id: 2,
        author: "Rohan Verma",
        role: "Alumni (Microsoft)",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        content: "Agreed with Aarav. In addition, try to get referrals. A referral bypasses the initial resume screener. Create a single-page portfolio site showing what you built. Make it easy for recruiters.",
        date: "2026-07-05T14:20:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Which LLM specialization should a beginner choose?",
    content: "I am starting my journey in Machine Learning. There are so many domains: NLP, computer vision, reinforcement learning, LLM fine-tuning, RAG pipelines, etc. For someone targeting research or industry roles, which of these is currently most promising and has a lower entry barrier for undergraduate students?",
    category: "Tech Stack",
    author: "Riya Sen",
    role: "Student",
    date: "2026-07-04T15:30:00Z",
    likes: 8,
    likedBy: [],
    comments: [
      {
        id: 1,
        author: "Dr. Priyamvada Sen",
        role: "Alumni (Meta AI)",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priyamvada",
        content: "Hi Riya! I highly recommend starting with standard supervised ML first. Once comfortable, jump into RAG (Retrieval-Augmented Generation) and LangChain/LlamaIndex. Building practical RAG systems has a relatively low entry barrier and high industry demand right now.",
        date: "2026-07-05T08:10:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Tips on balancing academics with open source contributions?",
    content: "Hey everyone! I find it hard to manage GSOC prep, contributing to repositories, and maintaining a decent CGPA in university. Any advice on scheduling or time management techniques?",
    category: "Interview Prep",
    author: "Tushar Gupta",
    role: "Student",
    date: "2026-07-03T18:00:00Z",
    likes: 5,
    likedBy: [],
    comments: []
  }
];

// Export to window or module system so we can access them in main app
if (typeof window !== 'undefined') {
  window.initialMentors = initialMentors;
  window.initialBookings = initialBookings;
  window.initialForumPosts = initialForumPosts;
}
