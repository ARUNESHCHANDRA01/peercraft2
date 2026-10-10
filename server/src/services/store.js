import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial demonstration data (explicitly labeled as demonstration campus records)
const initialSeedData = {
  students: [
    {
      id: 'stu-101',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: 'Tech University',
      major: 'Computer Science',
      year: '3rd Year',
      bio: 'Full-stack developer passionate about building resilient React applications and AI agent workflows.',
      skills: ['React', 'Node.js', 'Express', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      skillProficiencies: {
        'React': 92,
        'Node.js': 88,
        'Express': 85,
        'TypeScript': 80,
        'PostgreSQL': 75,
      },
      preferredRoles: ['Full-stack Developer', 'Frontend Lead'],
      interests: ['AI Tools', 'Open Source', 'Hackathons', 'Cloud Architecture'],
      availability: '15 hrs/week (Evenings & Weekends)',
      github: 'https://github.com/aarav-dev',
      portfolio: 'https://aarav.dev',
      campusCredits: 240,
      reputationScore: 4.9,
      collaborationsCompleted: 6,
      joinedAt: '2025-08-15T10:00:00.000Z',
    },
    {
      id: 'stu-102',
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      university: 'Tech University',
      major: 'Artificial Intelligence & Data',
      year: '4th Year',
      bio: 'Machine learning specialist focused on LLM orchestration, RAG pipelines, and NLP applications.',
      skills: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'Dify', 'Vector DBs'],
      skillProficiencies: {
        'Python': 95,
        'PyTorch': 85,
        'FastAPI': 90,
        'LangChain': 82,
        'Dify': 88,
      },
      preferredRoles: ['AI Engineer', 'ML Specialist', 'Backend Developer'],
      interests: ['Generative AI', 'Agent Workflows', 'Computer Vision', 'Research'],
      availability: '20 hrs/week (Flexible)',
      github: 'https://github.com/sneha-ai',
      portfolio: 'https://sneha-patel.io',
      campusCredits: 380,
      reputationScore: 4.95,
      collaborationsCompleted: 9,
      joinedAt: '2025-07-20T10:00:00.000Z',
    },
    {
      id: 'stu-103',
      name: 'Rohan Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'Tech University',
      major: 'Software Engineering',
      year: '2nd Year',
      bio: 'UI/UX designer turned frontend enthusiast. Love building fluid animations and accessible interfaces.',
      skills: ['Figma', 'React', 'CSS3', 'Next.js', 'UI/UX Design', 'Motion Graphics'],
      skillProficiencies: {
        'Figma': 94,
        'React': 78,
        'CSS3': 90,
        'UI/UX Design': 92,
      },
      preferredRoles: ['UI/UX Designer', 'Frontend Developer'],
      interests: ['Design Systems', 'Micro-interactions', 'Product Design'],
      availability: '10 hrs/week (Weekends)',
      github: 'https://github.com/rohan-designs',
      portfolio: 'https://rohanverma.design',
      campusCredits: 150,
      reputationScore: 4.8,
      collaborationsCompleted: 4,
      joinedAt: '2025-09-01T10:00:00.000Z',
    },
    {
      id: 'stu-104',
      name: 'Ananya Iyer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      university: 'Tech University',
      major: 'Computer Systems & Networks',
      year: '3rd Year',
      bio: 'Cloud architecture and DevOps tinkerer. Automated CI/CD pipelines, Docker, Kubernetes, and Go.',
      skills: ['Docker', 'Kubernetes', 'Go', 'AWS', 'Linux', 'Node.js'],
      skillProficiencies: {
        'Docker': 88,
        'Go': 80,
        'AWS': 76,
        'Linux': 92,
      },
      preferredRoles: ['DevOps Engineer', 'Cloud Architect', 'Backend Developer'],
      interests: ['Kubernetes', 'Cloud Security', 'Distributed Systems'],
      availability: '12 hrs/week (Weekday evenings)',
      github: 'https://github.com/ananya-cloud',
      portfolio: 'https://ananya-iyer.com',
      campusCredits: 210,
      reputationScore: 4.85,
      collaborationsCompleted: 5,
      joinedAt: '2025-08-25T10:00:00.000Z',
    },
    {
      id: 'stu-105',
      name: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      university: 'Tech University',
      major: 'Mobile Applications',
      year: '3rd Year',
      bio: 'Mobile application developer with Flutter and React Native experience. Building sleek cross-platform apps.',
      skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'REST APIs'],
      skillProficiencies: {
        'Flutter': 90,
        'Dart': 88,
        'React Native': 75,
        'Firebase': 82,
      },
      preferredRoles: ['Mobile Developer', 'Frontend Developer'],
      interests: ['Mobile UX', 'Offline-First Apps', 'Bluetooth IoT'],
      availability: '15 hrs/week (Flexible)',
      github: 'https://github.com/vikram-mobile',
      portfolio: 'https://vikramsingh.dev',
      campusCredits: 180,
      reputationScore: 4.75,
      collaborationsCompleted: 3,
      joinedAt: '2025-09-10T10:00:00.000Z',
    },
  ],
  resources: [
    {
      id: 'res-201',
      title: 'Complete Distributed Systems Exam Cheat Sheet',
      description: 'Concise summary of Raft consensus, CAP theorem, Vector Clocks, Byzantine Fault Tolerance, and 2-phase commit with diagrams.',
      category: 'Exam Prep',
      tags: ['Distributed Systems', 'Raft', 'Consensus', 'Architecture'],
      authorId: 'stu-104',
      authorName: 'Ananya Iyer',
      downloads: 142,
      upvotes: 38,
      creditsReward: 15,
      fileUrl: '#',
      fileType: 'PDF Document (4.2 MB)',
      createdAt: '2026-09-12T14:30:00.000Z',
    },
    {
      id: 'res-202',
      title: 'Dify AI Workflow Blueprint & Prompt Templates',
      description: 'Production-ready workflow templates for LLM agents, knowledge retrieval setup, and code node data transformations.',
      category: 'Code Templates',
      tags: ['Dify', 'AI Agents', 'Prompt Engineering', 'Workflows'],
      authorId: 'stu-102',
      authorName: 'Sneha Patel',
      downloads: 215,
      upvotes: 64,
      creditsReward: 20,
      fileUrl: '#',
      fileType: 'JSON Workflow (120 KB)',
      createdAt: '2026-09-20T09:15:00.000Z',
    },
    {
      id: 'res-203',
      title: 'Modern React 19 & Tailwind Design System Starter',
      description: 'Production component tokens, accessible modals, responsive drawers, and glassmorphism styling presets.',
      category: 'Design Systems',
      tags: ['React', 'CSS', 'Design System', 'UI Components'],
      authorId: 'stu-103',
      authorName: 'Rohan Verma',
      downloads: 189,
      upvotes: 51,
      creditsReward: 15,
      fileUrl: '#',
      fileType: 'ZIP Archive (1.8 MB)',
      createdAt: '2026-09-28T16:00:00.000Z',
    },
    {
      id: 'res-204',
      title: 'Full-Stack Express & PostgreSQL Security Checklist',
      description: 'Hardening guide covering CORS, rate limiting, SQL injection defense, parameterized queries, and auth token rotation.',
      category: 'Course Notes',
      tags: ['Security', 'Node.js', 'Express', 'PostgreSQL'],
      authorId: 'stu-101',
      authorName: 'Aarav Sharma',
      downloads: 98,
      upvotes: 29,
      creditsReward: 15,
      fileUrl: '#',
      fileType: 'Markdown Guide (45 KB)',
      createdAt: '2026-10-02T11:20:00.000Z',
    },
  ],
  creditTransactions: [
    {
      id: 'tx-301',
      studentId: 'stu-101',
      amount: 50,
      type: 'EARN',
      category: 'PLATFORM_WELCOME',
      description: 'Welcome bonus for joining PeerCraft campus community',
      idempotencyKey: 'welcome-stu-101',
      status: 'CONFIRMED',
      timestamp: '2025-08-15T10:00:00.000Z',
    },
    {
      id: 'tx-302',
      studentId: 'stu-101',
      amount: 150,
      type: 'EARN',
      category: 'COLLABORATION_MILESTONE',
      description: 'Successfully completed Campus Portal project milestone as Full-stack Lead',
      idempotencyKey: 'milestone-proj-1',
      status: 'CONFIRMED',
      timestamp: '2026-09-01T15:00:00.000Z',
    },
    {
      id: 'tx-303',
      studentId: 'stu-101',
      amount: 40,
      type: 'EARN',
      category: 'RESOURCE_CONTRIBUTION',
      description: 'Shared Full-Stack Express & PostgreSQL Security Checklist',
      idempotencyKey: 'res-tx-204',
      status: 'CONFIRMED',
      timestamp: '2026-10-02T11:20:00.000Z',
    },
  ],
  reputationReviews: [
    {
      id: 'rev-401',
      reviewerId: 'stu-102',
      reviewerName: 'Sneha Patel',
      recipientId: 'stu-101',
      projectTitle: 'PeerCollab Hackathon Project',
      rating: 5,
      comment: 'Aarav is an exceptional teammate! Kept clean code structure, delivered the React frontend ahead of deadline, and helped debug backend issues.',
      verifiedMilestone: 'Hackathon Submission Milestone',
      timestamp: '2026-09-05T18:30:00.000Z',
    },
    {
      id: 'rev-402',
      reviewerId: 'stu-103',
      reviewerName: 'Rohan Verma',
      recipientId: 'stu-101',
      projectTitle: 'Campus Notes App',
      rating: 4.8,
      comment: 'Very communicative and receptive to UI feedback. Great collaboration experience!',
      verifiedMilestone: 'Sprint 2 Milestone',
      timestamp: '2026-09-18T12:00:00.000Z',
    },
  ],
};

