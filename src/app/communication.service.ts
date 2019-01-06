/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommunicationService {
    logOut: boolean;

    @Output() loggedOut: EventEmitter<boolean> = new EventEmitter();

    userLoggedOut(status: boolean) {
        console.log('Communication: userLoggedOut');
        this.logOut = status;
        this.loggedOut.emit(this.logOut);
    }
}
