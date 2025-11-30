import {Component, Input, Output, EventEmitter} from '@angular/core';
import {User} from "../users.service";

/**
 * Composant pour afficher une liste d'utilisateurs
 * 
 * Optimisation appliquée:
 * - Utilisation du pipe Fibonacci au lieu d'une méthode pour éviter les recalculs
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
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
}
