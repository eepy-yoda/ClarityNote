-- Users table is handled by auth.users natively in Supabase

-- Notebooks
CREATE TABLE notebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    activation_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies for Notebooks
CREATE POLICY "Users can view their own notebooks" 
ON notebooks FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own notebooks" 
ON notebooks FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Policies for Notes
CREATE POLICY "Users can view notes of their notebooks" 
ON notes FOR SELECT 
USING (
    notebook_id IN (
        SELECT id FROM notebooks WHERE owner_id = auth.uid()
    )
);

CREATE POLICY "Users can insert notes to their notebooks" 
ON notes FOR INSERT 
WITH CHECK (
    notebook_id IN (
        SELECT id FROM notebooks WHERE owner_id = auth.uid()
    )
);

-- Policies for Events (Public read)
CREATE POLICY "Events are viewable by everyone" 
ON events FOR SELECT 
USING (true);
