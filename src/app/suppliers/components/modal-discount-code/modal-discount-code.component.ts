import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'modal-discount-code',
  standalone: true,
  imports: [
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatListModule
  ],
  templateUrl: './modal-discount-code.component.html',
  styleUrl: './modal-discount-code.component.css',

})
export class ModalDiscountCodeComponent implements OnInit{

  formCode!: FormGroup;
  codes: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalDiscountCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {}


  ngOnInit(): void {

    this.formCode = this.fb.group({
      code: ['', Validators.required],
      cantidad: ['', Validators.required],
      uses: ['', Validators.required],
    });


  }

  addCode(){
    if(this.formCode.invalid || this.formCode.get('code')?.value.length < 0){
      return;
    }

    this.codes.push(this.formCode.get('code')?.value );

    this.formCode.reset();
  }

  addBulkCodes(): void {
    const bulk = this.formCode.get('code')?.value ?? '';
    const nuevos = bulk
      .split(/\r?\n/)          // separa LF y CRLF
      .map((c:any) => c.trim())      // quita espacios
      .filter(Boolean);        // descarta líneas vacías

    // añade sólo los que aún no existen
    this.codes.push(...nuevos.filter((c:any) => !this.codes.includes(c)));

    this.formCode.get('code')!.reset();   // limpia textarea
  }

  removeCode(code: string): void {
    this.codes = this.codes.filter((c:any) => c !== code);
  }

  onClose(): void {
    this.dialogRef.close(true);
  }

  onSave(): void {

    this.dialogRef.close({
      codes: this.codes,
      uses: this.formCode.get('uses')?.value,
    });
  }

}
