import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Task } from '../../interfaces/task.interface';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _loadingService = inject(LoadingService)

  private _taskBehaviorSubject$$ = new BehaviorSubject<Task[]>([]);

  tasks$ = this._taskBehaviorSubject$$.asObservable();

  constructor(private http: HttpClient) {
    this._loadingService.isLoading.set(true)
    this.http.get<Task[]>('assets/tasks.json').subscribe(tasks => {
      this._taskBehaviorSubject$$.next(tasks);
      this._loadingService.isLoading.set(false);
    });
  }

  // Get task by ID
  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(map(tasks => tasks.find(task => task.id === id)));
  }

  // Add task
  addTask(task: Task) {
    this._loadingService.isLoading.set(true)
    let currentTasks = this.getTasksValue();
    currentTasks = [...currentTasks, task];
    alert("✨Task added successfully.")
    return this._updateTasksFile(currentTasks);
  }

  // Update task
  updateTask(updatedTask: Task) {
    this._loadingService.isLoading.set(true)
    let currentTasks = this.getTasksValue();
    const index = currentTasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      currentTasks[index] = updatedTask;
      return this._updateTasksFile(currentTasks);
    } else {
      return of(null);
    }
  }

  // Delete task
  deleteTask(id: string) {
    this._loadingService.isLoading.set(true)
    let currentTasks = this.getTasksValue();
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this._taskBehaviorSubject$$.next(updatedTasks);
    this._loadingService.isLoading.set(false)
    return  this.http.delete<unknown>('assets/tasks.json')
  }

  private getTasksValue(){
    return this._taskBehaviorSubject$$.getValue()
  }

  private _updateTasksFile(tasks: Task[]) {
    this._loadingService.isLoading.set(true)
    return this.http.put<unknown>('assets/tasks.json', tasks).pipe(tap(() => {
      this._taskBehaviorSubject$$.next(tasks);
      this._loadingService.isLoading.set(false)
      alert("✨Tasks updated successfully");
    }))
  }
}
