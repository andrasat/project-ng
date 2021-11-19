import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  @Output() public clicked: EventEmitter<void> = new EventEmitter()
}
