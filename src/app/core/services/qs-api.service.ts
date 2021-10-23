import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subscription } from 'rxjs';

import { catchError, debounceTime, map } from 'rxjs/operators';
import { IAddress, IAddressResult, IAutocompleteResult, IBranchData, IBranchList, IPlaceResult, IUserData, IUserDataInput } from '@core/models';
import { separateAddress } from '@utils/separateAddress';

@Injectable()
export class QSApiService {
  constructor(
    private http: HttpClient,
  ) {}

  API_URL = environment.devApiQS
  BEARER_TOKEN = environment.devBearerQS

  private _branchListSubject = new BehaviorSubject<IBranchList | undefined>(undefined)
  branchList = this._branchListSubject.asObservable()

  private _currentAddressSubject = new BehaviorSubject<IAddress | undefined>(undefined)
  currentAddress = this._currentAddressSubject.asObservable()

  // INTERNAL METHODS

  private formatErrors(error: any) {
    console.log('error: ', error);
    return throwError(error.error);
  }

  private get(path: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.get(`${this.API_URL}${path}`, { params, headers })
      .pipe(catchError(this.formatErrors));
  }

  private post(path: string, body: any = {}, headers: HttpHeaders = new HttpHeaders): Observable<any> {
    return this.http.post(
      `${this.API_URL}${path}`,
      JSON.stringify(body),
      { headers },
    ).pipe(catchError(this.formatErrors));
  }

  private delete(path: string, headers: HttpHeaders = new HttpHeaders): Observable<any> {
    return this.http.delete(
      `${this.API_URL}${path}`,
      { headers },
    ).pipe(catchError(this.formatErrors));
  }

  // QS API METHODS

  getBranchList(lat: number = -6.2087634, long: number = 106.84559899999999): Subscription {
    return this.get(`/web/qsv1/branch/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map((data: IBranchList) => data))
      .subscribe(branchList => this._branchListSubject.next(branchList));
  }

  getBranchData(branchCode: string): Observable<IBranchData> {
    return this.get('/web/qsv1/setting/branch', undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map((data: IBranchData) => data));
  }

  getSearch(keyword: string): Observable<IAutocompleteResult[]> {
    return this.get(`/web/qsv1/map/search/${encodeURIComponent(keyword)}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map((data: any[]) => {
        return data.map<IAutocompleteResult>(each => ({
          placeId: each.placeId,
          description: each.description,
          displayName: each.description.split(', ')[0],
        }));
      }));
  }

  getAddress(lat: number, lon: number, branchCode = 'ABC'): Subscription {
    return this.get(`/web/qsv1/map/address/${lat}/${lon}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(
        debounceTime(500),
        map((data: IAddressResult) => separateAddress(data.address))
      )
      .subscribe(address => this._currentAddressSubject.next(address));
  }

  getPlace(placeId: string): Observable<IPlaceResult> {
    console.log('placeId: ', placeId);
    return this.get(`/web/qsv1/map/place/${placeId}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => ({
        lat: Number(data.lat),
        long: Number(data.long),
      })));
  }

  saveAuth(userData: IUserDataInput): Observable<IUserData> {
    return this.post('/web/v1/user/auth', {
      ...userData,
      appID: 'esoqs',
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    }))
      .pipe(map((data: IUserData) => data));
  }
}