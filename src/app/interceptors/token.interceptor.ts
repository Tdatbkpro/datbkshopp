import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";

@Injectable({
    providedIn: 'root'
})

export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req; // Khởi tạo biến yêu cầu mới
        const token = this.tokenService.getToken(); // Lấy token từ service
        if (token) {
            authReq = req.clone({ // Clone yêu cầu và thêm header Authorization
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        console.log('Request Headers:', authReq.headers.keys()); // Kiểm tra các header được thêm vào
        return next.handle(authReq); 
    }
}
