import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService, CountryService, UserService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  fileSelected: File | null = null;
  error: string = '';
  private paramSub?: Subscription;
  userId: number = 0;

  constructor(public countryService: CountryService) {}

    ngOnInit() {
      this.paramSub = this.route.paramMap.subscribe(params => {
          const idUrl = params.get('id');
          
          if (idUrl) {
              this.userId = Number(idUrl);
          }
      });
    }

  update(form: NgForm) {
    const formData = new FormData();

    formData.append('id', this.userId.toString());
    formData.append('location', form.value.location || null);
    formData.append('birthDate', form.value.birthDate || null);
    formData.append('gender', form.value.gender || null);

    if (this.fileSelected) {
      formData.append('avatar', this.fileSelected, this.fileSelected.name);
    }

    this.userService.updateProfile(formData).subscribe({
      next: (res) => {
        console.log('Actualizado:', res);
        this.userService.getProfileById(this.userId).subscribe((profileRes: any) => {
            this.authService.updateUserState(profileRes.data); 
            this.router.navigate(['/feed']);
          });
      },
      error: (err) => {
        this.error = err.message || 'Ocurrió un error durante la actualización.';
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.fileSelected = event.target.files[0];
    }
  }

  ngOnDestroy() {
    if (this.paramSub) {
        this.paramSub.unsubscribe();
    }
  }
}
