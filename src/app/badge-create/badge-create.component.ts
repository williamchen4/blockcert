/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-badge-create',
    templateUrl: './badge-create.component.html',
    styleUrls: ['./badge-create.component.scss']
})
export class BadgeCreateComponent implements OnInit {
    badgeIssuersFormGroup: FormGroup;
    badgeNewFormGroup: FormGroup;
    badgeManageIssuersFormGroup: FormGroup;
    badgeManageBadgesFormGroup: FormGroup;
    badgeManageBadgeFormGroup: FormGroup;
    templateFormGroup: FormGroup;

    issuerIds = [];
    badgeIds = [];
    issuerImage = [];

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
            //template: ['']
        });
        this.badgeManageIssuersFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.badgeManageBadgesFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.badgeManageBadgeFormGroup = this.formBuilder.group({
            signatureLines: this.formBuilder.array([]),
            id: [''],
            //type: [''],
            image: ['', Validators.required],
            criteria: this.formBuilder.group({
                narrative: ['', Validators.required],
            }),
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.templateFormGroup = this.formBuilder.group({
            template: ['', Validators.required]
        })
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

    getIssuerImage() {
        const chosenIssuer = this.badgeIssuersFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;

        this.api.getIssuerImage(chosenIssuerId).subscribe((image: string[]) => {
            this.issuerImage = image;
        }, () => {
            this.issuerImage = [];
        });

    }
    
    getIssuerImageManage() {
        const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        this.api.getIssuerImage(chosenIssuerId).subscribe((image: string[]) => {
            this.issuerImage = image;
        }, () => {
            this.issuerImage = [];
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
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        this.api.getBadgeIds(chosenIssuerId)
            .subscribe((ids: string[]) => {
                console.log(ids);
                this.badgeIds = ids;
            }, () => {
                this.badgeIds = [];
            });
    }

    getBadgeById() {
        this.getIssuerImageManage();
        const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        const chosenBadge = this.badgeManageBadgesFormGroup.get('name').value;
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

    postBadge(isEdit = false) {
        if (isEdit) {
            const json = this.badgeManageBadgeFormGroup.value;
            for (let i = 0; i < json.signatureLines.length; i++) {
                delete json.signatureLines[i].type;
            }
            const chosenIssuer = this.badgeManageIssuersFormGroup.get('name').value;
            const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
            //this.badgeManageIssuersFormGroup.get('id').value
            this.api.postBadgeById(chosenIssuerId, json, this.templateFormGroup.value)
                .subscribe((badge: any) => {
                    console.log(badge);
                    this.openSnackBar('Badge updated successfully', 'Ok', 3000, true);
                }, err => {
                    this.openSnackBar(err.message, 'Ok', 4000, false);
                });
                
        } else {
            const chosenIssuer = this.badgeIssuersFormGroup.get('name').value;
            const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
            this.api.postBadge(chosenIssuerId, this.badgeNewFormGroup.value, this.templateFormGroup.value)
                .subscribe((badge: any) => {
                    console.log(badge);
                    this.openSnackBar('New Badge created successfully', 'Ok', 3000, true);
                }, err => {
                    this.openSnackBar(err.message, 'Ok', 4000, false);
                });
        }
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
