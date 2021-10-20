import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GeolocationService, GEOLOCATION_SUPPORT } from '@ng-web-apis/geolocation';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  constructor(
    @Inject(GEOLOCATION_SUPPORT) private readonly geolocationSupport: boolean,
    private readonly geolocation: GeolocationService,
    private http: HttpClient,
  ) {}

  getInitialPosition() {
    if (this.geolocationSupport) {
      this.geolocation
        .pipe(take(1))
        .subscribe(
          position => {
            this._devicePositionSubject.next(position);
            this._currentPositionSubject.next(position);
          }
        );
    }
  }

  private _currentPositionSubject = new BehaviorSubject<GeolocationPosition>(this._getDefaultPosition())
  currentPosition = this._currentPositionSubject.asObservable()

  private _devicePositionSubject = new BehaviorSubject<GeolocationPosition>(this._getDefaultPosition())
  devicePosition = this._devicePositionSubject.asObservable()

  private _getDefaultPosition(): GeolocationPosition {
    return {
      coords: {
        accuracy: 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        latitude: -6.2087634,
        longitude: 106.84559899999999,
      },
      timestamp: Date.now(),
    };
  }

  updateCurrentPosition(position: GeolocationPosition) {
    this._currentPositionSubject.next(position);
  }

}