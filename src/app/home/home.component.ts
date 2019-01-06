/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { environment as globals } from '../../environments/environment';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    appName = globals.appName;
    loggedIn;
    isAdmin;
    isOwner;

    activePath;

    constructor(private api: ApiService,
                private router: Router,
                private snackBar: MatSnackBar,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            const accessToken = params['access_token'];
            const refreshToken = params['refresh_token'];
            if (accessToken && refreshToken)
                this.api.setAuth(accessToken, refreshToken);
            this.login();
        });
    }

    setColor(path) {
        this.activePath = path;
    }

    getColor(path) {
        return path == this.activePath ? "primary" : "";
    }

    login() {
        this.api.login().subscribe((user) => {
            //console.log(user.userOwner);
            //console.log(user.userAdmin);
            console.log(user);
            this.loggedIn = this.api.loggedIn;
            this.isOwner = this.api.isOwner;
            this.isAdmin = this.api.isAdmin;
            this.openSnackBar('Login successful', 'Ok', 3000, true);

            // refresh on current page if not initial login
            if (this.router.url.length == 1 || this.router.url.length > 20) 
                this.router.navigate(['/issue'], {replaceUrl: true}).catch(console.error);
        }, err => {
            console.log(err);
            window.location.href = globals.URL_LOGIN;
            // this.loggedIn = this.isAdmin = false;
            // this.openSnackBar(err.message ? err.message : 'Login failed, please try again.', 'Ok', 3000, false);
        });
    }

    protected openSnackBar(message: string, action: string, duration: number, isSuccessError: boolean | null = null) {
        // isSuccessError = true  (Success)
        // isSuccessError = false (Error)
        // isSuccessError = n/a   (Default)
        let className = [];
        if (isSuccessError !== undefined || isSuccessError != null) {
            if (isSuccessError === true) className = ['snack-bar-success'];
            else if (isSuccessError === false) className = ['snack-bar-error'];
        }
        this.snackBar.open(message, action, {panelClass: className, duration: duration});
    }

    public gotoLogin() {
        window.location.href = globals.URL_LOGIN;
    }

    public gotoLogout() {
        this.api.logout().subscribe(() => {
            this.api.removeSession();
            window.location.href = globals.URL_LOGOUT;
        });
    }
}
