import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginSignUpComponent } from './components/login-sign-up/login-sign-up.component';
import { PantallaPrincipalComponent } from './components/pantalla-principal/pantalla-principal.component';
import { NuevoTurnoComponent } from './components/nuevo-turno/nuevo-turno.component';
import { CrearPacienteComponent } from './components/crear-paciente/crear-paciente.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login-signUp', component: LoginSignUpComponent},
  { path: 'pantalla-principal', component: PantallaPrincipalComponent},
  { path: 'nuevo-turno', component: NuevoTurnoComponent},
  { path: 'crear-paciente', component: CrearPacienteComponent},
  { path: 'mis-datos', component: MisDatosComponent},
  { path: 'mis-turnos', component: MisTurnosComponent},
  { path: 'lista-usuarios', component: ListaUsuariosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
