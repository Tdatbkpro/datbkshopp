import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private jwtHelperService = new JwtHelperService()
    constructor() { }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    getToken(): string | null {
        if (this.isBrowser()) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    setToken(token: string) {
        if (this.isBrowser()) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    getUserId(): number {
        const token = this.getToken();
        if (!token) {
            return 0; // Hoặc bất kỳ giá trị mặc định nào bạn muốn
        }
    
        try {
            const userObject = this.jwtHelperService.decodeToken(token);
            return userObject && 'userId' in userObject ? parseInt(userObject['userId'], 10) : 0;
        } catch (error) {
            console.error('Error decoding token:', error);
            return 0; // Hoặc bất kỳ giá trị mặc định nào bạn muốn
        }
    }
    
    removeToken() {
        if (this.isBrowser()) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }
    public isTokenExpired(): boolean {
        const token = this.getToken();
        if (token) {
          return this.jwtHelperService.isTokenExpired(token);
        }
        return true; // Nếu không có token, coi như đã hết hạn
      }
      // Lấy thời gian hết hạn của token
  public getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (token) {
      return this.jwtHelperService.getTokenExpirationDate(token);
    }
    return null;
  }
}
