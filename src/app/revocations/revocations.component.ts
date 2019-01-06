/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-revocations',
  templateUrl: './revocations.component.html',
  styleUrls: ['./revocations.component.scss']
})
export class RevocationsComponent implements OnInit {
    badgeIssuersFormGroup: FormGroup;
    badgeNewFormGroup: FormGroup;
    badgeManageIssuersFormGroup: FormGroup;
    badgeRevokeRecipientsFormGroup: FormGroup;
    badgeManageBadgeFormGroup: FormGroup;
    badgeRevokeCertFormGroup: FormGroup;
    
    issuerIds = [];
    badgeIds = [];
    recipientIds = [];
    allRecipientIDandEmail = [];

    constructor(private formBuilder: FormBuilder,
                private api: ApiService,
                private snackBar: MatSnackBar) {
    }

    addSignatureLines(formGroup: FormGroup, isNew) {
        // add address to the list
        const control = <FormArray>formGroup.controls['signatureLines'];
        control.push(this.initSignatureLines(isNew));
    }

    removeSignatureLines(formGroup: FormGroup, i: number) {
        const control = <FormArray>formGroup.controls['signatureLines'];
        control.removeAt(i);
    }

    initSignatureLines(isNew: boolean) {
        return isNew ?
            this.formBuilder.group({
                jobTitle: ['', Validators.required],
                image: [''],
                name: ['', Validators.required]
            }) : this.formBuilder.group({
                jobTitle: ['', Validators.required],
                image: [''],
                name: ['', Validators.required],
                type: [{value: '', disabled: true}]
            });
    }

    ngOnInit() {
        this.getAllRecipientIDandEmail();

        this.badgeIssuersFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.badgeNewFormGroup = this.formBuilder.group({
            signatureLines: this.formBuilder.array([
                this.initSignatureLines(true),
            ]),
            image: ['', Validators.required],
            criteria: this.formBuilder.group({
                narrative: ['', Validators.required],
            }),
            name: ['', Validators.required],
            description: ['', Validators.required],
            template: ['1', Validators.required]
        });
        this.badgeManageIssuersFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.badgeRevokeRecipientsFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.badgeRevokeCertFormGroup = this.formBuilder.group({
            badgeID: ['', Validators.required],
            badgeName: ['', Validators.required],
            certID: ['', Validators.required],
            revocationReason: ['', Validators.required]
        });

        this.badgeRevokeRecipientsFormGroup.valueChanges.subscribe(() => {
            const query = this.badgeRevokeRecipientsFormGroup.get('name').value.toString().trim();
            this.api.getRecipientSearchSuggestions(query)
                .subscribe((suggestions: string[]) => {
                    this.recipientIds = suggestions;
                });
        });


        this.tabSelected(0);
    }

    tabSelected(index: any) {
        switch (index) {
            case 0:
                this.getIssuersIds();
                break;
            case 1:
                this.getIssuersIds();
                break;
        }
    }

    getAllRecipientIDandEmail() {
        this.api.getRecipients().subscribe((ids: string[]) => {
            this.allRecipientIDandEmail = ids;
        });
    }

    getIssuersIds() {
        this.api.getIssuerIds().subscribe((ids: string[]) => {
            this.issuerIds = ids;
        }, () => {
            this.issuerIds = [];
        });
    }

    getBadgeIds() {
        const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
        const chosenRecipient = this.badgeRevokeRecipientsFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        console.log(chosenIssuerId, chosenRecipient);
        this.api.getCertsByRecipient(chosenIssuerId, chosenRecipient)
            .subscribe((ids: string[]) => {
                console.log(ids);
                this.badgeIds = ids;
            }, err => {
            this.openSnackBar('Recipient does not exist', 'OK', 3000, false);
            }
            );
    }

    getRecipientsByIssuer() {
        const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        this.api.getRecipientsByIssuer(chosenIssuerId)
            .subscribe((ids: string[]) => {
                console.log(ids);
                this.recipientIds = ids;
            }, () => {
                this.recipientIds = [];
            });
    }

    getBadgeById() {
        const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        const chosenBadge = this.badgeRevokeRecipientsFormGroup.get('name').value;
        const chosenBadgeId = this.badgeIds.filter(obj => obj.name === chosenBadge)[0].id;
        this.api.getBadgeById(chosenIssuerId, chosenBadgeId)
            .subscribe((badge: any) => {
                console.log(badge);
                let count = 0;
                const controlArray = <FormArray>this.badgeManageBadgeFormGroup.get('signatureLines');
                while (controlArray.length !== 0) controlArray.removeAt(0);
                do controlArray.push(this.initSignatureLines(false));
                while (badge.signatureLines && badge.signatureLines.length > ++count) ;
                this.badgeManageBadgeFormGroup.patchValue(badge);
            });
    }



    


