import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services';
import { AvatarPipe } from '../../pipes/avatar-pipe';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AvatarPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.profile-container')) {
      this.isMenuOpen.set(false);
    }
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
    this.router.navigate(['/']); 
  }
}
