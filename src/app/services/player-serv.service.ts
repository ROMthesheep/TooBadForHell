import { Injectable } from "@angular/core";
import { Player } from "../model/Player";

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;


@Injectable({
  providedIn: "root",
})
export class PlayerServService {
  players: Player[] = [];
  playerCounter: number = 0;

  constructor() {
    // this.players = [{ id: 0, userName: "Platon", pregunta: "sos tonto?", puntos: 50, sala: "una", seleccion: null, }, { id: 1, userName: "Aristoteles", pregunta: "sos tonto?", puntos: 50, sala: "una", seleccion: null, }, { id: 3, userName: "Kant", pregunta: "sos tonto?", puntos: 50, sala: "una", seleccion: null, }, { id: 4, userName: "Laplace", pregunta: "sos tonto?", puntos: 50, sala: "una", seleccion: null, }, { id: 5, userName: "Roseau", pregunta: "sos tonto?", puntos: 50, sala: "una", seleccion: null, }, { id: 6, userName: "Anaximenes ", pregunta: "sos tonto?", puntos: 50, sala: "una", seleccion: null, },];

  }

  public getPlayers(): Player[] {
    return this.players;
  }
  public setPlayer(p: Player) {
    p.id = this.playerCounter++;
    this.players.push(p);
  }
  public getPlayer(id: number) {
    return this.players.filter((p) => p.id == id)[0];
  }

  public async savePlayers(players: Player[]) {
    await Storage.set({
      key: 'players',
      value: JSON.stringify(players)
    });
  }

  public async getPlayersFromStorage(): Promise<Player[]>{
    const ret = await Storage.get({ key: 'players' });
    return JSON.parse(ret.value) ? JSON.parse(ret.value) : [];
  }


}
