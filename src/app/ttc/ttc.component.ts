import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, RefreshCw } from 'lucide-angular';

@Component({
  selector: 'app-ttc',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './ttc.component.html',
  styleUrls: ['./ttc.component.css']
})
export class TtcComponent {
  prix = signal(0);
  quantite = signal(1);
  tva = signal(18);

  pourcentage = computed(() => {
    const q = this.quantite();
    if (q > 10 && q <= 15) return 0.2;
    if (q > 15) return 0.3;
    return 0;
  });

  prixTTCUnitaire = computed(() => {
    return this.prix() * (1 + this.tva() / 100);
  });

  prixTTCTotal = computed(() => {
    return this.prixTTCUnitaire() * this.quantite();
  });

  remise = computed(() => {
    return this.prix() * this.quantite() * this.pourcentage();
  });
  public refreshCw = RefreshCw;

  clearAll = () => {
    this.prix.set(0);
    this.quantite.set(1);
    this.tva.set(18);
  };
}
