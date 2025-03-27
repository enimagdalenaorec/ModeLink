import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

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

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.sub ? Number(decodedToken.sub) : null; // extract from "sub"
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null; // Extract the role
  }
}
