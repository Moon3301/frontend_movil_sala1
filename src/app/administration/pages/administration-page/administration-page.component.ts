import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { ListsCarrusel, MovieCarrusel } from '../../interfaces/movies.interface';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { environments } from '../../../../environments/environments';

@Component({
  selector: 'administration-administration-page',
  standalone: false,
  templateUrl: './administration-page.component.html',
  styleUrl: './administration-page.component.css'
})
export class AdministrationPageComponent {





}
