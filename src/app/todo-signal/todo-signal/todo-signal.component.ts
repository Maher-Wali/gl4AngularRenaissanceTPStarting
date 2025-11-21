import { Component, computed, inject, signal, Signal } from '@angular/core';
import { TodoSignalService } from '../service/todo-signal.service';
import { TodoSignal, TodoStatus } from '../model/todo-signal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-signal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-signal.component.html',
  styleUrl: './todo-signal.component.css',
})
export class TodoSignalComponent {
  private todosSignalService = inject(TodoSignalService);
  
  todos: Signal<TodoSignal[]> = this.todosSignalService.todos;
  todo = signal<TodoSignal>(new TodoSignal());
  waiting = computed(() => this.todos().filter((t) => t.status === 'waiting'));
  inProgress = computed(() =>
    this.todos().filter((t) => t.status === 'in progress')
  );
  done = computed(() => this.todos().filter((t) => t.status === 'done'));

  addTodo(): void {
    this.todosSignalService.addTodo(this.todo());
    this.todo.set(new TodoSignal());
  }

  deleteTodo(todo: TodoSignal): void {
    this.todosSignalService.deleteTodo(todo);
  }

  changeStatus(t: TodoSignal, newStatus: TodoStatus): void {
    this.todosSignalService.updateStatus(t, newStatus);
  }
}
