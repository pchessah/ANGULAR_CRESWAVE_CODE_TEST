import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MaterialDesignModule } from '../../shared/modules/material-design.module';
import { TaskService } from '../../shared/services/task/task.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';
import { Task, TaskStatus } from '../../shared/interfaces/task.interface';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, MaterialDesignModule],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent {

  private _taskService = inject(TaskService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);

  taskStatus = TaskStatus;

  tasks$ = this._taskService.tasks$.pipe(tap(res => {
    this.tasks = res;
  }))

  call$:Observable<unknown> = new Observable<unknown>();

  tasks: Task[] = [];

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.call$ =  this._taskService.deleteTask(taskId).pipe(tap(res => { debugger;}))
    }
  }

  editTask(task: Task) {
    this._dialog.open(TaskDialogComponent, {
      data: { mode: 'edit', task: task }
    })
  }

  goToTask(task: Task) {
    this._router.navigateByUrl(`/task/${task.id}`)
  }
}
