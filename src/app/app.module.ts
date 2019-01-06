/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import {DragDropModule} from '@angular/cdk/drag-drop';


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BadgeIssueComponent } from './badge-issue/badge-issue.component';
import { BadgeCreateComponent } from './badge-create/badge-create.component';
import { BadgeAdminComponent } from './badge-admin/badge-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RevocationsComponent } from './revocations/revocations.component';
import { OwnerComponent } from './owner/owner.component';
import { OwnerManageComponent } from './owner-manage/owner-manage.component';
import { TagsValidator } from './tags.validator';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent, LogoutComponent, RegisterComponent,
        HomeComponent,
        BadgeIssueComponent, BadgeCreateComponent, BadgeAdminComponent, DashboardComponent, RevocationsComponent, OwnerComponent, OwnerManageComponent, TagsValidator
    ],
    imports: [
        BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule,
        MatToolbarModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatSidenavModule, MatListModule,
        MatIconModule, MatTabsModule, MatMenuModule, MatStepperModule, MatSelectModule, MatAutocompleteModule,
        MatRadioModule, MatTooltipModule, DragDropModule, MatSlideToggleModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
