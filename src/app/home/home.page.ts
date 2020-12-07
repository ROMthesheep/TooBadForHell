import { Component, OnInit, ElementRef } from "@angular/core";
import * as p5 from "p5";
import { AlertController } from "@ionic/angular";
import { Router } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {

  curve: any;
  canvasSizeX = innerWidth - 30;
  canvasSizeY = 200;

  pregunta: string;
  gameready: Boolean;
  
  constructor(private el: ElementRef, private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {
    
    const p5obj = new p5((p) => {
      p.setup = () => {
        this.setup(p);
      };
      p.draw = () => {
        this.draw(p);
      };
    }, this.el.nativeElement);
    const p5obj2 = new p5((p) => {
      p.setup = () => {
        this.setup2(p);
      };
      p.draw = () => {
        this.draw2(p);
      };
    }, this.el.nativeElement);

    this.pregunta = "eyy";
  
  }
  setup(p) {
    const c = document.querySelector("#canvasContainer");
    p.createCanvas(this.canvasSizeX, this.canvasSizeY).parent(c);

    
  }
  draw(p) {
    let inpText = "Too bad for hell";
    p.noStroke();
    p.textSize(50);
    p.textAlign(p.CENTER);
    p.background(256)
    p.translate(this.canvasSizeX / 2, this.canvasSizeY / 2);
    p.text("Too bad for hell", 0, 0)

  }
  setup2(p) {
    const c = document.querySelector("#fondo");
    p.createCanvas(innerWidth * 1.2, innerHeight * 2).parent(c);
  }
  draw2(p) {
    // p.background(0);
  }
  createRoom() {
    this.router.navigateByUrl(`/game/${Math.floor(Math.random() * 99999).toString(16)}`)
  }
  localGame() {
    this.router.navigateByUrl(`/game/localgame`)
  }
  
  async JoinRoom() {
    const alert = await this.alertCtrl.create({
      message: 'Introduce el Codigo de la sala',
      inputs: [
        {
          name: 'code',
          placeholder: 'Codigo'
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Entrar en la sala!',
          handler: data => {

            if (data.code.trim() == "") {
              return false;
            } else {
              this.router.navigateByUrl("game/" + data.code)
            }
          }
        }
      ]
    });
    await alert.present();
  }
}