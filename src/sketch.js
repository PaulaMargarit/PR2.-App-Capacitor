//Paleta de colors que vindrà de la Pantalla 2
export let paleta;

//Instància del sketch p5.js, per poder reiniciar-lo o accedir-hi des de main.js
export let sketchInstance = null;

//Variable  per saber si el mode nit està activat
export let modeNit = false;

//Retorna l'estat actual del mode nit
export function getModeNit(){
  return modeNit;
}

//Actualitza el mode nit
export function setModeNit(valor){
  modeNit = valor;
}

//Funció principal que crea el canvas i inicia l'animació
export function iniciarCanvas(){

  // Si la paleta està buida o no és vàlida, posem una paleta per defecte
  if (!Array.isArray(paleta) || paleta.length === 0) {
    paleta = [
      [231, 24, 11],
      [255, 223, 32],
      [42, 166, 62],
      [21, 93, 252]
    ];
  }

  //Si ja hi havia un sketch creat, l'eliminem per evitar duplicats
  if (sketchInstance){
    sketchInstance.remove();
  }
  //Creem sketch p5
  sketchInstance = new p5((p) => {

    p.setup = () =>{

      //Crear canvas a pantalla completa
      let c = p.createCanvas(p.windowWidth, p.windowHeight);

      //Posem canvas dins del div de la pantalla 3
      c.parent("canvasContainer");

      //Fons inicial segons mode nit
      p.background(modeNit ? 0 : 255);
      //Velocitat cercles
      p.frameRate(1);
    };

    p.draw = () =>{

      //Si per algun motiu la paleta està buida, no dibuixem res
      if (!paleta || paleta.length === 0){
        return;
      }

      //Color aleatori
      let color = p.random(paleta);
      //Sense línia
      p.noStroke();
      //Color del cercle
      p.fill(color[0], color[1], color[2]);
      //Mida aleatòria
      let size = p.random(40, 120);
      //Posició aleatòria
      let x = p.random(p.width);
      let y = p.random(p.height);

      //Dibuixem cercles
      p.circle(x, y, size);
    };

    //Quan la finestra canvia de mida, el canvas s'adapta
    p.windowResized = () =>{
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

  });
}