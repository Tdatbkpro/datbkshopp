import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiGetRoles = `${environment.apiBaseUrl}/roles`;

  constructor(private http : HttpClient) { }
  
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiGetRoles);
  }
}
