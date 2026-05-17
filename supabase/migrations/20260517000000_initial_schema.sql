-- 🌀 NihongoRoute - Database Migration
-- Generated based on current Supabase state as of May 2026

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLES ──────────────────────────────────────────────────────────────────

-- 1. Course Categories
CREATE TABLE public.course_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    order_number integer DEFAULT 0,
    type text,
    description text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Profiles (Extends auth.users)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    xp integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    streak integer DEFAULT 0 NOT NULL,
    today_review_count integer DEFAULT 0 NOT NULL,
    last_study_date text,
    study_days jsonb DEFAULT '{}'::jsonb NOT NULL,
    inventory jsonb DEFAULT '{"streakFreeze": 0}'::jsonb NOT NULL,
    settings jsonb DEFAULT '{"notificationsEnabled": false}'::jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Kanji Library
CREATE TABLE public.kanji (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    character text NOT NULL UNIQUE,
    meaning text NOT NULL,
    onyomi text,
    kunyomi text,
    romaji text,
    jlpt_level varchar,
    grade_level text,
    stroke_order_svg text,
    radicals jsonb DEFAULT '[]'::jsonb,
    mnemonics jsonb DEFAULT '[]'::jsonb,
    examples jsonb DEFAULT '[]'::jsonb,
    show_in_flashcard boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Vocab Library
CREATE TABLE public.vocab (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    word text NOT NULL,
    furigana text,
    romaji text,
    hinshi jsonb DEFAULT '[]'::jsonb,
    transitivity text,
    meanings_jmdict jsonb DEFAULT '[]'::jsonb,
    conjugations jsonb DEFAULT '{}'::jsonb,
    is_common boolean DEFAULT false,
    slug text NOT NULL UNIQUE,
    meaning_id text,
    jlpt_level varchar,
    pitch_accent text,
    audio_url text,
    usage_notes text,
    mnemonic text,
    related_kanji jsonb DEFAULT '[]'::jsonb,
    synonyms jsonb DEFAULT '[]'::jsonb,
    antonyms jsonb DEFAULT '[]'::jsonb,
    examples jsonb DEFAULT '[]'::jsonb,
    show_in_flashcard boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Grammar Library
CREATE TABLE public.grammar (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    meaning text NOT NULL,
    formation text,
    formation_furigana text,
    formation_romaji text,
    notes text,
    jlpt_level varchar,
    slug text NOT NULL UNIQUE,
    examples jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Lessons
CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid REFERENCES public.course_categories(id),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    order_number integer DEFAULT 0,
    summary text,
    content_blocks jsonb DEFAULT '[]'::jsonb,
    vocab_list jsonb DEFAULT '[]'::jsonb,
    kanji_list jsonb DEFAULT '[]'::jsonb,
    grammar_list jsonb DEFAULT '[]'::jsonb,
    listening_list jsonb DEFAULT '[]'::jsonb,
    reading_list jsonb DEFAULT '[]'::jsonb,
    quizzes jsonb DEFAULT '[]'::jsonb,
    estimated_minutes integer DEFAULT 5,
    is_premium boolean DEFAULT false,
    is_published boolean DEFAULT false,
    seo jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Reading Materials
CREATE TABLE public.reading_material (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    difficulty varchar,
    estimated_minutes integer DEFAULT 5,
    body text NOT NULL,
    translation text,
    jlpt_level varchar,
    hiragana text,
    audio_url text,
    seo jsonb,
    image_url text,
    video_url text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Listening Materials
CREATE TABLE public.listening_material (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    difficulty varchar,
    audio_url text,
    body text NOT NULL,
    translation text,
    jlpt_level varchar,
    hiragana text,
    seo jsonb,
    estimated_minutes integer,
    image_url text,
    video_url text,
    created_at timestamptz DEFAULT now()
);

-- 9. User SRS Data
CREATE TABLE public.user_srs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id text NOT NULL,
    interval integer DEFAULT 1 NOT NULL,
    repetition integer DEFAULT 0 NOT NULL,
    ease_factor real DEFAULT 2.5 NOT NULL,
    next_review timestamptz,
    status text DEFAULT 'learning' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(user_id, word_id)
);

-- 10. User Lesson Progress
CREATE TABLE public.user_lessons (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id text NOT NULL,
    is_completed boolean DEFAULT true NOT NULL,
    completed_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, lesson_id)
);

-- 11. Exams
CREATE TABLE public.exams (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid REFERENCES public.course_categories(id),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    time_limit integer DEFAULT 60 NOT NULL,
    questions jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_published boolean DEFAULT false,
    passing_score integer DEFAULT 80,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 12. Cheatsheets
CREATE TABLE public.cheatsheets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    category text,
    items jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 13. User Feedback
CREATE TABLE public.user_feedback (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    type text NOT NULL CHECK (type = ANY (ARRAY['bug'::text, 'suggestion'::text, 'compliment'::text])),
    message text NOT NULL,
    route text,
    created_at timestamptz DEFAULT now()
);

-- ─── FUNCTIONS ──────────────────────────────────────────────────────────────

-- 1. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Set Updated At (Legacy Name)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Profile Integrity Validator
CREATE OR REPLACE FUNCTION public.validate_profile_integrity()
RETURNS trigger AS $$
BEGIN
  NEW.level := floor(sqrt(NEW.xp / 50)) + 1;
  IF NEW.level > 100 THEN NEW.level := 100; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. SRS Logic Protector
CREATE OR REPLACE FUNCTION public.protect_srs_logic()
RETURNS trigger AS $$
BEGIN
  IF NEW.ease_factor < 1.3 THEN NEW.ease_factor := 1.3;
  ELSIF NEW.ease_factor > 5.0 THEN NEW.ease_factor := 5.0;
  END IF;
  IF NEW.interval < 1 THEN NEW.interval := 1; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. New User Handler (Triggered by auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, xp, level, settings)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    0,
    1,
    '{"notificationsEnabled": false}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. MAIN SYNC RPC (sync_user_progress)
CREATE OR REPLACE FUNCTION public.sync_user_progress(
    p_full_name text, 
    p_xp integer, 
    p_streak integer, 
    p_today_review_count integer, 
    p_last_study_date text, 
    p_study_days jsonb, 
    p_inventory jsonb, 
    p_settings jsonb, 
    p_srs_updates jsonb, 
    p_lesson_updates jsonb DEFAULT '[]'::jsonb
)
RETURNS jsonb AS $$
DECLARE
  v_user_id UUID;
  v_item JSONB;
  v_old_xp INTEGER;
  v_delta_xp INTEGER;
  v_max_plausible_xp INTEGER;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get current XP from DB
  SELECT xp INTO v_old_xp FROM public.profiles WHERE id = v_user_id;
  
  v_delta_xp := COALESCE(p_xp, 0) - COALESCE(v_old_xp, 0);
  
  -- Anti-Cheat: Never allow XP to decrease
  IF v_delta_xp < 0 THEN v_delta_xp := 0; END IF;

  -- Cap XP gain
  v_max_plausible_xp := (jsonb_array_length(COALESCE(p_srs_updates, '[]'::jsonb)) * 15) + 
                        (jsonb_array_length(COALESCE(p_lesson_updates, '[]'::jsonb)) * 100) + 200;
  
  IF v_delta_xp > v_max_plausible_xp THEN
    v_delta_xp := v_max_plausible_xp;
  END IF;

  -- 1. Update Profile
  UPDATE public.profiles
  SET 
    full_name = p_full_name,
    xp = COALESCE(v_old_xp, 0) + v_delta_xp,
    streak = p_streak,
    today_review_count = p_today_review_count,
    last_study_date = p_last_study_date,
    study_days = p_study_days,
    inventory = p_inventory,
    settings = p_settings,
    updated_at = now()
  WHERE id = v_user_id;

  -- 2. Bulk Upsert SRS
  IF p_srs_updates IS NOT NULL THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_srs_updates)
    LOOP
      IF (v_item->>'is_deleted')::BOOLEAN = true THEN
        DELETE FROM public.user_srs 
        WHERE user_id = v_user_id AND word_id = v_item->>'word_id';
      ELSE
        INSERT INTO public.user_srs (
          user_id, word_id, repetition, interval, ease_factor, next_review, status, updated_at
        ) VALUES (
          v_user_id,
          v_item->>'word_id',
          (v_item->>'repetition')::INTEGER,
          (v_item->>'interval')::INTEGER,
          (v_item->>'ease_factor')::REAL,
          (v_item->>'next_review')::TIMESTAMPTZ,
          COALESCE(v_item->>'status', 'learning'),
          COALESCE((v_item->>'updated_at')::TIMESTAMPTZ, now())
        )
        ON CONFLICT (user_id, word_id) 
        DO UPDATE SET
          repetition = EXCLUDED.repetition,
          interval = EXCLUDED.interval,
          ease_factor = EXCLUDED.ease_factor,
          next_review = EXCLUDED.next_review,
          status = EXCLUDED.status,
          updated_at = EXCLUDED.updated_at
        WHERE user_srs.updated_at < EXCLUDED.updated_at;
      END IF;
    END LOOP;
  END IF;

  -- 3. Bulk Upsert Lesson Progress
  IF p_lesson_updates IS NOT NULL THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_lesson_updates)
    LOOP
      IF (v_item->>'is_deleted')::BOOLEAN = true THEN
        DELETE FROM public.user_lessons 
        WHERE user_id = v_user_id AND lesson_id = v_item->>'lesson_id';
      ELSE
        INSERT INTO public.user_lessons (
          user_id, lesson_id, is_completed, completed_at, updated_at
        ) VALUES (
          v_user_id,
          v_item->>'lesson_id',
          COALESCE((v_item->>'is_completed')::BOOLEAN, true),
          COALESCE((v_item->>'completed_at')::TIMESTAMPTZ, now()),
          COALESCE((v_item->>'updated_at')::TIMESTAMPTZ, now())
        )
        ON CONFLICT (user_id, lesson_id) 
        DO UPDATE SET
          is_completed = EXCLUDED.is_completed,
          completed_at = EXCLUDED.completed_at,
          updated_at = EXCLUDED.updated_at
        WHERE user_lessons.updated_at < EXCLUDED.updated_at;
      END IF;
    END LOOP;
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- ─── TRIGGERS ───────────────────────────────────────────────────────────────

-- Profiles
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_validate_profile_integrity BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION validate_profile_integrity();

-- User SRS
CREATE TRIGGER set_user_srs_updated_at BEFORE UPDATE ON public.user_srs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER user_srs_updated_at BEFORE UPDATE ON public.user_srs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_protect_srs_logic BEFORE INSERT OR UPDATE ON public.user_srs FOR EACH ROW EXECUTE FUNCTION protect_srs_logic();

-- Exams
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── RLS POLICIES ────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_srs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanji ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cheatsheets ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User SRS Policies
CREATE POLICY "Users can view their own SRS data" ON public.user_srs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own SRS data" ON public.user_srs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own SRS data" ON public.user_srs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own SRS data" ON public.user_srs FOR DELETE USING (auth.uid() = user_id);

-- User Lessons Policies
CREATE POLICY "Users can manage own lesson progress" ON public.user_lessons FOR ALL USING (auth.uid() = user_id);

-- Library Policies (Public Read)
CREATE POLICY "Allow public read access for library categories" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access for kanji" ON public.kanji FOR SELECT USING (true);
CREATE POLICY "Allow public read access for vocab" ON public.vocab FOR SELECT USING (true);
CREATE POLICY "Allow public read access for grammar" ON public.grammar FOR SELECT USING (true);
CREATE POLICY "Allow public read access for lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow public read access for reading" ON public.reading_material FOR SELECT USING (true);
CREATE POLICY "Allow public read access for listening" ON public.listening_material FOR SELECT USING (true);
CREATE POLICY "Allow public read access for exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Allow public read access for cheatsheets" ON public.cheatsheets FOR SELECT USING (true);

-- Feedback Policies
CREATE POLICY "Users can insert own feedback" ON public.user_feedback FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));
CREATE POLICY "Only admins can view feedback" ON public.user_feedback FOR SELECT USING (false);
