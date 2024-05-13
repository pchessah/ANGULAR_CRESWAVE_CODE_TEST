import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialDesignModule } from '../../shared/modules/material-design.module';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Task, TaskStatus } from '../../shared/interfaces/task.interface';
import { TaskService } from '../../shared/services/task/task.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-tasks-details',
  standalone: true,
  imports: [CommonModule, MaterialDesignModule],
  templateUrl: './tasks-details.component.html',
  styleUrl: './tasks-details.component.scss'
})
export class TasksDetailsComponent {

  private _route = inject(ActivatedRoute);
  private _taskService = inject(TaskService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);

  taskStatus = TaskStatus;
  call$: Observable<unknown> = new Observable<unknown>();

  task$ = this._route.url.pipe(switchMap(url => {
    return this._taskService.getTaskById(url[1].path)
  }), tap(task => {
    this._currentTask = task as Task;
    if (!this._currentTask) {
      alert('⚠️ Task not found. Please reload the page.')
      this.goToLanding();
    }
  }))

  private _currentTask!: Task;

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.call$ = this._taskService.deleteTask(taskId);
      this.goToLanding();
    }
  }

  editTask(task: Task) {
    const dialogRef =
      this._dialog.open(TaskDialogComponent, {
        data: { mode: 'edit', task: task }
      })
    this.task$ = dialogRef.afterClosed().pipe(switchMap(() => {
      return this._taskService.getTaskById(this._currentTask.id)
    }))
  }

  goToLanding() {
    this._router.navigateByUrl(`/landing`)
  }


}
