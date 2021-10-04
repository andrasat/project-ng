import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-bodytext-16',
  templateUrl: './bodytext-16.component.html',
  styleUrls: ['./bodytext-16.component.scss']
})
export class BodyText16Component {
  @Input() isSemiBold: boolean = false;
}