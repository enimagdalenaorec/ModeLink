import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Adjust the import path as necessary

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get token from localStorage
    const token = this.authService.getToken();

    // check if this is a request to an external API (like Nominatim)
    const isExternalApi = req.url.includes('nominatim.openstreetmap.org') ||
                         req.url.includes('openstreetmap.org') ||
                         req.url.startsWith('https://nominatim');

    if (token && !isExternalApi) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
