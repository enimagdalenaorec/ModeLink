import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt'; // Key for storing JWT in localStorage

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Save JWT token in localStorage
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Retrieve JWT token from localStorage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Remove JWT token from localStorage (logout)
  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // returns true if token exists
  }

  getUserId(): number | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.sub ? Number(decodedToken.sub) : null; // Extract user ID from "sub"
  }

  getUserRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null; // Extract the role
  }
}
