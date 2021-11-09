import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IContact, IOrderInput, IProfile, IUserData } from '@core/models';
import { NavigationService, QSApiService, StorageService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-choose-contact',
  templateUrl: 'choose-contact.component.html',
  styleUrls: ['./choose-contact.component.scss'],
})

export class ChooseContactComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public storageService: StorageService,
    public navigation: NavigationService,
    public collapseConfig: NgbCollapseConfig,
  ) {
    collapseConfig.animation = false;

    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  private unsubscribe$ = new Subject<void>()

  deleteContactClass: Record<string, boolean> = {}
  queryParams: any = {}

  user: IUserData | undefined
  orderInput: IOrderInput | undefined
  currentProfile: IProfile | undefined
  contactList: IContact[] = []
  hideCollapse = true

  contactFormGroup = new FormGroup({
    contactName: new FormControl('', [Validators.required]),
    contactPhone: new FormControl('', [Validators.pattern(/\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/)]),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
  })

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    const userData = this.storageService.getItem('user');
    const contactListData = this.storageService.getItem('contactList');
    const orderInputData = this.storageService.getItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`);

    if (contactListData) {
      this.contactList = JSON.parse(contactListData);
    }

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
    }

    if (userData) {
      this.user = JSON.parse(userData) as IUserData;
      this.qsApiService.getProfile(this.user.token || '');
    }

    this.qsApiService.profile
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profile => {
        this.currentProfile = profile;

        if (profile && this.orderInput) {
          const contactEmailControl = this.contactFormGroup.get('contactEmail');
          const saveContactControl = new FormControl(false);

          contactEmailControl?.disable();
          contactEmailControl?.setValue(profile.email);

          this.contactFormGroup.addControl('saveContact', saveContactControl);
        }
      });
  }

  setSaveContact() {
    const saveContactVal = this.contactFormGroup.get('saveContact')?.value;
    this.contactFormGroup.get('saveContact')?.setValue(!saveContactVal);
  }

  selectContact(contact: IContact) {
    if (!this.orderInput && this.queryParams.companyCode && this.queryParams.branchCode) {
      return this.navigation.navigate(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}`);
    }

    if (!this.orderInput) {
      this.contactFormGroup.controls['contactName'].setValue(contact.contactName);
      this.contactFormGroup.controls['contactPhone'].setValue(contact.contactPhone);
      this.contactFormGroup.controls['contactEmail'].setValue(contact.contactEmail);
      this.hideCollapse = false;
      return;
    }

    this.orderInput.email = contact.contactEmail;
    this.orderInput.fullName = contact.contactName;
    this.orderInput.phoneNumber = contact.contactPhone || '';
    console.log(contact);
    console.log(this.orderInput);

    this.storageService.setItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`, JSON.stringify(this.orderInput));

    return this.navigation.navigate(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
      queryParams: {
        orderMode: this.queryParams.orderMode,
      }
    });
  }

  confirmDeleteContact() {
    this.deleteContactClass = {
      show: true
    };
  }

  hideConfirmDeleteContact() {
    this.deleteContactClass = {
      show: false
    };
  }

  hideContactForm() {
    this.hideCollapse = true;
    this.contactFormGroup.reset();
  }

  deleteContact() {
    const newContact = this.contactFormGroup.value;
    const foundContactIndex = this.contactList.findIndex(contact => contact.contactName === newContact.contactName);

    if (foundContactIndex >= 0) {
      this.contactList.splice(foundContactIndex, 1);
      this.storageService.setItem('contactList', JSON.stringify(this.contactList));
    }

    this.deleteContactClass = {
      show: false
    };
    this.hideCollapse = true;
    this.contactFormGroup.reset();
  }

  saveContactList() {
    if (!this.contactFormGroup.valid) return;

    const newContact = this.contactFormGroup.getRawValue();
    const foundContactIndex = this.contactList.findIndex(contact => contact.contactName === newContact.contactName);

    if (foundContactIndex >= 0) {
      this.contactList[foundContactIndex] = newContact;
    } else {
      this.contactList.push(newContact);
    }

    this.storageService.setItem('contactList', JSON.stringify(this.contactList));

    if (newContact.saveContact) {
      // save contact QS API
    }

    this.hideCollapse = true;
    this.contactFormGroup.reset();
  }

  goBack() {
    if (this.queryParams.from === 'checkout' && this.queryParams.companyCode && this.queryParams.branchCode) {
      return this.navigation.back(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
        queryParams: {
          orderMode: this.queryParams.orderMode,
        }
      });
    }

    if (this.queryParams.companyCode) {
      return this.navigation.back(`/${this.queryParams.companyCode}/others`);
    }

    return this.navigation.back();
  }
}