class Store {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[Store] Warning: Could not read existing store file. Re-initializing with seed data.', err.message);
    }
    // Write seed data if not present
    this.saveData(initialSeedData);
    return JSON.parse(JSON.stringify(initialSeedData));
  }

  saveData(data = this.data) {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Error writing to store file:', err.message);
    }
  }

  // --- Students ---
  getStudents() {
    return this.data.students || [];
  }

  getStudentById(id) {
    return this.data.students.find((s) => s.id === id) || null;
  }

  updateStudent(id, updates) {
    const index = this.data.students.findIndex((s) => s.id === id);
    if (index === -1) return null;

    // Filter allowed fields
    const allowed = ['bio', 'skills', 'skillProficiencies', 'preferredRoles', 'interests', 'availability', 'portfolio', 'github'];
    const sanitized = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }

    this.data.students[index] = {
      ...this.data.students[index],
      ...sanitized,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.students[index];
  }

  // --- Resources ---
  getResources(filters = {}) {
    let list = [...(this.data.resources || [])];
    if (filters.category && filters.category !== 'All') {
      list = list.filter((r) => r.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getResourceById(id) {
    return this.data.resources.find((r) => r.id === id) || null;
  }

  createResource({ title, description, category, tags, authorId, authorName, fileType = 'Resource Document' }) {
    const newId = `res-${Date.now()}`;
    const resource = {
      id: newId,
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [tags],
      authorId,
      authorName,
      downloads: 0,
      upvotes: 0,
      creditsReward: 15,
      fileUrl: '#',
      fileType,
      createdAt: new Date().toISOString(),
    };

    this.data.resources.push(resource);

    // Automatically award campus credits for resource contribution (+15)
    this.recordCreditTransaction({
      studentId: authorId,
      amount: 15,
      type: 'EARN',
      category: 'RESOURCE_CONTRIBUTION',
      description: `Contributed resource: "${title}"`,
      idempotencyKey: `res-earn-${newId}`,
    });

    this.saveData();
    return resource;
  }

  upvoteResource(id) {
    const res = this.data.resources.find((r) => r.id === id);
    if (!res) return null;
    res.upvotes = (res.upvotes || 0) + 1;
    this.saveData();
    return res;
  }

  downloadResource(id) {
    const res = this.data.resources.find((r) => r.id === id);
    if (!res) return null;
    res.downloads = (res.downloads || 0) + 1;
    this.saveData();
    return res;
  }

  // --- Credits & Ledger ---
  getCreditBalance(studentId) {
    const student = this.getStudentById(studentId);
    if (!student) return null;
    return {
      studentId,
      balance: student.campusCredits || 0,
      studentName: student.name,
    };
  }

  getCreditLedger(studentId) {
    return (this.data.creditTransactions || [])
      .filter((tx) => tx.studentId === studentId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  recordCreditTransaction({ studentId, amount, type, category, description, idempotencyKey }) {
    const student = this.getStudentById(studentId);
    if (!student) {
      throw new Error(`Student ${studentId} not found`);
    }

    if (amount <= 0) {
      throw new Error('Transaction amount must be strictly positive');
    }

    // Check idempotency
    if (idempotencyKey) {
      const existing = (this.data.creditTransactions || []).find(
        (tx) => tx.idempotencyKey === idempotencyKey
      );
      if (existing) {
        return { transaction: existing, duplicate: true };
      }
    }

    // Verify sufficient balance for spending
    if (type === 'SPEND' && (student.campusCredits || 0) < amount) {
      throw new Error(`Insufficient campus credits balance. Available: ${student.campusCredits || 0}, Requested: ${amount}`);
    }

    // Mutate balance
    const newBalance = type === 'EARN'
      ? (student.campusCredits || 0) + amount
      : (student.campusCredits || 0) - amount;

    student.campusCredits = newBalance;

    const transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId,
      amount,
      type,
      category,
      description,
      idempotencyKey: idempotencyKey || null,
      status: 'CONFIRMED',
      timestamp: new Date().toISOString(),
    };

    if (!this.data.creditTransactions) {
      this.data.creditTransactions = [];
    }
    this.data.creditTransactions.push(transaction);
    this.saveData();

    return { transaction, duplicate: false, newBalance };
  }

  // --- Trust & Reputation ---
  getReputation(studentId) {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const reviews = (this.data.reputationReviews || []).filter((r) => r.recipientId === studentId);
    return {
      studentId,
      studentName: student.name,
      reputationScore: student.reputationScore || 5.0,
      collaborationsCompleted: student.collaborationsCompleted || 0,
      totalReviews: reviews.length,
      reviews: reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    };
  }

  submitPeerReview({ reviewerId, recipientId, projectTitle, rating, comment, verifiedMilestone }) {
    if (reviewerId === recipientId) {
      throw new Error('Self-awarded peer reviews are forbidden');
    }

    const reviewer = this.getStudentById(reviewerId);
    const recipient = this.getStudentById(recipientId);

    if (!reviewer || !recipient) {
      throw new Error('Both reviewer and recipient must be valid registered students');
    }

    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new Error('Rating must be a numeric score between 1 and 5');
    }

    const review = {
      id: `rev-${Date.now()}`,
      reviewerId,
      reviewerName: reviewer.name,
      recipientId,
      projectTitle,
      rating: Math.round(parsedRating * 10) / 10,
      comment: comment.trim(),
      verifiedMilestone: verifiedMilestone || 'Completed Collaboration',
      timestamp: new Date().toISOString(),
    };

    if (!this.data.reputationReviews) {
      this.data.reputationReviews = [];
    }
    this.data.reputationReviews.push(review);

    // Recompute recipient's weighted reputation score
    const allReviews = this.data.reputationReviews.filter((r) => r.recipientId === recipientId);
    const sumRatings = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = Math.round((sumRatings / allReviews.length) * 100) / 100;

    recipient.reputationScore = avgRating;
    recipient.collaborationsCompleted = (recipient.collaborationsCompleted || 0) + 1;

    // Award +25 campus credits to recipient for successfully verified peer collaboration!
    this.recordCreditTransaction({
      studentId: recipientId,
      amount: 25,
      type: 'EARN',
      category: 'PEER_REVIEW_MILESTONE',
      description: `Earned for verified peer review on project "${projectTitle}"`,
      idempotencyKey: `review-earn-${review.id}`,
    });

    this.saveData();
    return review;
  }
}

export const store = new Store();
