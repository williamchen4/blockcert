/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSlideToggleModule, MatSlideToggle} from '@angular/material/slide-toggle';
import { AbstractControl } from '@angular/forms';


@Component({
    selector: 'app-badge-admin',
    templateUrl: './badge-admin.component.html',
    styleUrls: ['./badge-admin.component.scss']
})
export class BadgeAdminComponent implements OnInit {

    issuerNewFormGroup: FormGroup;
    issueSearchIdFormGroup: FormGroup;
    issuerExistingFormGroup: FormGroup;

    userNewFormGroup: FormGroup;
    userSearchIdFormGroup: FormGroup;
    userExistingFormGroup: FormGroup;

    issuerIds = [];
    userIds = [];

    managedIssuers = [];
    ownedIssuers = [];

    nonManagedIssuers = [];
    nonOwnedIssuers = [];

    isViewable: boolean;
    color= "warn";
    show = false;
    sliderVal = "Enabled";

    allUserIDandEmail = [];

    constructor(private formBuilder: FormBuilder,
                private api: ApiService,
                private snackBar: MatSnackBar) {
    }


    ngOnInit() {
        this.getUserIds();
        this.isViewable = false;

        this.issuerNewFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            url: ['', Validators.required],
            email: ['', Validators.required],
            publicKey: ['', Validators.required],
            privateKey: [null],
            image: [null],
        });
        this.issueSearchIdFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.issuerExistingFormGroup = this.formBuilder.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            url: ['', Validators.required],
            email: ['', Validators.required],
            publicKey: ['', Validators.required],
            privateKey: ['', Validators.required],
            image: [null],
            // users: [[]]
        });
        this.userNewFormGroup = this.formBuilder.group({
            email: ['', Validators.required],
            // password_hash: ['', Validators.required],
            admin: ['', Validators.required]
            // issuers: ['', Validators.required] // TODO convert to array
        });
        this.userSearchIdFormGroup = this.formBuilder.group({
            id: ['', Validators.required]
        });
        this.userExistingFormGroup = this.formBuilder.group({
            id: ['', Validators.required],
            email: ['', Validators.required],
            // password_hash: ['', Validators.required],
            admin: ['', Validators.required],
            issuers: [[]], //['', Validators.required], // TODO convert to array
            status: [false, Validators.required],
            ownedIssuers: [[]]// ['']
        });

        this.tabSelected(0);
    }
    onPriceSliderChange(val) {
        console.log(val);
        this.sliderVal = val;
      }
    tabSelected(index: any) {
        switch (index) {
            case 0:
                break;
            case 1:
                this.getIssuersIds();
                break;
            case 2:
                break;
            case 3:
                this.getUserIds();
                break;
        }
    }

    hideOwner() { 
        this.isViewable = false; 
    }
    showOwner() { 
        this.isViewable = true; 
    }

    getUserIds() {
        this.api.getUserIds().subscribe((user: any) => {
            var allUserIDs = (user['id']);
            var allUserEmails = (user['email']);
            this.allUserIDandEmail = allUserIDs.concat(allUserEmails);
        });
    }

    getIssuersIds() {
        this.api.getIssuerIds().subscribe((ids: string[]) => {
            console.log(ids);
            this.issuerIds = ids;
        });
    }

    getIssuerById() {
        const chosenIssuer = this.issueSearchIdFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        this.api.getIssuerById(chosenIssuerId).subscribe((issuer: any) => {
            console.log(issuer);
            issuer.publicKey = issuer.publicKey[issuer.publicKey.length - 1].id;
            issuer.publicKey = issuer.publicKey.split(':')[issuer.publicKey.split(':').length - 1];
            this.issuerExistingFormGroup.patchValue(issuer);
        });
    }

    getUserById() {
        this.api.getUserById(this.userSearchIdFormGroup.get('id').value).subscribe((user: any) => {
            console.log(user);
            if (user['admin'] == 'owner')
                this.isViewable = true;
            if(user['status']==true)
            {
                this.color="primary";
                this.show=true;
            }
            this.managedIssuers=(user['issuers']);
            this.ownedIssuers=(user['ownedIssuers']);
            this.nonManagedIssuers=(user['nonManagedIssuers']);
            this.nonOwnedIssuers=(user['nonOwnedIssuers']);
            // issuer.publicKey = issuer.publicKey[issuer.publicKey.length - 1].id;
            // issuer.publicKey = issuer.publicKey.split(':')[issuer.publicKey.split(':').length - 1];
            this.userExistingFormGroup.patchValue(user);
        }, err => {
            this.openSnackBar('User does not exist', 'Ok', 4000, false);
        });
    }

    postIssuer(isEdit = false) {
        if (isEdit)
            this.api.postIssuerById(this.issuerExistingFormGroup.value)
                .subscribe((issuer: any) => {
                    console.log(issuer);
                    this.openSnackBar('Issuer updated successfully', 'Ok', 3000, true);
                }, err => {
                    this.openSnackBar(err.message, 'Ok', 4000, false);
                });
        else this.api.postIssuer(this.issuerNewFormGroup.value)
            .subscribe((issuer: any) => {
                console.log(issuer);
                this.openSnackBar('New issuer created successfully. ID: ' + issuer.id, 'Ok', 3000, true);
            }, err => {
                this.openSnackBar(err.message, 'Ok', 4000, false);
            });
    }

    postUser(isEdit = false) {
        console.log(this.userExistingFormGroup.value);

        if (isEdit)
            this.api.postUserById(this.userExistingFormGroup.value)
                .subscribe((user: any) => {
                    console.log(user);
                    this.openSnackBar('User updated successfully', 'Ok', 3000, true);
                }, err => {
                    console.log(this.userNewFormGroup.value);
                    this.openSnackBar(err.message, 'Ok', 4000, false);
                });
        else this.api.postUser(this.userNewFormGroup.value)
            .subscribe((user: any) => {
                console.log(user);
                this.openSnackBar('New user created successfully', 'Ok', 3000, true);
                this.getUserIds();
            }, err => {
                console.log(this.userNewFormGroup.value);
                this.openSnackBar(err.message, 'Ok', 4000, false);
            });
    }

    get baseToImgExisting() {
        return this.issuerExistingFormGroup.get('image').value;
    }

    get baseToImgNew() {
        return this.issuerNewFormGroup.get('image').value;
    }

    imageToBaseNew($event) {
        if ((<HTMLInputElement>$event.target).files && (<HTMLInputElement>$event.target).files[0]) {
            console.log((<HTMLInputElement>$event.target).files[0].size);
            if ((<HTMLInputElement>$event.target).files[0].size < 1024 * 1024) { // 1 MB
                const reader = new FileReader();
                // noinspection SpellCheckingInspection
                reader.onload = () => {
                    // console.log('RESULT', reader.result);
                    this.issuerNewFormGroup.get('image').patchValue(reader.result);
                };
                reader.readAsDataURL((<HTMLInputElement>$event.target).files[0]);
            } else this.openSnackBar('Image file is too large.', 'Ok', 3000, false);
        } else {
            this.issuerNewFormGroup.get('image').patchValue(null);
        }
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
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } 
        else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
}
