/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    constructor(private snackBar: MatSnackBar,
                private router: Router,
                private api: ApiService) {
    }

    ngOnInit() {
        this.onLogout();
    }

    private onLogout() {
        this.api.logout();
        this.openDelayedSnackBar('Logged out successfully.', 'Ok');
        this.router.navigate(['/login']).catch(console.error);
    }

    protected openDelayedSnackBar(message: string, action: string, delay: number = 500, isSuccessError: boolean | null = null) {
        setTimeout(() => {
            this.openSnackBar(message, action, isSuccessError);
        }, delay);
    }

    protected openSnackBar(message: string, action: string, isSuccessError: boolean | null = null) {
        this.openTimedSnackBar(message, action, 3000, isSuccessError);
    }

    protected openTimedSnackBar(message: string, action: string, duration: number, isSuccessError: boolean | null = null) {
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
}
