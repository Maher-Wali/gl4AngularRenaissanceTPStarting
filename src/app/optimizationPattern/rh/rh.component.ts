import {Component, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import * as ChartJs from 'chart.js/auto';

/**
 * Composant RH avec gestion dynamique du graphique
 */
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css']
})
export class RhComponent implements OnInit {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  
  constructor(private userService: UsersService) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
    this.createChart();
  }
  
  /**
   * Ajoute un utilisateur à la liste spécifiée
   * 
   * @param list - La liste dans laquelle ajouter l'utilisateur
   * @param newUser - Le nom du nouvel utilisateur
   */
  addUser(list: User[], newUser: string) {
    this.userService.addUser(list, newUser);
    
    // Mettre à jour le graphique avec les nouvelles données
    this.updateChart();
  }
  
  /**
   * Crée le graphique initial
   */
  createChart(){
    const data = [
      { users: 'Boss', count: this.oddUsers.length },
      { users: 'Workers', count: this.evenUsers.length },
    ];
    
    this.chart = new ChartJs.Chart("MyChart", {
      type: 'bar',
      data: {
        labels: data.map(row => row.users),
        datasets: [{
          label: 'Entreprise stats',
          data: data.map(row => row.count)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }
  
  /**
   * Met à jour le graphique avec les nouvelles données
   * Utilise chart.update() au lieu de recréer le graphique
   */
  updateChart() {
    if (this.chart) {
      // Mettre à jour les données du graphique
      this.chart.data.datasets[0].data = [
        this.oddUsers.length,
        this.evenUsers.length
      ];
      
      // Appliquer les changements avec animation
      this.chart.update();
    }
  }
}
