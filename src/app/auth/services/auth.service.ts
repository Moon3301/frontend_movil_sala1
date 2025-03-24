import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { catchError, concatMap, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../users/interfaces/user.interface';
import { UserRegister } from '../interfaces/registerUser';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  private user!: User | undefined;

  constructor(private readonly http: HttpClient, private readonly storageService: StorageService) {
    this.loadUserFromLocalStorage();
  }
  ngOnInit(): void {
    this.loadUserFromLocalStorage();
  }

  get currentUser(): User | undefined {
    return this.user ? structuredClone(this.user) : undefined;
  }

  private loadUserFromLocalStorage() {

    this.storageService.getData("userLogged").subscribe({
      next: (resp)=> {
        if(resp){
          try {
            this.user = JSON.parse(resp);
          } catch (error) {
            console.error("Error al obtener el usuario de localStorage:", error);
          }
        }
      },
      error: (error)=> {
        console.error(error)
      }
    })

    // const storedUser = localStorage.getItem("userLogged");
    // if (storedUser) {
    //   try {
    //     this.user = JSON.parse(storedUser);
    //   } catch (error) {
    //     console.error("Error al obtener el usuario de localStorage:", error);
    //   }
    // }
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environments.baseUrl}/auth/login`, { email, password }).pipe(
      tap(resp => this.user = resp.user),
      switchMap(resp =>
        // Guardamos primero el access_token
        this.storageService.saveData("access_token", resp.access_token).pipe(
          tap(() => console.log("access_token saved")),
          // Luego, de forma secuencial, guardamos el usuario
          concatMap(() =>
            this.storageService.saveData("userLogged", JSON.stringify(resp.user))
          ),
          tap(() => console.log("userLogged saved")),
          // Finalmente, devolvemos la respuesta original
          map(() => resp)
        )
      )
    );
  }

  public checkAuthentication(): Observable<boolean> {
    console.log("Verificando autenticación de usuario...");

    return this.storageService.getData("access_token").pipe(
      switchMap(token => {
        // Si no hay token, no está autenticado
        if (!token) {
          return of(false);
        }
        // Si hay token, recuperamos el usuario almacenado
        return this.storageService.getData("userLogged").pipe(
          switchMap(storedUser => {
            if (!storedUser) {
              return of(false);
            }
            try {
              const JSONcurrentUser = JSON.parse(storedUser);
              if (!JSONcurrentUser?.userId) {
                return of(false);
              }
              // Consultamos el usuario en el backend usando el userId
              return this.http.get<User>(`${environments.baseUrl}/user/${JSONcurrentUser.userId}`).pipe(
                tap(user => {
                  this.user = user; // Actualizamos el usuario en la app
                  // Guardamos el usuario actualizado en el storage
                  this.storageService.saveData("userLogged", JSON.stringify(user)).subscribe();
                }),
                map(user => !!user),
                catchError(err => {
                  console.error("Error verificando autenticación:", err);
                  return of(false);
                })
              );
            } catch (error) {
              console.error("Error al parsear el usuario del storage:", error);
              return of(false);
            }
          })
        );
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any>{

    try{

      return this.http.post<any>(`${environments.baseUrl}/user`,{
        name,
        email,
        password
      })

    }catch(error){
      console.log(error);
      return of(error)
    }

  }

  logout(){

    this.user = undefined

    forkJoin([
      this.storageService.deleteData("userLogged"),
      this.storageService.deleteData("access_token")
    ]).subscribe({
      next: ([allMovies, moviesCarrusel]) => {
        console.log(allMovies, moviesCarrusel);
      }
    })

    // localStorage.removeItem("userLogged");
    // localStorage.removeItem("access_token");

  }
}
