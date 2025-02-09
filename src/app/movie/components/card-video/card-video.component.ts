import { Component, Inject, OnInit } from '@angular/core';

import {MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-card-video',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './card-video.component.html',
  styleUrl: './card-video.component.css'
})
export class CardVideoComponent implements OnInit{

  trailerSafeUrl!: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<CardVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { embedUrl: string },
    private sanitizer: DomSanitizer,

  ){}

  ngOnInit(): void {

    this.trailerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.embedUrl);
  }

  getYouTubeEmbedUrl(originalUrl: string | undefined): string {
    if (!originalUrl) return '';

    let videoId = '';

    // 1. Si incluye "youtu.be/" => corta a partir de esa ruta
    if (originalUrl.includes('youtu.be/')) {
      // https://youtu.be/VIDEO_ID
      const parts = originalUrl.split('youtu.be/');
      videoId = parts[1]?.split('?')[0]; // en caso haya parámetros
    }
    // 2. Si incluye "watch?v=" => parsea el valor del v=...
    else if (originalUrl.includes('watch?v=')) {
      const params = new URL(originalUrl).searchParams;
      videoId = params.get('v') || '';
    }
    // 3. Si ya incluye "embed/" (caso raro) => extrae todo lo que esté después de /embed/
    else if (originalUrl.includes('/embed/')) {
      const parts = originalUrl.split('/embed/');
      videoId = parts[1]?.split('?')[0];
    }

    // 4. Si por alguna razón videoId sigue vacío, puedes dejarlo tal cual
    // o manejar un fallback. Pero asumiendo que sí sacaste el ID correctamente:
    if (!videoId) {
      return ''; // O un fallback
    }

    // 5. Retorna el link de embed final
    return `https://www.youtube.com/embed/${videoId}`;
  }

  onClose(){
    this.dialogRef.close()
  }

}
