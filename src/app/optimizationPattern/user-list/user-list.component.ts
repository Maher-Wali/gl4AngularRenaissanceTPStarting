import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {User} from "../users.service";

export const fibonnaci = (n: number): number => {
  if (n==1 || n==0) {
    return 1;
  }
  return fibonnaci(n-1) + fibonnaci(n-2);
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  // OnPush: Le composant ne se met à jour que si:
  // 1. Une @Input change de référence
  // 2. Un événement DOM se déclenche dans le composant
  // 3. Un Observable/Promise émet dans le template (async pipe)
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() usersCluster: string = '';
  @Input() users: User[] = [];
  @Output() add = new EventEmitter<string>();
  userFullName: string = '';
  
  addUser() {
    this.add.emit(this.userFullName);
    this.userFullName = '';
  }
  
  fibo(n: number): number {
    const fib = fibonnaci(n);
    console.log({n, fib});
    return fib;
  }
}