    postRevokeCert() {
        const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;

        const chosenBadge = this.badgeRevokeCertFormGroup.get('badgeName').value;
        const chosenCert = this.badgeIds.filter(obj => obj.badgeName === chosenBadge)[0].certID;


        this.api.postRevokeCert(chosenIssuerId, chosenCert, this.badgeRevokeCertFormGroup.get('revocationReason').value)
        .subscribe((message: any) => {
            console.log(message);
            this.openSnackBar('Certificate revoked', 'Ok', 3000, true);
        }, err => {
            this.openSnackBar(err.message, 'Ok', 4000, false);
        });
    }

    get baseToImgExisting() {
        return this.badgeManageBadgeFormGroup.get('image').value;
    }

    get baseToImgNew() {
        return this.badgeNewFormGroup.get('image').value;
    }

    baseToImgNewUser(index: number) {
        const arrayControl = <FormArray>this.badgeNewFormGroup.get('signatureLines');
        return arrayControl.controls[index].get('image').value;
    }

    baseToImgExistingUser(index: number) {
        const arrayControl = <FormArray>this.badgeManageBadgeFormGroup.get('signatureLines');
        return arrayControl.controls[index].get('image').value;
    }

    imageToBaseNew($event) {
        if ((<HTMLInputElement>$event.target).files && (<HTMLInputElement>$event.target).files[0]) {
            console.log((<HTMLInputElement>$event.target).files[0].size);
            if ((<HTMLInputElement>$event.target).files[0].size < 1024 * 250) { // 250 KB
                const reader = new FileReader();
                // noinspection SpellCheckingInspection
                reader.onload = () => {
                    // console.log('RESULT', reader.result);
                    this.badgeNewFormGroup.get('image').patchValue(reader.result);
                };
                reader.readAsDataURL((<HTMLInputElement>$event.target).files[0]);
            } else this.openSnackBar('Image file is too large.', 'Ok', 3000, false);
        } else this.badgeNewFormGroup.get('image').patchValue(null);
    }

    imageToBaseExisting($event) {
        if ((<HTMLInputElement>$event.target).files && (<HTMLInputElement>$event.target).files[0]) {
            console.log((<HTMLInputElement>$event.target).files[0].size);
            if ((<HTMLInputElement>$event.target).files[0].size < 1024 * 250) { // 250 KB
                const reader = new FileReader();
                // noinspection SpellCheckingInspection
                reader.onload = () => {
                    // console.log('RESULT', reader.result);
                    this.badgeManageBadgeFormGroup.get('image').patchValue(reader.result);
                };
                reader.readAsDataURL((<HTMLInputElement>$event.target).files[0]);
            } else this.openSnackBar('Image file is too large.', 'Ok', 3000, false);
        } else this.badgeManageBadgeFormGroup.get('image').patchValue(null);
    }

    imageToBaseAvatarNew($event, index) {
        if ((<HTMLInputElement>$event.target).files && (<HTMLInputElement>$event.target).files[0]) {
            console.log((<HTMLInputElement>$event.target).files[0].size);
            if ((<HTMLInputElement>$event.target).files[0].size < 1024 * 250) { // 250 KB
                const reader = new FileReader();
                // noinspection SpellCheckingInspection
                reader.onload = () => {
                    // console.log('RESULT', reader.result);
                    (<FormArray>this.badgeNewFormGroup.get('signatureLines')).controls[index].get('image').patchValue(reader.result);
                };
                reader.readAsDataURL((<HTMLInputElement>$event.target).files[0]);
            } else this.openSnackBar('Image file is too large.', 'Ok', 3000, false);
        } else (<FormArray>this.badgeNewFormGroup.get('signatureLines')).controls[index].get('image').patchValue(null);
    }

    imageToBaseAvatarExisting($event, index) {
        if ((<HTMLInputElement>$event.target).files && (<HTMLInputElement>$event.target).files[0]) {
            console.log((<HTMLInputElement>$event.target).files[0].size);
            if ((<HTMLInputElement>$event.target).files[0].size < 1024 * 250) { // 250 KB
                const reader = new FileReader();
                // noinspection SpellCheckingInspection
                reader.onload = () => {
                    // console.log('RESULT', reader.result);
                    (<FormArray>this.badgeManageBadgeFormGroup.get('signatureLines')).controls[index].get('image').patchValue(reader.result);
                };
                reader.readAsDataURL((<HTMLInputElement>$event.target).files[0]);
            } else this.openSnackBar('Image file is too large.', 'Ok', 3000, false);
        } else (<FormArray>this.badgeManageBadgeFormGroup.get('signatureLines')).controls[index].get('image').patchValue(null);
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

    get ctrlSignLineNew() {
        return (<FormArray>this.badgeNewFormGroup.get('signatureLines')).controls;
    }

    get ctrlSignLineExisting() {
        return (<FormArray>this.badgeManageBadgeFormGroup.get('signatureLines')).controls;
    }
}
