import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent {
  @Input() text: string = ''
  @Input() smallPadding: boolean = false
  @Output() public clicked: EventEmitter<void> = new EventEmitter()
}