import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICines } from '../../interfaces/funciones.interface';

@Component({
  selector: 'movie-expansion-panel',
  standalone: false,

  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelComponent {

  @Input()
  funciones!: ICines[]

}
