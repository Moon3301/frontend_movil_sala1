import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../../users/interfaces/user.interface';
import { UserRegister } from '../interfaces/registerUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user!: User | undefined;

  constructor(private readonly http: HttpClient) { }

  get currentUser(): User | undefined {
    return this.user ? structuredClone(this.user) : undefined;
  }

  private loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem("userLogged");
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error al parsear el usuario de localStorage:", error);
      }
    }
  }

  login(email: string, password: string): Observable<any>{

    return this.http.post<any>(`${environments.baseUrl}/auth/login`, { email, password }).pipe(

      tap((resp) => this.user = resp.user),
      tap( resp => localStorage.setItem("access_token", resp.access_token)),
      tap( resp => localStorage.setItem("userLogged", JSON.stringify(resp.user)))

    )

  }

  checkAuthentication(): Observable<boolean> {
    console.log("Verificando autenticación de usuario...");

    if (!localStorage.getItem("access_token")) return of(false);

    const storedUser = localStorage.getItem("userLogged");
    if (!storedUser) return of(false);

    try {
      const JSONcurrentUser = JSON.parse(storedUser);
      if (!JSONcurrentUser?.userId) return of(false);

      return this.http.get<User>(`${environments.baseUrl}/user/${JSONcurrentUser.userId}`).pipe(
        tap((user) => {
          this.user = user; // Actualizar el usuario
          localStorage.setItem("userLogged", JSON.stringify(user)); // Asegurar que está en localStorage
        }),
        map((user) => !!user),
        catchError((err) => {
          console.error("Error verificando autenticación:", err);
          return of(false);
        })
      );
    } catch (error) {
      console.error("Error al parsear el usuario de localStorage:", error);
      return of(false);
    }
  }

  register(userRegister: UserRegister): Observable<any>{

    try{

      return this.http.post<any>(`${environments.baseUrl}/user`,{
        user: userRegister
      })

    }catch(error){
      console.log(error);
      return of(error)
    }

  }

  logout(){

    this.user = undefined;
    localStorage.removeItem("userLogged");
    localStorage.removeItem("access_token");

  }
}
