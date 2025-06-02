import { Component, OnInit } from '@angular/core';
import { ISupplier, Supplier } from '../../interfaces/supplier.interface';
import { SuppliersService } from '../../services/suppliers.service';
import { StorageService } from '../../../storage/storage.service';

@Component({
  selector: 'app-layout-page',
  standalone: false,

  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent implements OnInit{

  supplier!: ISupplier;

  constructor(private supplierService: SuppliersService, private readonly storageService: StorageService){}

  ngOnInit(): void {

    this.supplierService.getSupplierByUserId().subscribe({
      next: (supplier: ISupplier) => { this.supplier = supplier;
        this.storageService.saveData('supplier', JSON.stringify(supplier)).subscribe();
      },
      error: () => { console.log('Error al obtener el usuario'); }
    });
  }

}
