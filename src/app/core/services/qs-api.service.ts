import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()
export class QSApiService {
  constructor(
    private http: HttpClient,
  ) {}

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  private get(path: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = new HttpHeaders): Observable<any> {
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

  getBranchList(lat: number, long: number) {
    this.get(`/web/qsv1/branch/${lat}/${long}`);
  }
}