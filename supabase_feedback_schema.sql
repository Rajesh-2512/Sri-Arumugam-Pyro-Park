-- ==========================================
-- SQL Migration Script: Create Feedbacks Table
-- Run this in your Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone_or_order TEXT,
    rating INTEGER NOT NULL DEFAULT 5,
    message TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Allow public insert feedbacks" ON public.feedbacks
    FOR INSERT WITH CHECK (true);

-- Allow public to read approved feedbacks
CREATE POLICY "Allow public read approved feedbacks" ON public.feedbacks
    FOR SELECT USING (is_approved = true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON public.feedbacks
    USING (true) WITH CHECK (true);
