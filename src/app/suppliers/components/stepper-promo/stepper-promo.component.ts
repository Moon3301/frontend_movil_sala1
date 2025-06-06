import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ISupplier, Supplier } from '../../interfaces/supplier.interface';
import { Company } from '../../interfaces/company.interface';
import { SuppliersService } from '../../services/suppliers.service';
import { Movie } from '../../../movie/interfaces/movie.interface';
import { StorageService } from '../../../storage/storage.service';
import { from, mergeMap, forkJoin, map, toArray} from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalDiscountCodeComponent } from '../modal-discount-code/modal-discount-code.component';
import { Promotion } from '../../interfaces/promotions.interface';

const optionsSend = [
  'Email',
  'Notificaciones'
]

@Component({
  selector: 'suppliers-stepper',
  standalone: false,
  templateUrl: './stepper-promo.component.html',
  styleUrl: './stepper-promo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperPromoComponent implements OnInit {

  supplier?: ISupplier;

  optionsSend = optionsSend;

  minDate = new Date();
  isLinear = true;

  codesPromotion = signal('');

  movies: Movie[] = [];

  companies_list: string[] = [];

  cinemas_list: any[] = [];

  public firstStepperForm!: FormGroup;
  public secondStepperForm!: FormGroup;
  public threeStepperForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: SuppliersService,
    private storageService: StorageService,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {

    this.firstStepperForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    })

    this.secondStepperForm = this.fb.group({
      nombre: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      descuento: ['', Validators.required],
      usosCodigo: ['', Validators.required],
      codigo: ['', [this.validateCodes()]],
      validoDesde: ['', Validators.required],
      validoHasta: ['', Validators.required],
      companias: this.fb.array([]),

    })

    this.threeStepperForm = this.fb.group({
      sendType: ['', Validators.required],
      dateSend:    ['', Validators.required],
      timeSend:     ['', Validators.required],
    }, {
      validators: [this.dateValidator()]
    });

    this.supplierService.getSupplierByUserId().subscribe({
      next: (supplier: ISupplier) => {
        this.supplier = supplier;
        console.log(this.supplier);

      },
      error: () => { console.log('Error al obtener el usuario') }
    });

    this.storageService.getData('movies').subscribe({
      next: (movieData: string | null) => {
        if (movieData) {
          try {
            this.movies = JSON.parse(movieData) as Movie[];
            console.log(this.movies);
          } catch (e) {
            console.log('Error al parsear las películas', e);
          }
          console.log(this.movies);
        } else {
          this.movies = [];
        }
      },
      error: () => { console.log('Error al obtener las películas') }
    });

  }

  validateCodes(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const codes = control.value;
      if (codes.length === 0) {
        return { noCodes: true };
      }
      return null;
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fecha = control.value;
      const fechaActual = new Date();
      if (fecha < fechaActual) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }

  get companiasFA() {
    return this.secondStepperForm.get('companias') as FormArray;
  }

  step1(){

  }

  step2() {
    const companies : string[] = this.firstStepperForm.value.firstCtrl;
    // limpia el form array
    this.companiasFA.clear();
    this.cinemas_list = [];

    // lanza en paralelo una petición doble (cines + movies) por compañía
    from(companies).pipe(
      mergeMap(company =>
        forkJoin({
          cines  : this.supplierService.getCinemasByCompany(company),
          movies : this.supplierService.getMoviesByCompany(company)
        }).pipe( map(data => ({ company, ...data })) )
      ),
      toArray()       // esperamos a que terminen todas
    ).subscribe({
      next: results => {
        results.forEach(r => {
          // guarda para pintarlo en plantilla si quieres
          this.cinemas_list.push(r);

          // añade fila al FormArray
          this.companiasFA.push(
            this.fb.group({
              company: [r.company],
              cines  : [ [] , Validators.required ],
              movies : [ [] , Validators.required ]
            })
          );
        });
        // this.stepper.next();
      },
      error: () => console.log('Error cargando datos')
    });
  }

  step3(){

  }

  get desde(): Date {                // validoDesde
    return new Date(this.secondStepperForm.value.validoDesde);
  }
  get hasta(): Date {                // validoHasta
    return new Date(this.secondStepperForm.value.validoHasta);
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const min = new Date(this.desde.getFullYear(), this.desde.getMonth(), this.desde.getDate());
    const max = new Date(this.hasta.getFullYear(), this.hasta.getMonth(), this.hasta.getDate());
    return day >= min && day <= max;           // solo días dentro del rango
  };

  selectAllCinemas(evt: MatOptionSelectionChange, idx: number) {
    // solo actúa cuando el usuario marca (no al des-marcar)
    if (!evt.isUserInput || !evt.source.selected) return;

    const allIds = this.cinemas_list[idx].cines.map((c: any) => c.id);

    const current = this.companiasFA.at(idx).get('cines')!.value;

    if (current.length === allIds.length) {
      this.companiasFA.at(idx).get('cines')!.setValue([]);
    } else {
      this.companiasFA.at(idx).get('cines')!.setValue(allIds);
    }

    // desmarca visualmente la opción «todos»
    evt.source.deselect();
  }

  selectAllMovies(evt: MatOptionSelectionChange, idx: number) {
    // solo actúa cuando el usuario marca (no al des-marcar)
    if (!evt.isUserInput || !evt.source.selected) return;

    const allIds = this.cinemas_list[idx].movies.map((c: any) => c.id);

    const current = this.companiasFA.at(idx).get('movies')!.value;

    if (current.length === allIds.length) {
      this.companiasFA.at(idx).get('movies')!.setValue([]);
    } else {
      this.companiasFA.at(idx).get('movies')!.setValue(allIds);
    }

    // desmarca visualmente la opción «todos»
    evt.source.deselect();
  }

  openModalDiscount(){

    const dialogRef = this.dialog.open(ModalDiscountCodeComponent, {
      width: '100%',
      height: '80%',
      maxWidth: '100%',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.codesPromotion.set(result);
          this.secondStepperForm.get('usosCodigo')!.setValue(result.uses);

          this.secondStepperForm.get('codigo')!.setValue(result.codes);
        }
      }
    });
  }

  onSubmit() {

    const companies = this.firstStepperForm.value.firstCtrl;

    const name = this.secondStepperForm.value.nombre;
    const title = this.secondStepperForm.value.titulo;
    const description = this.secondStepperForm.value.descripcion;
    const movies =  this.companiasFA.value.map((c: any) => c.movies);
    const cinemas = this.companiasFA.value.map((c: any) => c.cines);
    const discount = this.secondStepperForm.value.descuento;
    const uses = this.secondStepperForm.value.usosCodigo;
    const codes = this.secondStepperForm.value.codigo;
    const validFrom = this.secondStepperForm.value.validoDesde;
    const validTo = this.secondStepperForm.value.validoHasta;
    const sendType = this.threeStepperForm.value.sendType;
    const dateSend = this.threeStepperForm.value.dateSend;
    const timeSend = this.threeStepperForm.value.timeSend;

    const promotion: Promotion = {
      name,
      title,
      description,
      discount_value: discount,
      promocode: codes,
      promocode_uses: uses,
      amount: codes.length,
      start_date_promo: validFrom,
      valid_from: validFrom,
      valid_to: validTo,
      movieIds: movies,
      cinemasIds: cinemas,
      companyIds: companies,
      supplierId: this.supplier!.id,
      sendType,
      dateSend,
      timeSend,

    };

    console.log(promotion);

    this.supplierService.createPromotion(promotion).subscribe({
      next: (promotion: Promotion) => {
        console.log(promotion);
      },
      error: () => { console.log('Error al crear la promocion') }
    });

  }

}
