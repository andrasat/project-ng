import { Component, Input, OnInit } from '@angular/core';
import { IContact } from '@core/models';

@Component({
  selector: 'app-contact-list',
  templateUrl: 'contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})

export class ContactListComponent {
  @Input() contact: IContact
}