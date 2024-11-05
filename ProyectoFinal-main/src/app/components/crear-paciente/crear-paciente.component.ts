import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface FormControls {
  nombre: any[];
  apellido: any[];
  usuario: any[];
  dni: any[];
  mail: any[];
  telefono: any[];
  contrasenia: any[];
  confirmarContrasenia: any[];
  fechanac: any[];
  tipo_usuario?: any[];
}

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent {
  pacienteForm: FormGroup;
  rol = localStorage.getItem('rol');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearPacienteComponent>,
    private login: LoginService,
    private _snackBar: MatSnackBar
  ) {
    const formControls: FormControls = {
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      dni: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confirmarContrasenia: ['', Validators.required],
      fechanac: ['', Validators.required],
    };

    if (this.rol === 'administrador') {
      formControls.tipo_usuario = ['', Validators.required];
    } else {
      formControls.tipo_usuario = [''];
    }

    this.pacienteForm = this.fb.group(formControls);
  }

  contraseniasCoinciden(): boolean {
    return this.pacienteForm.get('contrasenia')?.value === this.pacienteForm.get('confirmarContrasenia')?.value;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.pacienteForm.valid) {
      this._snackBar.open('Por favor complete todos los campos requeridos', 'Aceptar', {
        duration: 3000
      });
      return;
    }

    if (!this.contraseniasCoinciden()) {
      this._snackBar.open('Las contraseñas no coinciden', 'Aceptar', {
        duration: 3000
      });
      return;
    }

    let body = {
      dni : this.pacienteForm.controls['dni'].value,
      apellido: this.pacienteForm.controls['apellido'].value,
      nombre: this.pacienteForm.controls['nombre'].value,
      fecha_nacimiento: this.pacienteForm.controls['fechanac'].value,
      password: this.pacienteForm.controls['contrasenia'].value,
      email: this.pacienteForm.controls['mail'].value,
      telefono:this.pacienteForm.controls['telefono'].value,
      rol:'',
      // usuario: this.pacienteForm.controls['usuario'].value
    }

    // Verifica el rol
    if (this.rol == 'operador') {
      // Si es operador, asigna rol 'paciente'
      body.rol = 'paciente';
    } else {
      // Si no es operador, asigna el rol del formulario 'tipo_usuario'
      body.rol = this.pacienteForm.controls['tipo_usuario'].value;
    }

    this.login.register(JSON.stringify(body)).subscribe((data : any) =>{
      console.warn(data);
      
      if (data.codigo === 200){
        console.log('Registro exitoso');
        this.dialogRef.close(this.pacienteForm.value);
      } else {
        console.log(data.mensaje)
      }
    })
  }
}
