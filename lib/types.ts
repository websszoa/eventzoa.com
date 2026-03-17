// 프로필 타입
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  signup_provider: string;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
