import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { IBranchData, IBranchList } from '@core/models';

@Injectable()
export class QSApiService {
  constructor(
    private http: HttpClient,
  ) {}

  // INTERNAL METHODS

  private formatErrors(error: any) {
    console.log('error: ', error);
    return throwError(error.error);
  }

  private get(path: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.http.get(`${environment.apiQS}${path}`, { params, headers })
      .pipe(catchError(this.formatErrors));
  }

  private post(path: string, body: any = {}, headers: HttpHeaders = new HttpHeaders): Observable<any> {
    return this.http.post(
      `${environment.apiQS}${path}`,
      JSON.stringify(body),
      { headers },
    ).pipe(catchError(this.formatErrors));
  }

  private delete(path: string, headers: HttpHeaders = new HttpHeaders): Observable<any> {
    return this.http.delete(
      `${environment.apiQS}${path}`,
      { headers },
    ).pipe(catchError(this.formatErrors));
  }

  // QS API METHODS

  getBranchList(lat: number = -6.2087634, long: number = 106.84559899999999): Observable<IBranchList> {
    return this.get(`/web/qsv1/branch/${lat}/${long}`, undefined, new HttpHeaders({
      authorization: `Bearer ${environment.bearerQS}`,
    }))
      .pipe(map((data: IBranchList) => data));
  }

  getBranchData(branchCode: string): Observable<IBranchData> {
    return this.get('/web/qsv1/setting/branch', undefined, new HttpHeaders({
      authorization: `Bearer ${environment.bearerQS}`,
      'Data-Branch': branchCode,
    }))
      .pipe(map((data: IBranchData) => data));
  }
}