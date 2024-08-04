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
        debugger
        const token = this.tokenService.getToken();
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        console.log(req.headers.get('Authorization')); // Kiểm tra tiêu đề yêu cầu
        return next.handle(req);
    }
}
