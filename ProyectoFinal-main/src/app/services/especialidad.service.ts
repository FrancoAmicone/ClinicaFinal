import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = 'http://localhost:4000/api';
  token: any = localStorage.getItem('jwt');

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.token
    });
  }

  obtenerEspecialidades(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/obtenerEspecialidades`, { headers });
  }

  obtenerMedicoPorEspecialidad(idEspecialidad: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${idEspecialidad}`, { headers });
  }

  obtenerCoberturas(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/obtenerCoberturas`, { headers });
  }
}