import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Empresas } from '../models/empresas';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = environment.ConexionWebApiProxy + 'empresas/';
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  post(obj: Empresas) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}
