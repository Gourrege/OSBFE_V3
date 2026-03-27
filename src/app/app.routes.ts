import { Routes } from '@angular/router';
import { DriverComponent } from './driver/component/driver.component';
import { TrackComponent } from './tracks/component/track.component';
import { DriverFormComponent } from './driver/component/driver-form/driver-form.component';
import { TrackFormComponent } from './tracks/component/track-form/track-form.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/guards/auth.guard';
import { creatorGuard } from './auth/guards/creator.guard';
import { adminGuard } from './auth/guards/admin.guard';
import { AdminDashboardComponent } from './admin/component/admin-dashboard.component';
import { AdminUsersComponent } from './admin/component/admin-users.component';
import { AdminUserFormComponent } from './admin/component/admin-user-form/admin-user-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/users', component: AdminUsersComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin/users/new', component: AdminUserFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'drivers', component: DriverComponent, canActivate: [authGuard] },
    { path: 'drivers/form', component: DriverFormComponent },
    { path: 'drivers/:id/edit', component: DriverFormComponent, canActivate: [authGuard, creatorGuard] },
    { path: 'tracks', component: TrackComponent },
    { path: 'tracks/form', component: TrackFormComponent},
    { path: 'tracks/:id/edit', component: TrackFormComponent},
    { path: 'login', component: LoginComponent }
];
