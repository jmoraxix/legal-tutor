-- Create feedback table
CREATE TABLE public.user_feedback (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for user_feedback
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for user_feedback
CREATE POLICY "Users can view their own feedback"
  ON public.user_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
  ON public.user_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Anonymous users can also submit feedback (need separate policy)
CREATE POLICY "Anonymous users can submit feedback"
  ON public.user_feedback FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Admin policy for managing feedback (would be restricted by Supabase roles)
CREATE POLICY "Admins can manage all feedback"
  ON public.user_feedback 
  USING (true);
