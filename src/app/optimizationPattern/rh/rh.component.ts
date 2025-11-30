import {Component, OnInit} from '@angular/core';
import {User, UsersService} from "../users.service";
import * as ChartJs from 'chart.js/auto';
import { faker } from '@faker-js/faker';

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
  
  // IMPORTANT: Pour que OnPush fonctionne, on doit créer une NOUVELLE référence
  // Au lieu de muter l'array existant, on crée un nouveau array
  addUser(list: User[], newUser: string) {
    const newUserObj: User = {
      name: newUser,
      age: faker.datatype.number({min: 18, max: 30})
    };
    
    // Création d'un nouveau array (immutable pattern)
    if (list === this.oddUsers) {
      this.oddUsers = [newUserObj, ...this.oddUsers];
    } else {
      this.evenUsers = [newUserObj, ...this.evenUsers];
    }
    
    // Mise à jour du chart
    this.updateChart();
  }
  
  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.oddUsers.length,
        this.evenUsers.length
      ];
      this.chart.update();
    }
  }
  createChart(){
    const data = [
      { users: 'Workers', count: this.oddUsers.length },
      { users: 'Boss', count: this.evenUsers.length },
    ];
    this.chart = new ChartJs.Chart("MyChart",
    {
      type: 'bar',
        data: {
          labels: data.map(row => row.users),
        datasets: [
        {
          label: 'Entreprise stats',
          data: data.map(row => row.count)
        }
      ]
    }
    });
  }
}
