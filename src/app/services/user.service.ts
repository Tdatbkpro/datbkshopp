import { Injectable } from '@angular/core';
import {provideHttpClient, HttpHeaders, HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginComponent } from '../components/login/login.component';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../enviroments/environment';
import { LoginResponse } from '../responses/user/login.response';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetails = `${environment.apiBaseUrl}/users/details`;

  private apiConfig = {
    headers: this.createHeaders()
  }
  constructor(private http : HttpClient ,
    private tokenService : TokenService
  ) { }
  private createHeaders() : HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language':'vi'
    });
  }
  register(registerDTO : RegisterDTO) : Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig)
  }
  login(loginDTO: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiLogin, loginDTO);
  }

  getUserDetail(token : string) {
    return this.http.post(this.apiUserDetails, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    })
  }
  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO) {
    debugger
    let userResponse = this.getUserFromLocalStorage();        
    return this.http.put(`${this.apiUserDetails}/${userResponse?.id}`,updateUserDTO,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUserToLoacalStorage(userResponse?: UserResponse) {
    try {
      if(userResponse == null || !userResponse){
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      localStorage.setItem('user', userResponseJSON);
      console.log("User saved to local storage")
    } catch (error) {
      console.log(error);
    }
  }
  getUserFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON) {
        const userResponse: UserResponse = JSON.parse(userResponseJSON);
        console.log("User retrieved from local storage", userResponse);
        return userResponse;
      } else {
        console.log("No user found in local storage");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      localStorage.removeItem('user');
      alert("Đăng xuất tài khoản")
    }
    catch(error) {
      alert(error);
    }
  }
  
}
