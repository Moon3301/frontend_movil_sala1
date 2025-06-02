import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISupplier } from '../../interfaces/supplier.interface';
import { SuppliersService } from '../../services/suppliers.service';
import { Movie } from '../../../movie/interfaces/movie.interface';
import { StorageService } from '../../../storage/storage.service';

@Component({
  selector: 'suppliers-stepper',
  standalone: false,
  templateUrl: './stepper-promo.component.html',
  styleUrl: './stepper-promo.component.css'
})
export class StepperPromoComponent implements OnInit {

  isLinear = false;

  supplier?: ISupplier;
  movies: Movie[] = [];

  public firstStepperForm!: FormGroup;
  public secondStepperForm!: FormGroup;
  public threeStepperForm!: FormGroup;

  constructor(private fb: FormBuilder, private supplierService: SuppliersService, private storageService: StorageService){}

  ngOnInit(): void {

    this.firstStepperForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    })

    this.secondStepperForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    })

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


}
