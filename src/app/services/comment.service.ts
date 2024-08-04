import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentResponse } from '../responses/comment/commet.response';
import { CommentDTO } from '../dtos/comment/comment.dto';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiBaseUrl}/comments`; // Cập nhật URL của API

  constructor(private http: HttpClient) { }

  getCommentsByProduct(productId: number): Observable<CommentResponse[]> {
    const url = `${this.apiUrl}?product_id=${productId}`;
    return this.http.get<CommentResponse[]>(url);
  }

  getCommentsByUserAndProduct(userId: number, productId: number): Observable<CommentResponse[]> {
    const url = `${this.apiUrl}?user_id=${userId}&product_id=${productId}`;
    return this.http.get<CommentResponse[]>(url);
  }

  updateComment(commentId: number, commentDTO: CommentDTO): Observable<any> {
    const url = `${this.apiUrl}/${commentId}`;
    return this.http.put(url, commentDTO);
  }

  insertComment(commentDTO: CommentDTO): Observable<any> {
    return this.http.post(this.apiUrl, commentDTO);
  }
  deleteComment(commentId: number): Observable<any> {
    const url = `${this.apiUrl}/${commentId}`;
    return this.http.delete(url);
  }
}
