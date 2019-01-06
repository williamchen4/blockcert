import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class IsOwnerGuard implements CanActivate {
    constructor(private router: Router,
                private api: ApiService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const isOwner = this.api.isOwner;
        if (!isOwner)
            window.location.href = next.data['externalUrl'];
        return isOwner;
    }
}
