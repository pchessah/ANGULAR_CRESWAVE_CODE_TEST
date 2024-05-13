import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialDesignModule } from '../../shared/modules/material-design.module';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MaterialDesignModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

}
