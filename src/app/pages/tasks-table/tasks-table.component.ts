import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Task } from '../../shared/interfaces/task.interface';
import { TaskService } from '../../shared/services/task/task.service';
import { Observable, tap } from 'rxjs';
import { MaterialDesignModule } from '../../shared/modules/material-design.module';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { isMobile } from 'mobile-device-detect';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [CommonModule, MaterialDesignModule, TasksListComponent],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss'
})
export class TasksTableComponent {

  private _taskService = inject(TaskService);
  private _dialog = inject(MatDialog);
  private _router = inject(Router);

  tasks$ = this._taskService.tasks$.pipe(tap(res => {
    this.dataSource = new MatTableDataSource<Task>();
    this.dataSource.data = res;
    this.tasks = res;
  }))
  tasks: Task[] = [];
  dataSource: any;
  call$: Observable<unknown> = new Observable<unknown>();
  isMobile = isMobile

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.call$ = this._taskService.deleteTask(taskId)
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
