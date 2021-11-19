import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-time-picker',
  templateUrl: 'time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  constructor(
    public zone: NgZone,
  ) { }

  private _destroySubject = new Subject()
  destroy = this._destroySubject.asObservable()

  @ViewChild('hourOverlay') hourOverlay: ElementRef<HTMLDivElement>
  @ViewChild('minuteOverlay') minuteOverlay: ElementRef<HTMLDivElement>

  @Output() selectedHourChanged: EventEmitter<string> = new EventEmitter()
  @Output() selectedMinuteChanged: EventEmitter<string> = new EventEmitter()

  transitionClass: Record<string, boolean> = {}
  hourMoveDirection = ''
  minuteMoveDirection = ''

  hourList = this._getHourList()
  hourTranslateY = -250
  backgroundHourTranslateY = -90

  minuteList = ['45','00','15','30','45','00','15','30','45','00','15']
  minuteTranslateY = -250
  backgroundMinuteTranslateY = -90

  hourLastTouchPos = 0
  hourStartTouchPos = 0

  minuteLastTouchPos = 0
  minuteStartTouchPos = 0

  private _getHourList() {
    const currentHour = new Date().getHours();

    const fiveHourAhead = Array.from({ length: 5 }).map((_,i) => {
      let nextHour = currentHour + (i + 1);
      if (nextHour > 24) nextHour = nextHour - 24;

      if (String(nextHour).length < 2) {
        return `0${nextHour}`;
      } else {
        return String(nextHour);
      }
    });

    const fiveHourAgo = Array.from({ length: 5 }).map((_,i) => {
      let hourAgo = currentHour - (i + 1);
      if (hourAgo < 0) hourAgo = hourAgo + 24;

      if (String(hourAgo).length < 2) {
        return `0${hourAgo}`;
      } else {
        return String(hourAgo);
      }
    }).sort((a,b) => Number(a) - Number(b));
  
    const currentStringHour = String(currentHour).length < 2 ? `0${currentHour}` : String(currentHour);

    return [...fiveHourAgo , currentStringHour, ...fiveHourAhead];
  }

  private _getTransitionEndEventName() {
    const transitions: {
      [key: string]: string
    } = {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    };

    const bodyStyle: any = document.body.style;
    return Object.keys(transitions).reduce((transitionEndName, nextKey) => {
      if (bodyStyle[nextKey] != undefined) return transitions[nextKey];
      return transitionEndName;
    }, '');
  }

  private _moveDownHour() {
    let hourAgo = String(Number(this.hourList[0]) - 1);
    if (Number(hourAgo) < 0) hourAgo = '24';

    this.hourList.pop();
    if (hourAgo.length < 2) {
      this.hourList.unshift(`0${hourAgo}`);
    } else {
      this.hourList.unshift(hourAgo);
    }
  }

  private _moveUpHour() {
    let nextHour = String(Number(this.hourList[this.hourList.length - 1]) + 1);
    if (Number(nextHour) > 24) nextHour = '0';

    this.hourList.shift();
    if (nextHour.length < 2) {
      this.hourList.push(`0${nextHour}`);
    } else {
      this.hourList.push(nextHour);
    }
  }

  private _moveDownMinute() {
    let minuteAgo = String(Number(this.minuteList[0]) - 15);
    if (Number(minuteAgo) < 0) minuteAgo = '45';

    this.minuteList.pop();
    if (minuteAgo.length < 2) {
      this.minuteList.unshift(`0${minuteAgo}`);
    } else {
      this.minuteList.unshift(minuteAgo);
    }
  }

  private _moveUpMinute() {
    let nextMinute = String(Number(this.minuteList[this.minuteList.length - 1]) + 15);
    if (Number(nextMinute) > 45) nextMinute = '0';

    this.minuteList.shift();
    if (nextMinute.length < 2) {
      this.minuteList.push(`0${nextMinute}`);
    } else {
      this.minuteList.push(nextMinute);
    }
  }

  private _setSelectedHour() {
    this.selectedHourChanged.emit(this.hourList[Math.floor(this.hourList.length / 2)]);
  }

  private _setSelectedMinute() {
    this.selectedMinuteChanged.emit(this.minuteList[Math.floor(this.minuteList.length / 2)]);
  }

  private _moveHourTranslateY(deltaY: number) {
    this.hourTranslateY = this.hourTranslateY - deltaY;
  }

  private _moveHourBgTranslateY(deltaY: number) {
    this.backgroundHourTranslateY = this.backgroundHourTranslateY - deltaY;
  }

  private _moveMinuteTranslateY(deltaY: number) {
    this.minuteTranslateY = this.minuteTranslateY - deltaY;
  }

  private _moveMinuteBgTranslateY(deltaY: number) {
    this.backgroundMinuteTranslateY = this.backgroundMinuteTranslateY - deltaY;
  }

  private _resetTranslateY() {
    this.hourTranslateY = -250;
    this.backgroundHourTranslateY = -90;
  }

  private _resetMinuteTranslateY() {
    this.minuteTranslateY = -250;
    this.backgroundMinuteTranslateY = -90;
  }

  ngOnInit() {
    this.selectedHourChanged.emit(this.hourList[Math.floor(this.hourList.length / 2)]);
    this.selectedMinuteChanged.emit('00');
  }

  ngOnChanges(changes: any) {
    console.log(changes);
  }

  ngAfterViewInit() {
    // hourOverlay events handler
    fromEvent<TouchEvent>(this.hourOverlay.nativeElement, 'touchstart')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        this.transitionClass = { 'transition-transform': false };
        this.hourLastTouchPos = Math.round(event.changedTouches[0].clientY);
        this.hourStartTouchPos = Math.round(event.changedTouches[0].clientY);
      });

    fromEvent<WheelEvent>(this.hourOverlay.nativeElement, 'wheel')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        this.zone.run(() => {
          if (event.deltaY < 0) {
            this._moveDownHour();
          } else {
            this._moveUpHour();
          }
        });

        this._setSelectedHour();
      });

    fromEvent<TouchEvent>(this.hourOverlay.nativeElement, 'touchmove')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        const currentYPos = Math.round(event.changedTouches[0].clientY);

        this.zone.run(() => {
          this._moveHourTranslateY(this.hourLastTouchPos - currentYPos);
          this._moveHourBgTranslateY(this.hourLastTouchPos - currentYPos);
        });

        this.hourLastTouchPos = currentYPos;
      });

    fromEvent<TouchEvent>(this.hourOverlay.nativeElement, 'touchend')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        const endYPos = Math.round(event.changedTouches[0].clientY);
        const movedPixelsCount = endYPos - this.hourStartTouchPos;

        if (movedPixelsCount > 0) {
          this.hourMoveDirection = 'up';
        } else {
          this.hourMoveDirection = 'down';
        }

        if (Math.abs(movedPixelsCount) > 25) {
          const reminder = (50 - Math.abs(movedPixelsCount));
          const bgReminder = (30 - Math.abs(movedPixelsCount));

          if (movedPixelsCount > 0) {
            this._moveHourTranslateY(-reminder);
            this._moveHourBgTranslateY(-bgReminder);
          } else {
            this._moveHourTranslateY(reminder);
            this._moveHourBgTranslateY(bgReminder);
          }
        } else {
          this.hourMoveDirection = '';
          this._moveHourTranslateY(movedPixelsCount);
          this._moveHourBgTranslateY(movedPixelsCount);
        }

        this.transitionClass = { 'transition-transform': true };
        const hourTimeEL = document.querySelector<HTMLSpanElement>('.selected-hour-time');

        if (hourTimeEL) {
          hourTimeEL.addEventListener(this._getTransitionEndEventName(), () => {
            this.transitionClass = { 'transition-transform': false };
            this._resetTranslateY();

            switch(this.hourMoveDirection) {
              case 'up':
                this._moveDownHour();
                break;
              case 'down':
                this._moveUpHour();
                break;
            }

            this.hourMoveDirection = '';
            this._setSelectedHour();
          });
        }
      });

    // minuteOverlay events handler
    fromEvent<TouchEvent>(this.minuteOverlay.nativeElement, 'touchstart')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        this.transitionClass = { 'transition-transform': false };
        this.minuteLastTouchPos = Math.round(event.changedTouches[0].clientY);
        this.minuteStartTouchPos = Math.round(event.changedTouches[0].clientY);
      });

    fromEvent<WheelEvent>(this.minuteOverlay.nativeElement, 'wheel')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        this.zone.run(() => {
          if (event.deltaY < 0) {
            this._moveDownMinute();
          } else {
            this._moveUpMinute();
          }
        });

        this._setSelectedMinute();
      });

    fromEvent<TouchEvent>(this.minuteOverlay.nativeElement, 'touchmove')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        const currentYPos = Math.round(event.changedTouches[0].clientY);

        this.zone.run(() => {
          this._moveMinuteTranslateY(this.minuteLastTouchPos - currentYPos);
          this._moveMinuteBgTranslateY(this.minuteLastTouchPos - currentYPos);
        });

        this.minuteLastTouchPos = currentYPos;
      });

    fromEvent<TouchEvent>(this.minuteOverlay.nativeElement, 'touchend')
      .pipe(takeUntil(this.destroy))
      .subscribe(event => {
        const endYPos = Math.round(event.changedTouches[0].clientY);
        const movedPixelsCount = endYPos - this.minuteStartTouchPos;

        if (movedPixelsCount > 0) {
          this.minuteMoveDirection = 'up';
        } else {
          this.minuteMoveDirection = 'down';
        }

        if (Math.abs(movedPixelsCount) > 25) {
          const reminder = (50 - Math.abs(movedPixelsCount));
          const bgReminder = (30 - Math.abs(movedPixelsCount));

          if (movedPixelsCount > 0) {
            this._moveMinuteTranslateY(-reminder);
            this._moveMinuteBgTranslateY(-bgReminder);
          } else {
            this._moveMinuteTranslateY(reminder);
            this._moveMinuteBgTranslateY(bgReminder);
          }
        } else {
          this.minuteMoveDirection = '';
          this._moveMinuteTranslateY(movedPixelsCount);
          this._moveMinuteBgTranslateY(movedPixelsCount);
        }

        this.transitionClass = { 'transition-transform': true };
        const minuteTimeEl = document.querySelector<HTMLSpanElement>('.selected-minute-time');

        if (minuteTimeEl) {
          minuteTimeEl.addEventListener(this._getTransitionEndEventName(), () => {
            this.transitionClass = { 'transition-transform': false };
            this._resetMinuteTranslateY();

            switch(this.minuteMoveDirection) {
              case 'up':
                this._moveDownMinute();
                break;
              case 'down':
                this._moveUpMinute();
                break;
            }

            this.minuteMoveDirection = '';
            this._setSelectedMinute();
          });
        }
      });
  }

  ngOnDestroy() {
    this._destroySubject.next();
    this.selectedHourChanged.emit('');
    this.selectedMinuteChanged.emit('');
  }
}