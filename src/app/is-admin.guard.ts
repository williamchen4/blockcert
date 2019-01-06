/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
    constructor(private router: Router,
                private api: ApiService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const isAdmin = this.api.isAdmin;
        if (!isAdmin)
            window.location.href = next.data['externalUrl'];
        return isAdmin;
    }
}
