import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services';
import { AvatarPipe } from '../../pipes/avatar-pipe';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

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
  shouldAnimate = signal(false); 
  private userSub?: Subscription;
  
  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.shouldAnimate.set(true);
        setTimeout(() => this.shouldAnimate.set(false), 1000);
      }
    });
  }

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
    const username = this.authService.currentUser()?.username;
    this.isMenuOpen.set(false);
    this.authService.logout();
    Swal.fire({
      title: "Deslogueado correctamente",
      icon: "success",
      text: `Has cerrado correctamente la sesion, vuelve pronto ${username}!`,
      confirmButtonText: "OK"
    }).then(() => {
      this.router.navigate(['/login']); 
    })
  }
}



