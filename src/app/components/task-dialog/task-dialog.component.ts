import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MaterialDesignModule } from '../../shared/modules/material-design.module';
import { TaskService } from '../../shared/services/task/task.service';
import { Task, TaskStatus } from '../../shared/interfaces/task.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskDialogData } from '../../shared/interfaces/dialog.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, MaterialDesignModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  private _formBuilder = inject(FormBuilder)
  private _taskService = inject(TaskService)
  private _dialogRef = inject(MatDialogRef<TaskDialogComponent>)
  editMode: boolean;
  taskToBeEdited: Task;
  taskStatus = TaskStatus
  call$: Observable<unknown> = new Observable<unknown>();

  constructor(@Inject(MAT_DIALOG_DATA) private _data: TaskDialogData) {
    this.editMode = this._data.mode === 'edit';
    this.taskToBeEdited = this._data.task as Task;
    this.taskForm = this._formBuilder.group({
      id: [this.taskToBeEdited ? this.taskToBeEdited.id : uuidv4()],
      title: [this.taskToBeEdited ? this.taskToBeEdited.title : '', Validators.required],
      description: [this.taskToBeEdited ? this.taskToBeEdited.description : '', Validators.required],
      status: [this.taskToBeEdited ? this.taskToBeEdited.status : TaskStatus.INCOMPLETE, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;
      this.call$ = this.editMode ?
        this._taskService.updateTask(newTask) : this._taskService.addTask(newTask);
      this._dialogRef.close();
      this.taskForm.reset();
    }
  }
}
