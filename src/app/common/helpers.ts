export function getFormattedDate() {
  const today = new Date(); // fecha actual
  const year = today.getFullYear();
  // getMonth() retorna un valor 0-11, por eso se suma 1 para obtener el mes correcto (1-12).
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // Retornamos en formato YYYY-MM-DD
  return `${year}-${month}-${day}`;
}

export function getFormattedDateV2(date: Date){

  const year = date.getFullYear();
  const month = String(date.getDate()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`

}

export function isButtonDisabled(showtime: string, showdate: string, cinemaType: string): boolean {
  /* ───── Normalizar fechas ───── */
  // 1) Fecha del show sin hora (forzamos hora 00:00 local)
  console.log('showtime: ',showtime);

  console.log('showdate: ',showdate)

  const dShow = new Date(`${showdate}`);
  // 2) Hoy sin hora
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  /* ───── Filtro por día ───── */
  if (dShow.getTime() > today.getTime()) {
    // Mañana o después ⇒ botón habilitado
    return false;
  }
  if (dShow.getTime() < today.getTime()) {
    // Ayer o antes ⇒ botón deshabilitado
    return true;
  }

  /* ───── Aquí sabemos que es HOY ───── */
  // Hora del show
  const [hours, minutes] = showtime.split(':').map(Number);
  const showtimeDate = new Date(today);          // mismo día
  showtimeDate.setHours(hours, minutes, 0, 0);   // hora del show

  // Umbral: 20 min o 0 min para Cinemark
  const threshold =
    cinemaType.toLowerCase() === 'cinemark' ? 0 : 20 * 60 * 1000;

  // Si ya pasaron ≥ threshold ms desde la hora del show ⇒ deshabilitar
  return now.getTime() - showtimeDate.getTime() >= threshold;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
