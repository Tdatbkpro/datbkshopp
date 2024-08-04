export class UpdateUserDTO {
    fullname: string;  
    email: string;  
    address: string;    
    password: string;    
    retype_password: string;    
    date_of_birth: Date;    
    
    constructor(data: any) {
        this.fullname = data.fullname;
        this.email = data.email;
        this.address = data.address;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.date_of_birth = data.date_of_birth;        
    }
}