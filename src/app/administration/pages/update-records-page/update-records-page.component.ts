import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';

@Component({
  selector: 'adm-update-records-page',
  standalone: false,

  templateUrl: './update-records-page.component.html',
  styleUrl: './update-records-page.component.css'
})
export class UpdateRecordsPageComponent implements OnInit{

  isUpdating: boolean = false;

  constructor(private readonly admService: AdministrationService){}

  ngOnInit(): void {
    const state = localStorage.getItem("isUpdatingRecords");

    if (state) {
      this.isUpdating = state === 'true';
    }
  }

  updateRecordsCinemark(){

    this.isUpdating = true;
    localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())

    console.log('Iniciando actualizacion de registros cinemark');

    this.admService.updateRecordsCinemark().subscribe({
      next: () => {
        console.log('Records updated');

        this.isUpdating = false;
        localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())
      },
      error: () => {
        console.log('Error updating records');

        this.isUpdating = false;
        localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())
      }
    });
  }

  updateRecordsCinepolis(){

    this.isUpdating = true;
    localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())

    console.log('Iniciando actualizacion de registros cinepolis');

    this.admService.updateRecordsCinepolis().subscribe({
      next: () => {
        console.log('Records updated');

        this.isUpdating = false;
        localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())
      },
      error: () => {
        console.log('Error updating records');

        this.isUpdating = false;
        localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())
      }
    });
  }

  updateRecordsCineplanet(){

    this.isUpdating = true;
    localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())

    console.log('Iniciando actualizacion de registros cinepolis');

    this.admService.updateRecordsCineplanet().subscribe({
      next: () => {
        console.log('Records updated');

        this.isUpdating = false;
        localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())
      },
      error: () => {
        console.log('Error updating records');

        this.isUpdating = false;
        localStorage.setItem("isUpdatingRecords", this.isUpdating.toString())
      }
    });
  }
  
}
