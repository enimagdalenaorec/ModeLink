import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt'; // Key for storing JWT in localStorage

  constructor() {}

  // save JWT token in localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // retrieve JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // remove JWT token from localStorage (logout)
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // returns true if token exists
  }
}
