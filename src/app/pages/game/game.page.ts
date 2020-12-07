import { Component, OnInit, ElementRef, ɵPlayer } from "@angular/core";
import * as p5 from "p5";
import { AlertController } from "@ionic/angular";
import { Player } from "src/app/model/Player";

import { ActivatedRoute } from "@angular/router";
import { PlayerServService } from "src/app/services/player-serv.service";
import { Md5 } from "ts-md5/dist/md5";

@Component({
  selector: "app-game",
  templateUrl: "./game.page.html",
  styleUrls: ["./game.page.scss"],
})
export class GamePage implements OnInit {
  idSala;
  timer;
  players: Player[] = [];
  preguntaInput: string;
  dataready: Boolean = false;
  gameready: Boolean;
  player: Player = {
    userName: "",
    pregunta: "",
    puntos: 0,
    sala: "",
    seleccion: "",
  };
  playertarget: Player;
  playerPlaying: Player;
  seguirRotando: Boolean;
  resultados: string[] = [];

  constructor(
    private el: ElementRef,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    private playerServ: PlayerServService
  ) {}

  ngOnInit() {
    this.idSala = this.activatedRoute.snapshot.paramMap.get("id");
    this.player.sala = this.idSala;
    this.timer = 10;
    this.askName();
    // this.players = this.playerServ.getPlayers();
    // this.playertarget = this.seleccionaPlayer();
    // this.dataready = true;
  }

  startTimer() {
    this.timer = 25;
    setTimeout(() => {}, 3000);
    var countdown = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(countdown);
        this.timer = "Se acabo!";
      }
    }, 1000);
  }

  async askName() {
    const alert = await this.alertCtrl.create({
      header: "Bienvenido a la sala!",
      subHeader: "Preparate para jugar",
      inputs: [
        {
          name: "username",
          placeholder: "Nombre de jugador",
        },
      ],
      buttons: [
        {
          text: "añadir jugador",
          handler: (data) => {
            if (data.username.trim() == "") {
              return false;
            } else {
              this.playerServ.setPlayer({
                pregunta: "",
                puntos: 0,
                sala: this.idSala,
                seleccion: null,
                userName: data.username,
                pic:
                  "https://gravatar.com/avatar/" +
                  Md5.hashStr(Math.floor(Math.random() * 99999).toString(16)) +
                  "?d=identicon&f=y",
              });

              this.players = this.playerServ.getPlayers();

              console.log("jugador " + data.username + " añadido");
              this.askName();
            }
          },
        },
        {
          text: "Lets gooooo!",
          handler: (data) => {
            if (data.username.trim() == "") {
              return false;
            } else {
              this.playerServ.setPlayer({
                pregunta: "",
                puntos: 0,
                sala: this.idSala,
                seleccion: null,
                userName: data.username,
                pic:
                  "https://gravatar.com/avatar/" +
                  Md5.hashStr(Math.floor(Math.random() * 99999).toString(16)) +
                  "?d=identicon&f=y",
              });

              console.log("jugador " + data.username + " añadido");
              this.players = this.playerServ.getPlayers();
              if (this.players.length>0) {
                this.playertarget = this.seleccionaPlayer();
              this.dataready = true;
              console.log(this.players.toString());
              }
              
            }
          },
        },
      ],
    });

    await alert.present();
  }
  userpic(target: string) {
    return target;
  }
  seleccionaPlayer() {
      return this.players[Math.floor(Math.random() * this.players.length)];

  }
  addPregunta() {
    if (this.preguntaInput.trim() == "") {
    } else {
      this.playertarget.pregunta = this.preguntaInput;
      this.seleccionaPlayer();
      this.gameready = true;
      do {
        this.playerPlaying = this.seleccionaPlayer();
      } while (this.playerPlaying == this.playertarget);

      this.seguirRotando = true;
    }
  }
  cardClick(option: string) {
    if (option === "si") {
      this.playerPlaying.seleccion = "si";
    } else {
      this.playerPlaying.seleccion = "no";
    }
    this.seguirRotando = false;
    console.log(this.players);

    this.players
      .filter((player) => player.userName != this.playertarget.userName)
      .forEach((p) => {
        if (p.seleccion === null) {
          this.seguirRotando = true;
        }
      });
    if (this.seguirRotando) {
      let indextarget = Math.floor(
        Math.random() *
          this.players
            .filter((p) => p.userName != this.playertarget.userName)
            .filter((p) => p.seleccion == null).length
      );
      this.playerPlaying = this.players
        .filter((p) => p.userName != this.playertarget.userName)
        .filter((p) => p.seleccion == null)[indextarget];
    }
  }

  resolucion(option: string) {
    this.resultados = [];
    this.players
      .filter((p) => p.userName != this.playertarget.userName)
      .forEach((player) => {
        if (player.seleccion == option) {
          this.resultados.push(player.userName + " ha ganado!");
          player.puntos += 10;
        } else {
          this.resultados.push(player.userName + " ha perdido!!");
        }
      });
    this.playertarget.seleccion = option;
  }
  reset() {
    this.dataready = true;
    this.gameready = false;
    this.preguntaInput = "";
    this.players.forEach(p => {
      p.seleccion = null;
    });
    this.playertarget = this.seleccionaPlayer();
    this.seguirRotando = true;
    this.resultados = [];
  }

  savePlayers() {
    this.playerServ.savePlayers(this.players);
  }

  async loadplayers() {
    let result = await this.playerServ.getPlayersFromStorage();
    console.log(result);
    
    result.forEach(player => {
      this.playerServ.setPlayer({
        pregunta: player.pregunta,
        puntos: player.puntos,
        sala: this.idSala,
        seleccion: player.seleccion,
        userName: player.userName,
        pic: player.pic,
      });
    });
    this.players = this.playerServ.getPlayers();
    if (this.players.length>0) {
    this.playertarget = this.seleccionaPlayer();
    this.dataready = true;
    console.log(this.players.toString());
    }
  }
}
