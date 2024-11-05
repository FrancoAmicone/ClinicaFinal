import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface HorarioDisponible {
  id: number;
  hora: string;
  disponible: boolean;
}

interface TurnoMedicoRequest {
  id_medico: number;
  fecha: string;
}

interface TurnoResponse {
  codigo: number;
  mensaje: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  obtenerTurnosMedico(data: TurnoMedicoRequest): Observable<HorarioDisponible[]> {
    return this.http.post<HorarioDisponible[]>(`${this.apiUrl}/obtenerTurnosMedico`, data);
  }

  asignarTurnoPaciente(data: any): Observable<TurnoResponse> {
    return this.http.post<TurnoResponse>(`${this.apiUrl}/asignarTurnoPaciente`, data);
  }

  login(credentials: {usuario: string, password: string}) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }
}