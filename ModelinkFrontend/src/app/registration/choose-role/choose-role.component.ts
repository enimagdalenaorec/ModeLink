import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-choose-role',
  standalone: true,
  imports: [DividerModule, ButtonModule],
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.css'
})
export class ChooseRoleComponent {

}
