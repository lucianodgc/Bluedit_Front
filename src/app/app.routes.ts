import { Routes } from '@angular/router';
import { Feed } from './components/feed/feed';
import { CreatePost } from './components/create-post/create-post';
import { Profile } from './components/profile/profile';
import { PostDetail } from './components/post-detail/post-detail';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { EditProfile } from './components/edit-profile/edit-profile';
import { profileGuard } from './guards/profile-guard';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    { path: 'feed', component: Feed },
    { path: 'create-post', component: CreatePost, canActivate: [authGuard] },
    { path: 'profile/:id', component: Profile },
    { path: 'edit-profile/:id', component: EditProfile, canActivate: [profileGuard] },
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'signup', component: Register, canActivate: [guestGuard] },
    { path: 'post/:id', component: PostDetail },
    { path: '', redirectTo: '/feed', pathMatch: 'full' },
    { path: '**', redirectTo: '/feed' }
];
