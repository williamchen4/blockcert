/*
 * Copyright (C) 2018. Technology Services at California State University, Fresno
 */

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ApiService } from '../api.service';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'app-badge-issue',
    templateUrl: './badge-issue.component.html',
    styleUrls: ['./badge-issue.component.scss']
})
export class BadgeIssueComponent implements OnInit {
    issueIssuerFormGroup: FormGroup;
    issueBadgesFormGroup: FormGroup;
    issueRecipientsFormGroup: FormGroup;

    recipientNewFormGroup: FormGroup;

    recipientManageSearchFormGroup: FormGroup;
    recipientDetailsFormGroup: FormGroup;

    issuerIds = [];
    badgeIds = [];

    badgeIdsManage = [];

    recipientIssuerIds = [];
    myArray=[];

    allRecipientIDandEmail = [];

    constructor(private formBuilder: FormBuilder,
                private api: ApiService,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.getAllRecipientIDandEmail();

        this.issueIssuerFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.issueBadgesFormGroup = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.issueRecipientsFormGroup = this.formBuilder.group({
            id: [''],
            ids: []
        });
        this.recipientNewFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            addresses: [[]], // hidden
            certs: [[]] // hidden
        });
        this.recipientManageSearchFormGroup = this.formBuilder.group({
            id: ['', Validators.required]
        });
        this.recipientDetailsFormGroup = this.formBuilder.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            email: ['', Validators.required],
            addresses: [[]], //this.formBuilder.array([[]]),
            certs: this.formBuilder.array([[]])
        });
        this.tabSelected(0);

        this.recipientManageSearchFormGroup.valueChanges.subscribe(() => {
            const query = this.recipientManageSearchFormGroup.get('id').value.toString().trim();
            this.api.getRecipientSearchSuggestions(query)
                .subscribe((suggestions: string[]) => {
                    this.badgeIdsManage = suggestions;
                });
        });
    }

    tabSelected(index: any) {
        switch (index) {
            case 0:
                this.getIssuersIds();
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }

    public changeListener(files: FileList){
        console.log(files);
        if(files && files.length > 0) {
           let file : File = files.item(0); 
             console.log(file.name);
             console.log(file.size);
             console.log(file.type);
             let reader: FileReader = new FileReader();
             reader.readAsText(file);
             reader.onload = (e) => {
                //let csv: string = reader.result;
                this.issueRecipientsFormGroup.patchValue({ids: [reader.result]});   
            }
          }
      }

    getAllRecipientIDandEmail() {
        this.api.getRecipients().subscribe((ids: string[]) => {
            this.allRecipientIDandEmail = ids;
        });
    }

    getIssuersIds() {
        this.api.getIssuerIds().subscribe((ids: string[]) => {
            console.log(ids);
            this.issuerIds = ids;
        }, err => {
            this.openSnackBar(err.message ? err.message : 'It broke!', 'OK',
                3000, false);
            console.log(err);
        });
    }

    getBadgeIds() {
        const chosenIssuer = this.issueIssuerFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        this.api.getBadgeIds(chosenIssuerId)
            .subscribe((ids: string[]) => {
                console.log(ids);
                this.badgeIds = ids;
            }, err => {
                this.openSnackBar(err.message ? err.message : 'It broke!', 'OK',
                    3000, false);
                console.log(err);
            });
    }

    getRecipientById() {
        this.api.getRecipientById(this.recipientManageSearchFormGroup.get('id').value)
            .subscribe(recipient => {
                console.log(recipient);
                this.recipientDetailsFormGroup.patchValue(recipient);
                this.myArray=(recipient['addresses']);
            }, err => {
                this.openSnackBar(err.message ? 'Recipient does not exist' : 'It broke!', 'OK',
                    3000, false);
                console.log(err);
            });
    }

    postRecipient() {
        console.log(this.recipientNewFormGroup.value);
        this.api.postRecipient(this.recipientNewFormGroup.value)
            .subscribe(res => {
                console.log(res);
                this.openSnackBar(res.message ? res.message : 'Created successfully!', 'OK',
                    3000, true);
            this.getAllRecipientIDandEmail();
            }, err => {
                this.openSnackBar(err.message ? err.message : 'It broke!', 'OK',
                    3000, false);
                console.log(err);
            });
    }

    postRecipientById() {
        console.log(this.recipientDetailsFormGroup.value);
        this.api.postRecipientById(this.recipientDetailsFormGroup.value)
            .subscribe(res => {
                console.log(res);
                this.openSnackBar(res.message ? res.message : 'Updated successfully!', 'OK',
                    3000, true);
            }, err => {
                this.openSnackBar(err.message ? err.message : 'It broke!', 'OK',
                    3000, false);
                console.log(err);
            });
    }

    get ctrlIssueRecipients() {
        return (<FormArray>this.issueRecipientsFormGroup.get('ids')).controls;
    }

    get ctrlRecipientsDetailsAddresses() {
        return (<FormArray>this.recipientDetailsFormGroup.get('addresses')).controls;
    }

    get ctrlRecipientsDetailsCerts() {
        return (<FormArray>this.recipientDetailsFormGroup.get('certs')).controls;
    }

    @ViewChild('myInput') myInputVariable: any;    

    resetIssue() {
        this.issueRecipientsFormGroup.setValue({
            id: [''],
            ids: []
        })
        this.myInputVariable.nativeElement.value = "";
    }
    postIssueBadgeRecipients() {
        const chosenIssuer = this.issueIssuerFormGroup.get('name').value;
        const chosenIssuerId = this.issuerIds.filter(obj => obj.name === chosenIssuer)[0].id;
        const chosenBadge = this.issueBadgesFormGroup.get('name').value;
        const chosenBadgeId = this.badgeIds.filter(obj => obj.name === chosenBadge)[0].id;
        
        var single = this.issueRecipientsFormGroup.get('id').value
        var multiple = this.issueRecipientsFormGroup.get('ids').value

        console.log('single ' + single);
        console.log('multiple ' + multiple);

        if (single.toString().length > 1 && multiple != null){
            this.openSnackBar('Cannot issue to both single and multiple', 'OK', 5000, false);
        }
        else {
            this.api.postIssueBadgeRecipient(chosenIssuerId, chosenBadgeId, multiple == null ? single : multiple)
            .subscribe(res => {
                console.log(res);
                this.openSnackBar(res.message ? res.message : 'Issue successful!', 'OK', 3000, true);
            }, err => {
                this.openSnackBar(err.message, 'OK', 3000, false);
            });
        }
    }

    addIssueRecipients(formGroup: FormGroup) {
        // add recipients to issuers
        const control = <FormArray>formGroup.controls['ids'];
        control.push(new FormControl());
    }

    removeIssueRecipients(formGroup: FormGroup, i: number) {
        const control = <FormArray>formGroup.controls['ids'];
        control.removeAt(i);
    }

    addRecipientAddress(formGroup: FormGroup) {
        // add recipients to issuers
        const control = <FormArray>formGroup.controls['addresses'];
        control.push(new FormControl());
    }

    removeRecipientAddress(formGroup: FormGroup, i: number) {
        const control = <FormArray>formGroup.controls['addresses'];
        control.removeAt(i);
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

    manageRecipientIssue() {
        this.api.postBadgeIssueRecipientBlockchain()
            .subscribe(console.log);
    }
}
