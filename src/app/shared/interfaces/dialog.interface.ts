import { Task } from "./task.interface";

export interface TaskDialogData {
  mode: 'edit' | 'create';
  task?: Task
}