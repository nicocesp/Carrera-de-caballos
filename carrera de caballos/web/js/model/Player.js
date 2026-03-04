/**
 * Jugador: id, nombre, palo apostado, fichas.
 */
class Player {
  constructor(id, name, betSuit, chips = 100) {
    if (!name || !name.trim()) throw new Error('name no puede ser nulo o vacío');
    this.id = id;
    this.name = name.trim();
    this.betSuit = betSuit;
    this.chips = Math.max(0, chips);
  }

  addChips(amount) {
    this.chips = Math.max(0, this.chips + amount);
  }
}

window.Player = Player;
