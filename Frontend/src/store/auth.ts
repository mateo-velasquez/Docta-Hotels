import { atom } from 'nanostores';

export interface User {
  id: number | string;
  email: string;
  name?: string;
  last_name?: string;
  role?: 'user' | 'admin';
}

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const $token = atom<string | null>(getInitialToken());
export const $user = atom<User | null>(getInitialUser());

export const loginStore = (token: string, user: User) => {
  $token.set(token);
  $user.set(user);
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const logoutStore = () => {
  $token.set(null);
  $user.set(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
