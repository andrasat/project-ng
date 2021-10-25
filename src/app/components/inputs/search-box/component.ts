import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-input-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})

export class SearchBoxComponent implements AfterViewInit {
  @Input() placeholder: string = 'Search'

  @Output() focusEvent = new EventEmitter()
  @Output() focusOutEvent = new EventEmitter()
  @Output() searchEvent = new EventEmitter<string>()

  @ViewChild('searchinput') inputRef: ElementRef<HTMLInputElement>

  ngAfterViewInit() {
    fromEvent(this.inputRef.nativeElement, 'input')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.searchEvent.emit(this.inputRef.nativeElement.value);
      });
  }
}