/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { environment as globals } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    appName = globals.appName;
    loginForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private api: ApiService,
                private router: Router,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        console.log('Login: ngOnInit');
        this.createForm();
    }

    login() {
        this.api.login().subscribe((user) => { //(this.loginForm.value)
            console.log(user);
            this.openSnackBar('Login successful', 'Ok', 3000, true);
            this.router.navigate(['/issue'], {replaceUrl: true}).catch(console.error);
        }, err => {
            console.log(err);
            this.openSnackBar(err.message ? err.message : 'Login failed, please try again.', 'Ok', 3000, false);
        });
    }

    private createForm() {
        // noinspection TypeScriptValidateTypes
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(6)
                // starts and ends with a letter or number
                // can have . or _ but no more than 2 consecutive of those
                // Validators.pattern(/^[a-zA-Z0-9](?!.*?[._]{2})[a-zA-Z0-9_.]+[a-zA-Z0-9]$/)
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(2)
            ])],
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

    get email() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }
}
