/**
 * Reglas de negocio - Carreras de Caballos
 * 4 usuarios por sala, 1000 pts al registrarse, precio variable, premio x5, paquete 1000 pts = $10.000 COP
 */

module.exports = {
  /** Puntos que recibe el usuario al registrarse */
  SIGNUP_POINTS: 1000,

  /** Número de jugadores requeridos por sala para iniciar la carrera */
  PLAYERS_PER_ROOM: 4,

  /** Precio de entrada mínimo y máximo por carrera (puntos) */
  ENTRY_PRICE_MIN: 10,
  ENTRY_PRICE_MAX: 1000,

  /** Multiplicador del premio: si ganas, recibes puntos_apostados * WIN_MULTIPLIER */
  WIN_MULTIPLIER: 5,

  /** Paquete de compra: puntos y precio en COP */
  PACKAGE_POINTS: 1000,
  PACKAGE_PRICE_COP: 10000
};
