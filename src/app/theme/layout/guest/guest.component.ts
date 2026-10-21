// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { ConfigurationComponent } from '../admin/configuration/configuration.component';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [RouterModule, ConfigurationComponent],
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {}
