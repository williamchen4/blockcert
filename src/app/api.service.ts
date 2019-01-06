/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/internal/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as globals } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public me$: Observable<any>;

    constructor(private http: HttpClient) {
    }

    get isAdmin(): boolean {
        console.debug('get: admin');
        const token = localStorage.getItem('authToken');
        const admin = localStorage.getItem('userType').toLowerCase() === 'admin';
        return !!token && admin;
    }

    get isOwner(): boolean {
        console.debug('get: owner');
        const token = localStorage.getItem('authToken');
        const manager = localStorage.getItem('userType').toLowerCase() === 'owner';
        return !!token && manager;
    }

    get authToken(): string {
        console.debug('get: token');
        const token = localStorage.getItem('authToken');
        return token ? token : '';
    }
    get refreshToken(): string {
        console.debug('get: token');
        const token = localStorage.getItem('refreshToken');
        return token ? token : '';
    }
    public login(): Observable<any> {
        console.debug('GET: login', `${globals.URL_API}/me`);
        this.me$ = this.http.get<any>(`${globals.URL_API}/me`,
            {headers: this.getAuth()})
            .pipe(
                tap(this.setSession),
                shareReplay(1),
                catchError(this.handleError.bind(this))
            );
        return this.me$;
    }

    public logout() {
        console.debug('API: logout');
        this.me$ = null;
        return this.http.post<any>(`${globals.URL_API}/logout`, {},
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    get loggedIn(): boolean {
        console.debug('get: loggedIn');
        return !!this.authToken;
    }

    get loggedOut(): boolean {
        console.debug('get: loggedOut');
        return !this.loggedIn;
    }

    public getRecipientSearchSuggestions(query): Observable<string[]> {
        console.debug('GET: getRecipientSearchSuggestions');
        const options = query ? {params: new HttpParams().set('query', query), headers: this.getAuth()} : {};
        return this.http.get<string[]>(`${globals.URL_API}/recipients`, options)
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getIssuerIds(): Observable<string[]> {
        console.debug('GET: getIssuerIds');
        return this.http.get<string[]>(`${globals.URL_API}/issuers`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }
    public getOwnedIssuerIds(): Observable<string[]> {
        console.debug('GET: getOwnedIssuerIds');
        return this.http.get<string[]>(`${globals.URL_API}/issuers/?owner=true`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }
    
    public getIssuerImage(image: string): Observable<string[]> {
        console.debug('GET: getIssuerImage');
        return this.http.get<string[]>(`${globals.URL_API}/display/${image}`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getUserIds(): Observable<string[]> {
        console.debug('GET: getUserIds');
        return this.http.get<string[]>(`${globals.URL_API}/users`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getBadgeIds(issuer: string): Observable<string[]> {
        console.debug('GET: getBadgeIds');
        return this.http.get<string[]>(`${globals.URL_API}/issuers/${issuer}/badges`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }
    
    public getCertsByRecipient(issuer: string, recipient: string): Observable<string[]> {
        console.debug('GET: getCertsByRecipient');
        return this.http.get<string[]>(`${globals.URL_API}/issuers/${issuer}/recipients/${recipient}/certs`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }
    
    public getRecipients(): Observable<any> {
        console.debug('GET: getRecipients');
        return this.http.get<any>(`${globals.URL_API}/recipients`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getRecipientsByIssuer(issuer: string): Observable<string[]> {
        console.debug('GET: getRecipientsByIssuer');
        return this.http.get<string[]>(`${globals.URL_API}/issuers/${issuer}/recipients`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }
    public getRecipientById(recipient: string): Observable<any> {
        console.debug('GET: getRecipientById');
        return this.http.get<string[]>(`${globals.URL_API}/recipients/${recipient}`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getIssuerById(id: string): Observable<any> {
        console.debug('GET: getIssuerById');
        return this.http.get<any>(`${globals.URL_API}/issuers/${id}`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getUserById(id: string): Observable<any> {
        console.debug('GET: getUserById');
        return this.http.get<any>(`${globals.URL_API}/users/${id}`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public getBadgeById(issuer: string, id: string): Observable<any> {
        console.debug('GET: getBadgeById');
        return this.http.get<any>(`${globals.URL_API}/issuers/${issuer}/badges/${id}`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }
    
    public getDisplay(badgeID: string): Observable<any> {
        console.debug('GET: getDisplay');
        return this.http.get<any>(`${globals.URL_API}/display/${badgeID}`,
            {headers: this.getAuth()})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public refresh(): Observable<any> {
        console.debug('GET: refresh');
        return this.http.get<any>(`${globals.URL_API}/refresh`,
            {headers: this.getRefresh(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postIssuer(issuer: any): Observable<any> {
        console.debug('POST: postIssuer');
        return this.http.post<any>(`${globals.URL_API}/issuers`, issuer,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postUser(user: any): Observable<any> {
        console.debug('POST: postUser');
        return this.http.post<any>(`${globals.URL_API}/users`, user,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postBadge(issuer: number, badge: any, template:any): Observable<any> {
        console.debug('POST: postBadge');
        return this.http.post<any>(`${globals.URL_API}/issuers/${issuer}/badges`,
        {
            'signatureLines': badge['signatureLines'],
            'image': badge['image'],
            'criteria': badge['criteria'],
            'name': badge['name'],
            'description': badge['description'],
            'template': template['template']
        },
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postIssuerById(issuer: any): Observable<any> {
        console.debug('POST: postIssuer');
        return this.http.post<any>(`${globals.URL_API}/issuers/${issuer.id}`, issuer,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postUserById(user: any): Observable<any> {
        console.debug('POST: postUserById');
        return this.http.post<any>(`${globals.URL_API}/users/${user.id}`, user,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postBadgeById(issuer: string, badge: any, template:any): Observable<any> {
        console.debug('POST: postUserById, URL:');
        return this.http.post<any>(`${globals.URL_API}/issuers/${issuer}/badges/${badge.id}`,
            {
                'signatureLines': badge['signatureLines'],
                'image': badge['image'],
                'criteria': badge['criteria'],
                'name': badge['name'],
                'description': badge['description'],
                'template': template['template']
            },
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postRecipient(recipient: any): Observable<any> {
        console.debug('POST: postRecipient');
        return this.http.post<any>(`${globals.URL_API}/recipients`, recipient,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postRecipientById(recipient: any): Observable<any> {
        console.debug('POST: postRecipientById');
        return this.http.post<any>(`${globals.URL_API}/recipients/${recipient.id}`, recipient,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postIssueBadgeRecipient(issuer: string, badge: String, recipient: String): Observable<any> {
        console.log('r ' + recipient.toString().split(','));
        console.debug('POST: postIssueBadgeRecipient');
        return this.http.post<any>(`${globals.URL_API}/issuers/${issuer}/badges/${badge}/issue`,
            recipient.toString().split(',')
        ,
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postBadgeIssueRecipientBlockchain(): Observable<any> {
        console.debug('POST: postIssueBadgeRecipient');
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return this.http.post<any>(`${globals.URL_API}`, {
                'batch': `s3://fs.blockcerts.poc/batch/${today}/`,
                'certs': 's3://fs.blockcerts.poc/certs/'
            },
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    public postRevokeCert(issuer: string, cert: string, revocationReason: string): Observable<any> {
        console.debug('POST: postRevokeCert');
        return this.http.post<any>(`${globals.URL_API}/issuers/${issuer}/revocations/${cert}`,{
            'revocationReason': `${revocationReason}`
        },
            {headers: this.getAuth(true)})
            .pipe(catchError(this.handleError.bind(this)));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${JSON.stringify(error.error)}`);
            // TODO if (error.status === 401) this.logoutAndNotify();
            if (error.error.message) return throwError(error.error);
        }
        // return an observable with a user-facing error message
        return throwError({message: 'Something bad happened, please try again later.'});
    }

    private getAuth(isJson: boolean = false): HttpHeaders {

        this.refresh().subscribe((token: string) => {
            localStorage.removeItem('authToken');
            localStorage.setItem('authToken', token);
        });

        return isJson ?
            new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authToken}) :
            new HttpHeaders({'Authorization': 'Bearer ' + this.authToken});
    }

    private getRefresh(isJson: boolean = false): HttpHeaders {
        return isJson ?
            new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.refreshToken}) :
            new HttpHeaders({'Authorization': 'Bearer ' + this.authToken});
    }

    private setSession(user) {
        if (user.username && user.userType) {
            console.debug('API: setSession');
            localStorage.setItem('username', user.username);
            localStorage.setItem('userType', user.userType);
        }
    }

    public setAuth(authToken, refreshToken) {
        if (authToken && refreshToken) {
            console.debug('API: setAuth');
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('refreshToken', refreshToken);

        }
    }

    public removeSession() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
    }
}
