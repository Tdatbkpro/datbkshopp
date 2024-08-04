import { Component, OnInit } from '@angular/core';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponse } from '../../responses/user/login.response';
import { Role } from '../../models/role';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { HostListener } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { CartItemrDTO } from '../../dtos/order/cart.item.dto';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  phoneNumber: string = '';
  password: string = '';
  userResponse?: UserResponse

  roles: Role[] = [];
  rememberMe: boolean = true;
  showPassword: boolean = false;
  selectedRole: Role | undefined;


  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService : CartService
  ) {}

  ngOnInit() {
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        //debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        //debugger
        console.error('Error fetching roles:', error);
        alert(`Chọn quyền đăng nhập thất bại: ${JSON.stringify(error.error)}`);
      }
    });
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  login() {
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    //alert(message);
    debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };
      this.userService.login(loginDTO).subscribe({
        next: (response: LoginResponse) => {
          debugger;
          const { token } = response;
          if (this.rememberMe) {          
            this.tokenService.setToken(token);
            debugger;
            this.userService.getUserDetail(token).subscribe({
              next: (response: any) => {
                debugger
                this.userResponse = {
                  ...response,
                  date_of_birth: new Date(response.date_of_birth),
                };    
                this.userService.saveUserToLoacalStorage(this.userResponse); 
                if(this.userResponse?.role.name == 'ADMIN') {
                  this.router.navigate(['/admin']);    
                } else if(this.userResponse?.role.name == 'USER') {
                  this.router.navigate(['/']);                      
                }
                
              },
              complete: () => {
                this.cartService.refreshCart();
                alert(`Bạn đăng nhập thành công với Số điện thoại ${this.phoneNumber} , mật khẩu ${this.password} và Quyền đăng nhập mặc định là ${this.userResponse?.role.name} `)
                debugger;
              },
              error: (error: any) => {
                debugger;
                alert(error.error.message);
              }
            })
          }                        
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error.message);
        }
      });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  checkBox() {
    this.rememberMe = !(this.rememberMe);
  }
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    
  }
}
