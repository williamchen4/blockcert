/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BadgeIssueComponent } from './badge-issue/badge-issue.component';
import { BadgeCreateComponent } from './badge-create/badge-create.component';
import { BadgeAdminComponent } from './badge-admin/badge-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RevocationsComponent } from './revocations/revocations.component';
import { OwnerComponent } from './owner/owner.component';
import { IsAuthGuard } from './is-auth.guard';
import { IsAdminGuard } from './is-admin.guard';
import { IsOwnerGuard } from './is-owner.guard';
import { environment as globals } from '../environments/environment';

const routes: Routes = [
    // {path: 'login', component: LoginComponent},
    // {path: 'logout', component: LogoutComponent},
    // {path: 'register', component: RegisterComponent},
    {
        path: '',
        component: HomeComponent,
        children: [
            // {path: '', redirectTo: '/issue', pathMatch: 'prefix'},
            {
                path: 'issue',
                component: BadgeIssueComponent,
                canActivate: [IsAuthGuard],
                data: {externalUrl: globals.URL_LOGIN}
            },
            {
                path: 'create',
                component: BadgeCreateComponent,
                canActivate: [IsAuthGuard],
                data: {externalUrl: globals.URL_LOGIN}
            },
            {
                path: 'admin',
                component: BadgeAdminComponent,
                canActivate: [IsAdminGuard],
                data: {externalUrl: globals.URL_LOGIN}
            },
            {
                path: 'owner',
                component: OwnerComponent,
                canActivate: [IsOwnerGuard],
                data: {externalUrl: globals.URL_LOGIN}
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [IsAuthGuard],
                data: {externalUrl: globals.URL_LOGIN}
            },
            {
                path: 'revocations',
                component: RevocationsComponent,
                canActivate: [IsAuthGuard],
                data: {externalUrl: globals.URL_LOGIN}
            }
        ]
    },
    // {path: '**', redirectTo: '/issue'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
