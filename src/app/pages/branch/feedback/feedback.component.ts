import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@core/services';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-order-history-feedback',
  templateUrl: 'feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})

export class FeedbackComponent implements AfterViewInit {
  constructor(
    public route: ActivatedRoute,
    public navigation: NavigationService,
  ) { }

  @ViewChild('notesInput') notesInputRef: ElementRef<HTMLTextAreaElement>

  starRate = 0
  selectedWhatWentWell = ''
  notes = ''

  ngAfterViewInit() {
    fromEvent(this.notesInputRef.nativeElement, 'input')
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.notes = this.notesInputRef.nativeElement.value;
      });
  }

  setStarRate(index: number) {
    this.starRate = index;
  }

  selectWhatWentWell(value: string) {
    this.selectedWhatWentWell = value;
  }

  goBack() {
    return this.navigation.navigate('..', { relativeTo: this.route });
  }
}