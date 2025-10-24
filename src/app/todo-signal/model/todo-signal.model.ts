export type TodoStatus = 'waiting' | 'in progress' | 'done';

export class TodoSignal {
  private static _nextId = 1;
  public readonly id: number;
  constructor(public name = '', public content = '', public status: TodoStatus = 'waiting') {
    this.id = TodoSignal._nextId++;
  }
}
