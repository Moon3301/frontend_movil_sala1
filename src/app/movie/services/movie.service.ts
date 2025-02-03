import { Injectable } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { ICines } from '../interfaces/funciones.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl: string = environments.baseUrl;

  movies: Movie[] = [
    {
      "id": 1,
      "tittle_slug": "amenaza-en-el-aire",
      "company": "Cinepolis",
      "tittle": "AMENAZA EN EL AIRE",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=T-yMB47ypk8",
      "img_url": "http://static.cinepolis.com/img/peliculas/47046/1/1/47046.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 2,
      "tittle_slug": "mufasa-el-rey-leon",
      "company": "Cinepolis",
      "tittle": "MUFASA: EL REY LEON",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=glX5xo-E7WQ",
      "img_url": "http://static.cinepolis.com/img/peliculas/47248/1/1/47248.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 3,
      "tittle_slug": "interstellar-10-aniversario",
      "company": "Cinepolis",
      "tittle": "INTERSTELLAR: 10 ANIVERSARIO",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=NVw3DnN9WoA",
      "img_url": "http://static.cinepolis.com/img/peliculas/48619/1/1/48619.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 4,
      "tittle_slug": "nosferatu",
      "company": "Cinepolis",
      "tittle": "NOSFERATU",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=Rbj7EK5G2HI",
      "img_url": "http://static.cinepolis.com/img/peliculas/48535/1/1/48535.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 5,
      "tittle_slug": "companera-perfecta",
      "company": "Cinepolis",
      "tittle": "COMPAÑERA PERFECTA",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=VLYz8J9r2iA",
      "img_url": "http://static.cinepolis.com/img/peliculas/48442/1/1/48442.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 6,
      "tittle_slug": "las-aventuras-de-dog-man",
      "company": "Cinepolis",
      "tittle": "LAS AVENTURAS DE DOG MAN",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=jC2zCqYvch0",
      "img_url": "http://static.cinepolis.com/img/peliculas/48423/1/1/48423.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE"
  },
  {
      "id": 7,
      "tittle_slug": "paddington-en-peru",
      "company": "Cinepolis",
      "tittle": "PADDINGTON EN PERU",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=dsabAwnVOX0",
      "img_url": "http://static.cinepolis.com/img/peliculas/48443/1/1/48443.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE"
  },
  {
      "id": 8,
      "tittle_slug": "hombre-lobo",
      "company": "Cinepolis",
      "tittle": "HOMBRE LOBO",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=cLdtdJTOkx0",
      "img_url": "http://static.cinepolis.com/img/peliculas/48444/1/1/48444.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 9,
      "tittle_slug": "sonic-3-la-pelicula",
      "company": "Cinepolis",
      "tittle": "SONIC 3: LA PELICULA",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=6ufhUlL5UGk",
      "img_url": "http://static.cinepolis.com/img/peliculas/47384/1/1/47384.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE"
  },
  {
      "id": 10,
      "tittle_slug": "moana-2",
      "company": "Cinepolis",
      "tittle": "MOANA 2",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=_hbUuYUtOmU",
      "img_url": "http://static.cinepolis.com/img/peliculas/47205/1/1/47205.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE"
  },
  {
      "id": 11,
      "tittle_slug": "diario-de-una-pasion",
      "company": "Cinepolis",
      "tittle": "DIARIO DE UNA PASION",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "",
      "img_url": "http://static.cinepolis.com/img/peliculas/45334/1/1/45334.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 12,
      "tittle_slug": "bridget-jones-loca-por-el",
      "company": "Cinepolis",
      "tittle": "BRIDGET JONES: LOCA POR EL",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=MdvAVL6KLhQ",
      "img_url": "http://static.cinepolis.com/img/peliculas/48799/1/1/48799.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 13,
      "tittle_slug": "capitan-america-un-nuevo-mundo",
      "company": "Cinepolis",
      "tittle": "CAPITAN AMERICA: UN NUEVO MUNDO",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=gSsfoOZvM1M",
      "img_url": "http://static.cinepolis.com/img/peliculas/48711/1/1/48711.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 14,
      "tittle_slug": "antes-del-amanecer",
      "company": "Cinepolis",
      "tittle": "ANTES DEL AMANECER",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "",
      "img_url": "http://www.cinehoyts.cl/img/genericos/cartel-hoyts.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 16,
      "tittle_slug": "cuando-te-vas",
      "company": "Cinepolis",
      "tittle": "CUANDO TE VAS",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=zJdL_iOwBxg",
      "img_url": "http://static.cinepolis.com/img/peliculas/48693/1/1/48693.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 17,
      "tittle_slug": "bagman-el-espiritu-del-mal",
      "company": "Cinepolis",
      "tittle": "BAGMAN: EL ESPIRITU DEL MAL",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=-o1NhtcLtAo",
      "img_url": "http://static.cinepolis.com/img/peliculas/48172/1/1/48172.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 18,
      "tittle_slug": "la-tumba-de-las-luciernagas",
      "company": "Cinepolis",
      "tittle": "LA TUMBA DE LAS LUCIERNAGAS",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=ZwHWCQECbqY",
      "img_url": "http://static.cinepolis.com/img/peliculas/48616/1/1/48616.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 19,
      "tittle_slug": "dragon-ball-daima",
      "company": "Cinepolis",
      "tittle": "DRAGON BALL DAIMA",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=BDceqeCkMdk",
      "img_url": "http://static.cinepolis.com/img/peliculas/48713/1/1/48713.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 20,
      "tittle_slug": "kenia-os-la-og",
      "company": "Cinepolis",
      "tittle": "KENIA OS: LA OG",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "",
      "img_url": "http://static.cinepolis.com/img/peliculas/48952/1/1/48952.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 21,
      "tittle_slug": "medium",
      "company": "Cinepolis",
      "tittle": "MEDIUM",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=cb7Vz7pdCm8",
      "img_url": "http://static.cinepolis.com/img/peliculas/48457/1/1/48457.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 22,
      "tittle_slug": "iu-concert-the-winning",
      "company": "Cinepolis",
      "tittle": "IU CONCERT: THE WINNING",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "",
      "img_url": "http://static.cinepolis.com/img/peliculas/48845/1/1/48845.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 23,
      "tittle_slug": "baekhyun-londaleite-[dot]",
      "company": "Cinepolis",
      "tittle": "BAEKHYUN: LONDALEITE [DOT]",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=nu2XRqcaigI",
      "img_url": "http://static.cinepolis.com/img/peliculas/48937/1/1/48937.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 25,
      "tittle_slug": "gi-dle-world-tour-[idol]",
      "company": "Cinepolis",
      "tittle": "(G)I-DLE WORLD TOUR [iDOL]",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=IBmYGGE35Ss",
      "img_url": "http://static.cinepolis.com/img/peliculas/48798/1/1/48798.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 27,
      "tittle_slug": "emilia-perez",
      "company": "Cinepolis",
      "tittle": "EMILIA PEREZ",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=EoetG0nA4R0",
      "img_url": "http://static.cinepolis.com/img/peliculas/48455/1/1/48455.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 28,
      "tittle_slug": "un-dolor-real",
      "company": "Cinepolis",
      "tittle": "UN DOLOR REAL",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=CqMRTQRLvag",
      "img_url": "http://static.cinepolis.com/img/peliculas/48715/1/1/48715.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 29,
      "tittle_slug": "babygirl",
      "company": "Cinepolis",
      "tittle": "BABYGIRL",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=EqHsH-ZuQTo",
      "img_url": "http://static.cinepolis.com/img/peliculas/48441/1/1/48441.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "18"
  },
  {
      "id": 30,
      "tittle_slug": "maria-callas",
      "company": "Cinepolis",
      "tittle": "MARIA CALLAS",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=Wuk7ZJZhgOU",
      "img_url": "http://static.cinepolis.com/img/peliculas/48422/1/1/48422.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 31,
      "tittle_slug": "septiembre-5",
      "company": "Cinepolis",
      "tittle": "SEPTIEMBRE 5",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=rTj3IhKkGkw",
      "img_url": "http://static.cinepolis.com/img/peliculas/48839/1/1/48839.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 32,
      "tittle_slug": "la-sustancia",
      "company": "Cinepolis",
      "tittle": "LA SUSTANCIA",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=wr2wFDsOQ40",
      "img_url": "http://static.cinepolis.com/img/peliculas/47323/1/1/47323.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "18"
  },
  {
      "id": 33,
      "tittle_slug": "megalopolis",
      "company": "Cinepolis",
      "tittle": "MEGALOPOLIS",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=FJBVGg6wuPs",
      "img_url": "http://static.cinepolis.com/img/peliculas/48692/1/1/48692.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "18"
  },
  {
      "id": 34,
      "tittle_slug": "hereje",
      "company": "Cinepolis",
      "tittle": "HEREJE",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=Obts0M2swiM",
      "img_url": "http://static.cinepolis.com/img/peliculas/48308/1/1/48308.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 35,
      "tittle_slug": "wicked",
      "company": "Cinepolis",
      "tittle": "WICKED",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=rmWKR2u0Pho",
      "img_url": "http://static.cinepolis.com/img/peliculas/47204/1/1/47204.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE"
  },
  {
      "id": 36,
      "tittle_slug": "el-tiempo-que-tenemos",
      "company": "Cinepolis",
      "tittle": "EL TIEMPO QUE TENEMOS",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=T7ffJz0g02s",
      "img_url": "http://static.cinepolis.com/img/peliculas/47877/1/1/47877.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 37,
      "tittle_slug": "patio-de-chacales",
      "company": "Cinepolis",
      "tittle": "PATIO DE CHACALES",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=kMv_P6YlZpw",
      "img_url": "http://static.cinepolis.com/img/peliculas/48696/1/1/48696.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 38,
      "tittle_slug": "quien-tiene-la-culpa",
      "company": "Cinepolis",
      "tittle": "QUIEN TIENE LA CULPA",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=GHaaZRZkJfA",
      "img_url": "http://static.cinepolis.com/img/peliculas/48537/1/1/48537.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "18"
  },
  {
      "id": 39,
      "tittle_slug": "gladiador-2",
      "company": "Cinepolis",
      "tittle": "GLADIADOR 2",
      "synopsis": "",
      "synopsis_alt": "",
      "trailer_url": "https://www.youtube.com/watch?v=TRw-6cpKrIs",
      "img_url": "http://static.cinepolis.com/img/peliculas/47203/1/1/47203.jpg",
      "opening_date": "2025-02-01T02:00:05.000Z",
      "isPremiere": false,
      "rating": "14"
  },
  {
      "id": 60,
      "tittle_slug": "yo-antes-de-ti-[2016]",
      "company": "Cinemark",
      "tittle": "Yo antes de ti [2016]",
      "synopsis": "Lou Clark (Emilia Clarke) es una entusiasta, ingenua y alegre veinteañera que jamás ha salido de su pueblo, y que debe buscar urgentemente un trabajo para mantener a su familia. En su camino se cruza Will Traynor (Sam Claflin), un exitoso hombre de negocios que también creció en este mismo pueblo, al que ha vuelto tras un accidente accidente de coche que lo dejó impedido en una silla de ruedas. Debido a su condición, este ex aventurero ha caído en una profunda amargura, por lo que cada vez más está decidido a suicidarse.\r\n\r\nEl trabajo de Lou será cuidar a Will. Será entonces cuando la determinación, la dulzura y el optimismo de Lou harán que Will comprenda que la vida es algo que merece la pena vivir.\r\n",
      "synopsis_alt": "YO ANTES DE TI [2016]",
      "trailer_url": "https://youtu.be/IoQPUqvcmXY",
      "img_url": "https://cinemarkmedia.modyocdn.com/cl/300x400/102166.jpg",
      "opening_date": "2025-02-27T03:00:00.000Z",
      "isPremiere": false,
      "rating": "TE+7"
  },
  {
      "id": 67,
      "tittle_slug": "golpe-de-suerte-en-paris",
      "company": "Cinemark",
      "tittle": "Golpe de Suerte en Paris",
      "synopsis": "Fanny (Lou de Laâge) y Jean (Melvil Poupaud) parecen el matrimonio ideal: los dos son profesionales consumados, viven en un precioso apartamento en un exclusivo barrio de París y parecen tan enamorados como cuando se conocieron. Pero cuando Fanny se cruza accidentalmente con Alain (Niels Schneider), un antiguo compañero de instituto, queda deslumbrada. Pronto vuelven a verse y se acercan cada vez más...",
      "synopsis_alt": "GOLPE DE SUERTE EN PARÍS",
      "trailer_url": "https://youtu.be/XQBzcB38DbQ",
      "img_url": "https://cinemarkmedia.modyocdn.com/cl/300x400/102093.jpg",
      "opening_date": "2025-01-30T03:00:00.000Z",
      "isPremiere": false,
      "rating": "MA14"
  }
  ]

  constructor(private http: HttpClient) {}

  public getBillboards( movieId: number): Observable<ICines[]>{
    return this.http.post<ICines[]>(`${this.baseUrl}/billboard`, { movieId: movieId } )
  }

  public getMovieByIdLocal( movieId: number): Observable<Movie>{

    const moviesStorage = localStorage.getItem("movies");
    const movies: Movie[] = moviesStorage ? JSON.parse(moviesStorage) : [];

    const movie = movies.find(movie => movie.id === movieId)

    console.log(movie);

    return of(movie!)
  }

  public getMovies(): Observable<Movie[]>{
    return this.http.get<Movie[]>(`${this.baseUrl}/movies`)
  }

  public saveAllMovies(movies: Movie[]){
    console.log('Data guardada en local Storage');

    localStorage.setItem("movies", JSON.stringify(movies))
  }

  public getMoviesLocal(): Movie[]{
    return this.movies
  }
}
