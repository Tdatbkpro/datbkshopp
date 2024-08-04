import { Component, ViewChild } from '@angular/core';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword: boolean = false;
  showPasswordR: boolean = false;
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  isPhoneInvalid: boolean;
  email: string = '';
  roleId : number = 1;

  constructor(private userService : UserService, private router: Router) {
    this.isPhoneInvalid = false;
    this.phoneNumber = "";
    this.password = "";
    this.retypePassword = "";
    this.fullName = "";
    this.address = "";
    this.isAccepted = false;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }
  invalidPhoneMessage: string = '';

  validatePhone() {
    const phonePattern = /^\d+$/;  // Điều kiện chỉ chứa chữ số
    if (!phonePattern.test(this.phoneNumber)) {
      this.isPhoneInvalid = true;
      this.invalidPhoneMessage = 'Phone phải là chữ số';
    } else if (this.phoneNumber.length < 10 || this.phoneNumber.length > 11) {
      this.isPhoneInvalid = true;
      this.invalidPhoneMessage = 'Phone phải có từ 10 đến 11 ký tự';
    } else {
      this.isPhoneInvalid = false;
      this.invalidPhoneMessage = '';
    }
  }
  isNameInvalid: boolean = false;
  nameErrorMessage: string = '';
  validateName() {
    // Biểu thức chính quy cho tên hợp lệ
    const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạốảấầẩẫậắằẳẵặẹẻẽềềểễỄỆỈỊịỌỎỐỒỔỖỘỚờởỡợỤỦỨỪửữựỹỵỷỹ\s]+$/;

    if (this.fullName.trim().length === 0) {
      this.isNameInvalid = true;
      this.nameErrorMessage = 'Họ và tên không được để trống';
    } else if (!namePattern.test(this.fullName)) {
      this.isNameInvalid = true;
      this.nameErrorMessage = 'Họ và tên không được chứa số hoặc ký tự đặc biệt';
    } else if (/\s{2,}/.test(this.fullName)) {
      this.isNameInvalid = true;
      this.nameErrorMessage = 'Họ và tên không được chứa nhiều khoảng trắng liên tiếp';
    } else {
      this.isNameInvalid = false;
      this.nameErrorMessage = '';
    }
  }
  isAgeInvalid: boolean = false;
  ageErrorMessage: string = '';

  validateAge() {
    if (!this.dateOfBirth) {
      this.isAgeInvalid = true;
      this.ageErrorMessage = 'Ngày sinh không được để trống';
      return;
    }

    const dateOfBirth = new Date(this.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();

    // Điều chỉnh tuổi nếu ngày sinh chưa đến trong năm hiện tại
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    if (age < 18) {
      this.isAgeInvalid = true;
      this.ageErrorMessage = 'Bạn phải đủ 18 tuổi để tiếp tục';
    } else {
      this.isAgeInvalid = false;
      this.ageErrorMessage = '';
    }
  }
  invalidPasswordMessage: string = "";
  isPasswordInvalid: boolean = false;
  validatePassword() {

    if (this.password.length < 6) {
      this.invalidPasswordMessage = "Mật khẩu phải có ít nhất 6 ký tự";
      this.isPasswordInvalid = true;
    }
    else {
      this.invalidPasswordMessage = "";
      this.isPasswordInvalid = false;
    }
  }
  invalidRetypePasswordMessage: string = "";
  isRetypePasswordInvalid: boolean = false;
  validateRetypePassword() {


    if (this.retypePassword !== this.password) {
      this.isRetypePasswordInvalid = true;
      this.invalidRetypePasswordMessage = "Mật khẩu nhập lại chưa hợp lệ";
    } else {
      this.isRetypePasswordInvalid = false;
      this.invalidRetypePasswordMessage = "";
    }
  }
  invalidEmailMessage: string = "";
  isEmailInvalid: boolean = false;
  isValidEmail(email: string): boolean {
    // Biểu thức chính quy để kiểm tra email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  validateEmail() {

    if (!this.isValidEmail(this.email)) {
      this.isEmailInvalid = true;
      this.invalidEmailMessage = "Email không hợp lệ";
    } else {
      this.isEmailInvalid = false;
      this.invalidEmailMessage = "";
    }
  }
  onPhoneNumberChange() {
    console.log(`Phone typed : ${this.phoneNumber}`);
  }
  register() {
    const message = `phongeNumber  : ${this.phoneNumber}` +
      `password  : ${this.password}` +
      `retypePassword  : ${this.retypePassword}` +
      `fullName  : ${this.fullName}` +
      `address  : ${this.address}` +
      `dateOfBirth  : ${this.dateOfBirth}`;
      `email : ${this.email}`;
    
    const registerDTO:RegisterDTO = {

      "fullname": this.fullName,
      "email": this.email,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1,
    }
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        
        if(response && (response.status === 200 || response.status === 201)) {
          this.router.navigate(['/login']);
        }
      },
      error: (error: any) => {
        
        alert(`Đăng ký thất bại do : ${error.error}`)
      },
      complete: () => {
        
        alert(`Đăng ký thành công`)
        this.router.navigate(['/login']);
      }
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordR() {
    this.showPasswordR = !this.showPasswordR;
  }
}
