-- =====================================================================
-- PeerCraft — Production PostgreSQL / Supabase Schema (Migration 001)
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_number VARCHAR(64) UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  university VARCHAR(255) NOT NULL DEFAULT 'Tech University',
  major VARCHAR(255) NOT NULL,
  year_of_study VARCHAR(64) NOT NULL,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  skill_proficiencies JSONB DEFAULT '{}'::jsonb,
  preferred_roles TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  availability VARCHAR(128) NOT NULL DEFAULT 'Flexible',
  github_url TEXT,
  portfolio_url TEXT,
  campus_credits INTEGER NOT NULL DEFAULT 50 CHECK (campus_credits >= 0),
  reputation_score NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (reputation_score >= 1.00 AND reputation_score <= 5.00),
  collaborations_completed INTEGER NOT NULL DEFAULT 0 CHECK (collaborations_completed >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(128) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  downloads_count INTEGER NOT NULL DEFAULT 0 CHECK (downloads_count >= 0),
  upvotes_count INTEGER NOT NULL DEFAULT 0 CHECK (upvotes_count >= 0),
  credit_reward INTEGER NOT NULL DEFAULT 15 CHECK (credit_reward >= 0),
  file_url TEXT NOT NULL,
  file_type VARCHAR(128) NOT NULL DEFAULT 'Document',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CAMPUS CREDIT TRANSACTIONS (Auditable Ledger)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  transaction_type VARCHAR(16) NOT NULL CHECK (transaction_type IN ('EARN', 'SPEND')),
  category VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  idempotency_key VARCHAR(128) UNIQUE,
  status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'REVERSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. REPUTATION REVIEWS (Peer feedback & milestones)
CREATE TABLE IF NOT EXISTS reputation_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  recipient_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_title VARCHAR(255) NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  comment TEXT NOT NULL,
  verified_milestone VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_no_self_review CHECK (reviewer_id <> recipient_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_students_skills ON students USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_student ON credit_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_idempotency ON credit_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_recipient ON reputation_reviews(recipient_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_reviews ENABLE ROW LEVEL SECURITY;

-- Note: In production Supabase setup, grant authenticated users select on public profiles
-- and restrict update to auth.uid() = id.
