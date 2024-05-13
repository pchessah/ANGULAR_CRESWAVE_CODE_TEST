import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { TasksTableComponent } from '../tasks-table/tasks-table.component';
import { MaterialDesignModule } from '../../shared/modules/material-design.module';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';
import { isMobile } from 'mobile-device-detect';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TasksTableComponent, MaterialDesignModule, TasksListComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  private _dialog = inject(MatDialog)
  isMobile = isMobile;

  constructor(){
    this.isMobile = window.innerWidth < 600;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.isMobile = window.innerWidth < 600;
  }

  addTask() {
    this._dialog.open(TaskDialogComponent, {
      data: { mode: 'create' }
    })
  }

}
