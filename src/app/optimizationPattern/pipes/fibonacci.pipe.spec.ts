import { FibonacciPipe, fibonacciMemoized } from './fibonacci.pipe';

describe('FibonacciPipe', () => {
  let pipe: FibonacciPipe;

  beforeEach(() => {
    pipe = new FibonacciPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 1 for n=0', () => {
    expect(pipe.transform(0)).toBe(1);
  });

  it('should return 1 for n=1', () => {
    expect(pipe.transform(1)).toBe(1);
  });

  it('should calculate fibonacci correctly for n=5', () => {
    expect(pipe.transform(5)).toBe(8); // 1,1,2,3,5,8
  });

  it('should calculate fibonacci correctly for n=10', () => {
    expect(pipe.transform(10)).toBe(89);
  });

  it('should handle negative numbers', () => {
    expect(pipe.transform(-1)).toBe(0);
  });

  it('should handle null', () => {
    expect(pipe.transform(null as any)).toBe(0);
  });

  it('should be fast with memoization for large numbers', () => {
    const start = performance.now();
    pipe.transform(30);
    const end = performance.now();
    
    // Devrait être très rapide (< 10ms) grâce à la memoization
    expect(end - start).toBeLessThan(10);
  });

  it('should use cache for repeated calls', () => {
    // Premier appel - calcul complet
    const result1 = pipe.transform(20);
    
    // Deuxième appel - devrait utiliser le cache
    const start = performance.now();
    const result2 = pipe.transform(20);
    const end = performance.now();
    
    expect(result1).toBe(result2);
    expect(end - start).toBeLessThan(1); // Cache hit = instantané
  });
});

describe('fibonacciMemoized function', () => {
  it('should return correct fibonacci sequence', () => {
    expect(fibonacciMemoized(0)).toBe(1);
    expect(fibonacciMemoized(1)).toBe(1);
    expect(fibonacciMemoized(2)).toBe(2);
    expect(fibonacciMemoized(3)).toBe(3);
    expect(fibonacciMemoized(4)).toBe(5);
    expect(fibonacciMemoized(5)).toBe(8);
    expect(fibonacciMemoized(6)).toBe(13);
  });
});
