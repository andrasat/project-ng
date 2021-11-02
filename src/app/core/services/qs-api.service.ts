import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subscription } from 'rxjs';

import { catchError, debounceTime, map } from 'rxjs/operators';
import {
  IAddress,
  IAddressResult,
  IAutocompleteResult,
  IBranchData,
  IBranchList,
  IBrandList,
  IBrandData,
  IPlaceResult,
  IUserData,
  IUserDataInput,
  IPromotion,
  IMenuData,
  IOrderInput,
  ISaveOrderResult,
  ICalculateTotalInput,
  ICalculateTotalResult,
  IValidateRadiusResult,
} from '@core/models';
import { separateAddress, utf8ToBase64 } from '@utils/index';

import { brandListData, getAddress } from '../mock/';

@Injectable()
export class QSApiService {
  constructor(
    private http: HttpClient,
  ) {}

  API_URL = environment.apiQS
  BEARER_TOKEN = environment.bearerQS
  BASIC_TOKEN = utf8ToBase64(`${environment.usernameQS}:${environment.passwordQS}`)

  private _branchListSubject = new BehaviorSubject<IBranchList | undefined>(undefined)
  branchList = this._branchListSubject.asObservable()

  private _branchDataSubject = new BehaviorSubject<IBranchData | undefined>(undefined)
  branchData = this._branchDataSubject.asObservable()

  private _brandListSubject = new BehaviorSubject<IBrandList | undefined>(undefined)
  brandList = this._brandListSubject.asObservable()

  private _brandDataSubject = new BehaviorSubject<IBrandData | undefined>(undefined)
  brandData = this._brandDataSubject.asObservable()

  private _promotionSubject = new BehaviorSubject<IPromotion[] | undefined>(undefined)
  promotion = this._promotionSubject.asObservable()

  private _menuSubject = new BehaviorSubject<IMenuData | undefined>(undefined)
  menu = this._menuSubject.asObservable()

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

  // METHODS

  resetMenu() {
    this._menuSubject.next(undefined);
  }

  resetBranchData() {
    this._branchDataSubject.next(undefined);
  }

  // QS API METHODS

  getBranchList(lat: number = -6.2087634, long: number = 106.84559899999999): Subscription {
    return this.get(`/web/qsv1/branch/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map((data: IBranchList) => data))
      .subscribe(branchList => this._branchListSubject.next(branchList));
  }

  getBranchData(branchCode: string): Subscription {
    return this.get('/web/qsv1/setting/branch', undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map((data: IBranchData) => data))
      .subscribe(branchData => this._branchDataSubject.next(branchData));
  }

  getBrandList(lat: number = -6.2087634, long: number = 106.84559899999999): Subscription {
    return this.get(`/web/qsv1/brand/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Basic ${this.BASIC_TOKEN}`,
    }))
      .pipe(map((data: IBrandList) => data))
      .subscribe(
        brandList => this._brandListSubject.next(brandList),
        () => this._brandListSubject.next(brandListData), // use mock data because CORS error
      );
  }

  getBrandData(lat: number = -6.2087634, long: number = 106.84559899999999, brandId: string): Subscription {
    return this.get(`/web/qsv1/setting/brand/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Basic ${this.BASIC_TOKEN}`,
      'Data-Brand': brandId,
    }))
      .pipe(map((data: IBrandData) => data))
      .subscribe(
        brandData => this._brandDataSubject.next(brandData),
      );
  }

  getPromotion(branchCode: string): Subscription {
    return this.get(`/web/qsv1/promotion`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data))
      .subscribe(promotion => this._promotionSubject.next(promotion));
  }

  getMenu(branchCode: string, visitPurposeID: string): Subscription {
    return this.get(`/web/qsv1/menu/${visitPurposeID}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data))
      .subscribe(menu => this._menuSubject.next(menu));
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

  getAddress(lat: number, lon: number, branchCode = 'TC001'): Subscription {
    return this.get(`/web/qsv1/map/address/${lat}/${lon}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(
        debounceTime(500),
        map((data: IAddressResult) => separateAddress(data.address))
      )
      .subscribe(
        address => this._currentAddressSubject.next(address),
        () => this._currentAddressSubject.next(separateAddress(getAddress()))
      );
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

  calculateTotal(calculateTotal: ICalculateTotalInput, branchCode: string): Observable<ICalculateTotalResult> {
    return this.post('/web/qsv1/order/calculate-total', {
      ...calculateTotal,
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data));
  }

  validateRadius(lat: number, long: number, branchCode: string): Observable<IValidateRadiusResult> {
    return this.get(`/web/qsv1/map/distance/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data));
  }

  saveOrder(orderInput: IOrderInput, branchCode: string): Observable<ISaveOrderResult> {
    return this.post('/web/qsv1/order', {
      ...orderInput,
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      'Data-Branch': branchCode,
    }))
      .pipe(map((data: ISaveOrderResult) => data));
  }
}