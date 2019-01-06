import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-owner',
    templateUrl: './owner.component.html',
    styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {

    issueSearchIdFormGroup: FormGroup;
    issuerExistingFormGroup: FormGroup;

    issuerIds = [];

    constructor(private formBuilder: FormBuilder,
                private api: ApiService,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
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
        // need this as first tab require ids
        this.getOwnedIssuersIds();
    }

    tabSelected(index: any) {
        switch (index) {
            case 0:
                this.getOwnedIssuersIds();
                break;
        }
    }

    getOwnedIssuersIds() {
        this.api.getOwnedIssuerIds().subscribe((ids: string[]) => {
            console.log(ids);
            this.issuerIds = ids;
        });
    }

    getIssuerById() {
        console.log(this.issueSearchIdFormGroup);
        const chosenIssuer = this.issueSearchIdFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        this.api.getIssuerById(chosenIssuerId).subscribe((issuer: any) => {
            console.log(issuer);
            issuer.publicKey = issuer.publicKey[issuer.publicKey.length - 1].id;
            issuer.publicKey = issuer.publicKey.split(':')[issuer.publicKey.split(':').length - 1];
            this.issuerExistingFormGroup.patchValue(issuer);
        });
    }

    postIssuer() {
        this.api.postIssuerById(this.issuerExistingFormGroup.value)
            .subscribe((issuer: any) => {
                console.log(issuer);
                this.openSnackBar('Issuer updated successfully', 'Ok', 3000, true);
            }, err => {
                this.openSnackBar(err.message, 'Ok', 4000, false);
            });
    }

    get baseToImgExisting() {
        return this.issuerExistingFormGroup.get('image').value;
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

}
