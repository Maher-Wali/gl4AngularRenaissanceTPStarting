import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [
    RouterLinkActive,
    RouterLink
],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  readonly isAuthenticated = this.authService.userAuthenticated;


  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.login]);
    this.toastr.warning(`Au plaisir de vous revoir :(`);
  }
}
