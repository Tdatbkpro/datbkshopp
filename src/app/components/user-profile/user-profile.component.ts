import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { format } from 'date-fns';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'] // Sửa lại 'styleUrl' thành 'styleUrls'
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  userResponse?: UserResponse;
  token : string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', Validators.minLength(6)],
      address: ['', Validators.minLength(5)],
      password: ['', Validators.minLength(5)],
      retype_password: ['', Validators.minLength(5)],
      date_of_birth: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.token  = this.tokenService.getToken() ?? ''
    this.userService.getUserDetail(this.token).subscribe({
      
      next: (response: any) => {
        debugger
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth)
        };
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname,
          email: this.userResponse?.email ?? '',
          address: this.userResponse?.address,
          phone_number: this.userResponse?.phone_number,
          date_of_birth: format(new Date(this.userResponse?.date_of_birth || ''), 'yyyy-MM-dd'), // Định dạng ngày tháng
        });

        this.userService.saveUserToLoacalStorage(this.userResponse)
      },
      complete: () => {

      }
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypedPassword = formGroup.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }
  
      return null;
    };
  }
  save(): void {
    debugger
    if (!this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        email: this.userProfileForm.get('email')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };
  
      this.userService.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            debugger
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            alert('Cập nhật thành công')
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            alert(error.error.message);
          }
        });
    } 
     else if (this.userProfileForm.hasError('passwordMismatch')) {        
        alert('Mật khẩu và mật khẩu gõ lại chưa chính xác')
      }
    
  }    
}

