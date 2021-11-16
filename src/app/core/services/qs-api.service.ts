import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';

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
  IProfile,
  IOrderHistoryResult,
  IValidatePaymentResult,
  ISaveAddressInput,
  IFAQData,
  ITNCData,
  IValidateMember,
} from '@core/models';
import { separateAddress, utf8ToBase64 } from '@utils/index';

import { brandListData, getFAQData, getTNCData } from '../mock/';
import { IOrderData } from '@core/models/orderData';

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

  private _profileSubject = new BehaviorSubject<IProfile | undefined>(undefined)
  profile = this._profileSubject.asObservable()

  private _validatePaymentSubject = new BehaviorSubject<IValidatePaymentResult | undefined>(undefined)
  validatePaymentData = this._validatePaymentSubject.asObservable()

  private _currentAddressSubject = new BehaviorSubject<IAddress | undefined>(undefined)
  currentAddress = this._currentAddressSubject.asObservable()

  // INTERNAL METHODS

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  private get<T>(path: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()) {
    return this.http.get<T>(`${this.API_URL}${path}`, { params, headers })
      .pipe(catchError(this.formatErrors));
  }

  private post<T>(path: string, body: any = {}, headers: HttpHeaders = new HttpHeaders, params: HttpParams = new HttpParams()) {
    return this.http.post<T>(
      `${this.API_URL}${path}`,
      JSON.stringify(body),
      { headers, params },
    ).pipe(catchError(this.formatErrors));
  }

  private delete<T>(path: string, headers: HttpHeaders = new HttpHeaders) {
    return this.http.delete<T>(
      `${this.API_URL}${path}`,
      { headers },
    ).pipe(catchError(this.formatErrors));
  }

  // OTHER METHODS

  resetMenu() {
    this._menuSubject.next(undefined);
  }

  resetBranchData() {
    this._branchDataSubject.next(undefined);
  }

  // QS API METHODS

  getBranchList(lat: number, long: number) {
    return this.get<IBranchList>(`/web/qsv1/branch/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => data))
      .subscribe(branchList => this._branchListSubject.next(branchList));
  }

  getBranchData(branchCode: string) {
    return this.get<IBranchData>('/web/qsv1/setting/branch', undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data))
      .subscribe(branchData => this._branchDataSubject.next(branchData));
  }

  getBrandList(lat: number, long: number) {
    return this.get<IBrandList>(`/web/qsv1/brand/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Basic ${this.BASIC_TOKEN}`,
    }))
      .pipe(map(data => data))
      .subscribe(
        brandList => this._brandListSubject.next(brandList),
        () => this._brandListSubject.next(brandListData), // use mock data because CORS error
      );
  }

  getBrandData(lat: number, long: number, brandId: string) {
    return this.get<IBrandData>(`/web/qsv1/setting/brand/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Basic ${this.BASIC_TOKEN}`,
      'Data-Brand': brandId,
    }))
      .pipe(map(data => data))
      .subscribe(
        brandData => this._brandDataSubject.next(brandData),
      );
  }

  getPromotion(branchCode: string) {
    return this.get<IPromotion[]>(`/web/qsv1/promotion`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data))
      .subscribe(promotion => this._promotionSubject.next(promotion));
  }

  getMenu(branchCode: string, visitPurposeID: string) {
    return this.get<IMenuData>(`/web/qsv1/menu/${visitPurposeID}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data))
      .subscribe(menu => this._menuSubject.next(menu));
  }

  getSearch(keyword: string) {
    return this.get<any[]>(`/web/qsv1/map/search/${encodeURIComponent(keyword)}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => {
        return data.map<IAutocompleteResult>(each => ({
          placeId: each.placeId,
          description: each.description,
          displayName: separateAddress(each.description).addressName,
        }));
      }));
  }

  getAddress(lat: number, lon: number, branchCode = 'ABC') {
    return this.get<IAddressResult>(`/web/qsv1/map/address/${lat}/${lon}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(
        debounceTime(500),
        map((data) => separateAddress(data.address))
      )
      .subscribe(
        address => this._currentAddressSubject.next(address),
      );
  }

  getPlace(placeId: string) {
    return this.get<IPlaceResult>(`/web/qsv1/map/place/${placeId}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => ({
        lat: Number(data.lat),
        long: Number(data.long),
      })));
  }

  saveAuth(userData: IUserDataInput) {
    return this.post<IUserData>('/web/v1/user/auth', {
      ...userData,
      appID: 'esoqs',
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    }))
      .pipe(map(data => data));
  }

  getProfile(token: string) {
    return this.get<IProfile>('/web/v1/user/profile', undefined, new HttpHeaders({
      authorization: `Bearer ${token}`,
    }))
      .pipe(map(data => {
        return {
          ...data,
          addresses: data.addresses.map(address => {
            const separatedAddress = separateAddress(address.addressDescription);
            return {
              ...address,
              displayName: separatedAddress.addressName,
            };
          })
        };
      }))
      .subscribe(profile => this._profileSubject.next(profile));
  }

  saveAddress(data: ISaveAddressInput, token: string) {
    return this.post<boolean>('/web/v1/user/address', {
      ...data
    }, new HttpHeaders({
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }))
      .pipe(map(data => data));
  }

  deleteAddress(lat: number, long: number, token: string) {
    return this.delete<boolean>(`/web/v1/user/address/${lat}/${long}`, new HttpHeaders({
      authorization: `Bearer ${token}`,
    })).pipe(map(data => data));
  }

  getOrder(orderID: string) {
    return this.get<IOrderData>(`/web/qsv1/order/${orderID}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => data));
  }

  getOrderHistory(token: string, orderIds: string[]) {
    return this.post<IOrderHistoryResult>('/web/v1/user/order', orderIds, new HttpHeaders({
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }), new HttpParams({
      fromObject: {
        page: 1,
        limit: 5,
      },
    })).pipe(map(data => data));
  }

  calculateTotal(calculateTotal: ICalculateTotalInput, branchCode: string) {
    return this.post<ICalculateTotalResult>('/web/qsv1/order/calculate-total', {
      ...calculateTotal,
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data));
  }

  validateRadius(lat: number, long: number, branchCode: string) {
    return this.get<IValidateRadiusResult>(`/web/qsv1/map/distance/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data));
  }

  validatePromo(promotionCode: string, paymentMethodID: string) {
    return this.post<boolean>('/web/qsv1/promotion/validate-payment', {
      promotionCode,
      paymentMethodID,
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => data));
  }

  validatePayment(orderID: string) {
    return this.get<IValidatePaymentResult>(`/web/qsv1/payment/validate/${orderID}`, undefined, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
    }))
      .pipe(map(data => data))
      .subscribe(data => this._validatePaymentSubject.next(data));
  }

  validateMember(branchCode: string, memberID: string) {
    return this.post<IValidateMember>('/web/qsv1/membership', {
      key: memberID,
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data));
  }

  saveOrder(orderInput: IOrderInput, branchCode: string) {
    return this.post<ISaveOrderResult>('/web/qsv1/order', {
      ...orderInput,
    }, new HttpHeaders({
      authorization: `Bearer ${this.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      'Data-Branch': branchCode,
    }))
      .pipe(map(data => data));
  }

  getFAQData() {
    return new Observable<IFAQData[]>(observe => {
      observe.next(getFAQData());
      observe.complete();
    });
  }

  getTNCData() {
    return new Observable<ITNCData[]>(observe => {
      observe.next(getTNCData());
      observe.complete();
    });
  }
}