import {
   IsString,
   IsNotEmpty,
   IsPhoneNumber,
   IsDate
} from 'class-validator'
export class RegisterDTO {
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number: string;

    
    @IsString()
    address:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsNotEmpty()
    @IsString()
    retype_password: string;

    @IsDate()
    date_of_birth: Date;

    facebook_account_id: number = 0;
    google_account_id: number = 0 ;
    role_id: number;
    constructor(data: any) {
        this.fullname = data.fullname;
        this.email  = data.email;
        this.phone_number = data.phone_number;
        this.address = data.address;
        this.retype_password = data.retype_password;
        this.facebook_account_id = data.facebook_account_id || 0;
        this.date_of_birth = data.date_of_birth;
        this.password = data.password;
        this.role_id = data.role_id;
        this.google_account_id = data.google_account_id || 0;
    }
}