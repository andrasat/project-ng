import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrls: ['./secondary-button.component.scss'],
})
export class SecondaryButtonComponent {
  @Input() text: string = ''
  @Input() icon: string = ''
  @Input() invert: boolean = false
  @Input() transparent: boolean = false
  @Output() public clicked: EventEmitter<void> = new EventEmitter()
}