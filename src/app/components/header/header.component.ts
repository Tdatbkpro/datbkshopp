import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { UserResponse } from '../../responses/user/user.response';
import {ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  faShoppingCart = faShoppingCart;
  userResponse?: UserResponse | null
  isPopoverOpen : boolean = false;
  activeNavItem: number = 0;
  constructor(
    private userService : UserService,
    private tokenService : TokenService,
    private cd: ChangeDetectorRef,
    private router : Router
  ) { }
  ngOnInit(): void {
      this.userResponse = this.userService.getUserFromLocalStorage();  
  }
  togglePopover(event : Event): void {
   event.preventDefault();
   this.isPopoverOpen = !this.isPopoverOpen;

  }
  handleItemClick(index: number): void {
    //alert(`Clicked on ${index}`);
    if(index == 0) {
      this.router.navigate(['/user-profile'])
    } else if(index === 2) {
        this.router.navigate(['/orders'])
        this.userService.removeUserFromLocalStorage();
        this.tokenService.removeToken();
        this.userResponse = this.userService.getUserFromLocalStorage();
    } else if (index == 1) {
      this.router.navigate(['/orders/user'])
    }
    else if (index == 3) {
      this.router.navigate(['/admin'])
    }
    this.isPopoverOpen = false;
  }
  setActiveNavItem(index : number) {
    this.activeNavItem = index;
    this.cd.detectChanges();
  }
}
