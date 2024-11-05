import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:4000/api';
  token: any = localStorage.getItem('jwt');

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.token
    });
  }

  obtenerPacientes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/obtenerPacientes`, { headers });
  }
} 