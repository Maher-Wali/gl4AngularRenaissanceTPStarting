import { Injectable, inject, WritableSignal, signal } from '@angular/core';
import { TodoSignal, TodoStatus } from '../model/todo-signal.model';

@Injectable({
  providedIn: 'root',
})
export class TodoSignalService {
  private _todos: WritableSignal<TodoSignal[]> = signal([]);
  todos = this._todos.asReadonly();

  /**
   *Elle permet d'ajouter un todo
   *
   * @param todo: Todo
   *
   */
  addTodo(todo: TodoSignal): void {
    this._todos.update((todos) => [...todos, todo]);
  }

  /**
   * Delete le todo s'il existe
   *
   * @param todo: Todo
   * @returns boolean
   */
  deleteTodo(todo: TodoSignal): boolean {
    const index = this._todos().indexOf(todo);
    if (index > -1) {
      this._todos.update((todos) => todos.filter((_, i) => i !== index));
      return true;
    }
    return false;
  }

  updateStatus(t: TodoSignal, newStatus: TodoStatus) {
    t.status = newStatus;
    this._todos.update((todos) => [...todos]);
  }
}
