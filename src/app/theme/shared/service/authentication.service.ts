// angular import
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// project import
import { environment } from 'src/environments/environment';
import { User } from '../_helpers/user';

// Import the 'map' operator from 'rxjs/operators'
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSignal = signal<User | null>(null);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Initialize the signal with the current user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSignal.set(JSON.parse(storedUser) as User);
    }
  }

  public get currentUserValue(): User | null {
    // Access the current user value from the signal
    return this.currentUserSignal();
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}/api/account/login`, { email, password }).pipe(
      map((user: User) => {
        // Explicitly define the type for 'user'
        // Store user details and JWT token in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Update the signal with the new user
        this.currentUserSignal.set(user);
        return user;
      })
    );
  }

  logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // Update the signal to null
    this.currentUserSignal.set(null);
    this.router.navigate(['login']);
  }
}
