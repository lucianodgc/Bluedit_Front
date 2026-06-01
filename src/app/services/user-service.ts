import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = [
    { id: 1, username: 'nacho_sugo', email: 'nacho_sugo@example.com', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=nacho_sugo', createdAt: new Date().toISOString() },
    { id: 2, username: 'luciano_dg', email: 'luciano_dg@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=2', createdAt: new Date().toISOString() }
  ];
  getProfileById(id: number) {
    return this.users.find(u => u.id === id);
  }
}
