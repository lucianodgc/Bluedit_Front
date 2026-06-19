import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService, CountryService, UserService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Se actualizarán los datos de tu perfil con la nueva información.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      background: '#212529',
      color: '#fff'
    }).then((result) => {
      
      if (result.isConfirmed) {
        const formData = new FormData();

        formData.append('id', this.userId.toString());
        formData.append('location', form.value.location || null);
        formData.append('birthDate', form.value.birthDate || null);
        formData.append('gender', form.value.gender || null);

        if (this.fileSelected) {
          formData.append('avatar', this.fileSelected, this.fileSelected.name);
        }

        this.userService.updateProfile(formData).subscribe({
          next: (response) => {
            this.userService.getProfileById(this.userId).subscribe((profileRes: any) => {
              this.authService.updateUserState(profileRes.data); 
              
              Swal.fire({
                title: "Perfil actualizado",
                icon: "success",
                text: `¡Tu perfil se ha actualizado correctamente!`,
                confirmButtonText: 'OK',
                background: '#212529',
                color: '#fff'
              }).then(() => {
                this.router.navigate(['/profile/', this.userId]);
              });
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Error al actualizar",
              text: err.error?.message || `Ocurrió un problema al intentar guardar los cambios.`,
              icon: "error",
              confirmButtonText: "Entendido",
              background: '#212529',
              color: '#fff'
            });
            this.cdr.detectChanges();
          }
        });
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
