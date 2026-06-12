export interface User {
  id: string;
  email: string;
}

export interface Notebook {
  id: string;
  owner_id: string;
  name: string;
  activation_code?: string;
  created_at: string;
}

export interface Note {
  id: string;
  notebook_id: string;
  title: string;
  content?: string;
  image_url?: string;
  pdf_url?: string;
  created_at: string;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  place?: string;
  created_at: string;
}
