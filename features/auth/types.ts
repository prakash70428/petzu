export interface User {
  name: string;
  email: string;
  bio?: string;
  initials: string;
  memberSince: string;
}

export interface Session {
  isAuthenticated: boolean;
  user: User | null;
}
