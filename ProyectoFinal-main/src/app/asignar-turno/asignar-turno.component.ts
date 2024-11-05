import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { TurnoService } from 'src/app/services/turno.service';

interface HorarioDisponible {
  hora: string;
  disponible: boolean;
}

interface Especialidad {
  id: number;
  descripcion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
}

interface Cobertura {
  id: number;
  nombre: string;
}

interface ApiResponse<T> {
  codigo: number;
  mensaje: string;
  payload: T;
}

@Component({
  selector: 'app-asignar-turno',
  templateUrl: './asignar-turno.component.html',
  styleUrls: ['./asignar-turno.component.css']
})
export class AsignarTurnoComponent implements OnInit {
  turnoForm: FormGroup;
  especialidades: Especialidad[] = [];
  medicos: Usuario[] = [];
  pacientes: Usuario[] = [];
  coberturas: Cobertura[] = [];
  horariosDisponibles: HorarioDisponible[] = [];

  constructor(
    private fb: FormBuilder,
    private especialidadService: EspecialidadService,
    private usuariosService: UsuariosService,
    private turnoService: TurnoService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AsignarTurnoComponent>
  ) {
    this.turnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      medico: ['', Validators.required],
      paciente: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      cobertura: ['', Validators.required],
      nota: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    // Cargar especialidades
    this.especialidadService.obtenerEspecialidades().subscribe({
      next: (response: ApiResponse<Especialidad[]>) => {
        if (response && response.codigo === 200 && response.payload) {
          this.especialidades = response.payload;
        } else {
          console.error('Error en la respuesta:', response);
          this._snackBar.open('Error al cargar especialidades', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (error: any) => {
        console.error('Error al cargar especialidades:', error);
        this._snackBar.open('Error al cargar especialidades', 'Cerrar', {
          duration: 3000
        });
      }
    });

    // Cargar pacientes
    this.usuariosService.obtenerPacientes().subscribe({
      next: (response: ApiResponse<Usuario[]>) => {
        if (response && response.codigo === 200 && response.payload) {
          this.pacientes = response.payload;
        } else {
          console.error('Error en la respuesta:', response);
          this._snackBar.open('Error al cargar pacientes', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (error: any) => {
        console.error('Error al cargar pacientes:', error);
        this._snackBar.open('Error al cargar pacientes', 'Cerrar', {
          duration: 3000
        });
      }
    });

    // Cargar coberturas
    this.especialidadService.obtenerCoberturas().subscribe({
      next: (response: ApiResponse<Cobertura[]>) => {
        if (response && response.codigo === 200 && response.payload) {
          this.coberturas = response.payload;
        } else {
          console.error('Error en la respuesta:', response);
          this._snackBar.open('Error al cargar coberturas', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (error: any) => {
        console.error('Error al cargar coberturas:', error);
        this._snackBar.open('Error al cargar coberturas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onEspecialidadChange(): void {
    const idEspecialidad = this.turnoForm.get('especialidad')?.value;
    if (idEspecialidad) {
      this.especialidadService.obtenerMedicoPorEspecialidad(idEspecialidad).subscribe({
        next: (response) => {
          if (response && response.codigo === 200 && response.payload) {
            this.medicos = response.payload;
          } else {
            console.error('Error en la respuesta:', response);
            this._snackBar.open('Error al cargar médicos', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error al cargar médicos:', error);
          this._snackBar.open('Error al cargar médicos', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  onMedicoFechaChange(): void {
    const idMedico = this.turnoForm.get('medico')?.value;
    const fecha = this.turnoForm.get('fecha')?.value;
    
    if (idMedico && fecha) {
      const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
      
      this.turnoService.obtenerTurnosMedico({
        id_medico: idMedico,
        fecha: fechaFormateada
      }).subscribe({
        next: (horarios) => {
          this.horariosDisponibles = horarios;
          this.turnoForm.patchValue({ hora: '' });
        },
        error: (error) => {
          this._snackBar.open('Error al obtener horarios disponibles', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.turnoForm.valid) {
      const turnoData = this.turnoForm.value;
      console.log('Datos del turno:', turnoData);
      // Aquí deberías llamar a tu servicio para guardar el turno
      this.dialogRef.close(turnoData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onMedicoChange(): void {
    const medicoId = this.turnoForm.get('medico')?.value;
    const fecha = this.turnoForm.get('fecha')?.value;
    if (medicoId && fecha) {
      this.cargarHorariosDisponibles(medicoId, fecha);
    }
  }

  onFechaChange(): void {
    const medicoId = this.turnoForm.get('medico')?.value;
    const fecha = this.turnoForm.get('fecha')?.value;
    if (medicoId && fecha) {
      this.cargarHorariosDisponibles(medicoId, fecha);
    }
  }

  cargarHorariosDisponibles(medicoId: number, fecha: Date): void {
    this.horariosDisponibles = [
      { hora: '09:00', disponible: true },
      { hora: '10:00', disponible: true },
      { hora: '11:00', disponible: true },
      { hora: '15:00', disponible: true },
      { hora: '16:00', disponible: true }
    ];
  }
}
