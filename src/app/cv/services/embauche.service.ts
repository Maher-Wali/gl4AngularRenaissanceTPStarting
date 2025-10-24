import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  /**
   * Signal pour la liste des personnes embauchées
   */
  embauchees = signal<Cv[]>([]);

  constructor() {}

  /**
   *
   * Retourne la liste des embauchees (version signal)
   *
   * @returns Signal<CV[]>
   *
   */
  getEmbauchees() {
    return this.embauchees.asReadonly();
  }

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    const currentList = this.embauchees();
    if (currentList.findIndex(c => c.id === cv.id) === -1) {
      this.embauchees.update(list => [...list, cv]);
      return true;
    }
    return false;
  }
}
