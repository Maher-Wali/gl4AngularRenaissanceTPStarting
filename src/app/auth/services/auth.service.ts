import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';

export interface AuthState {
  id: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'auth_state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);


  private authState = signal<AuthState>({
    id: null,
    email:null,
    isAuthenticated: false,
  })

  readonly currentUser = computed(() => ({
    id: this.authState().id,
    email: this.authState().email,
  }));

  readonly userAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly userId = computed(() => this.authState().id);
  readonly userEmail = computed(() => this.authState().email);

  constructor() {
    this.loadAuthState();

    effect(() => {
      const state = this.authState();
      if(state.isAuthenticated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else{
        localStorage.removeItem(STORAGE_KEY);
      }
    })
  }

  private loadAuthState() {
    try{
      const storedState = localStorage.getItem(STORAGE_KEY);
      if(storedState) {
        const state: AuthState = JSON.parse(storedState)
        if(state.id && state.email && state.isAuthenticated) {
          this.authState.set(state);
        }
      }
    } catch (error) {
      console.error('Failed to load auth state from localStorage', error);
      this.clearAuthState();
    }
  }

  private clearAuthState(){
    this.authState.set({
      id:null,
      email:null,
      isAuthenticated:false,
    })
  }

 login(credentials: CredentialsDto): Observable<LoginResponseDto> {
   return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
     tap((response) => {
       this.authState.set({
         id: response.id,
         email: credentials.email,
         isAuthenticated: true,
       })
     })
   );
  }

  logout() {
    this.clearAuthState();
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated
  }

  getToken(){
    return this.authState().id;
  }
}
