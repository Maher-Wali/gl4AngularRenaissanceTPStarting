import { Pipe, PipeTransform } from '@angular/core';

/**
 * Cache pour stocker les résultats de Fibonacci déjà calculés
 * Permet d'éviter les recalculs coûteux (memoization)
 */
const fibonacciCache = new Map<number, number>();

/**
 * Fonction Fibonacci optimisée avec memoization
 * Complexité: O(n) au lieu de O(2^n)
 * 
 * @param n - Le nombre pour lequel calculer Fibonacci
 * @returns Le résultat de Fibonacci(n)
 */
export function fibonacciMemoized(n: number): number {
  // Cas de base
  if (n === 0 || n === 1) {
    return 1;
  }

  // Vérifier si le résultat est déjà dans le cache
  if (fibonacciCache.has(n)) {
    return fibonacciCache.get(n)!;
  }

  // Calculer et stocker dans le cache
  const result = fibonacciMemoized(n - 1) + fibonacciMemoized(n - 2);
  fibonacciCache.set(n, result);
  
  return result;
}

/**
 * Pipe Angular pour calculer la suite de Fibonacci
 * 
 * Utilisation: {{ age | fibonacci }}
 * 
 * Pure pipe = Angular met automatiquement en cache les résultats
 * Ne recalcule que si la valeur d'entrée change
 */
@Pipe({
  name: 'fibonacci',
  pure: true // IMPORTANT: Pure pipe pour optimisation automatique par Angular
})
export class FibonacciPipe implements PipeTransform {
  /**
   * Transforme un nombre en son équivalent Fibonacci
   * 
   * @param value - Le nombre pour lequel calculer Fibonacci
   * @returns Le résultat de Fibonacci(value)
   */
  transform(value: number): number {
    if (value == null || value < 0) {
      return 0;
    }
    
    return fibonacciMemoized(value);
  }
}
