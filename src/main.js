console.log("MAIN JS CARREGAT");

//Importem els estils i les funcions del canvas
import './style.css';
import { iniciarCanvas, setModeNit, getModeNit, sketchInstance } from './sketch.js';
//Importem el plugin de càmera de Capacitor
import { Camera, MediaTypeSelection } from '@capacitor/camera';

//Agafem les tres pantalles del DOM
const pantalla1 = document.getElementById("pantalla1");
const pantalla2 = document.getElementById("pantalla2");
const pantalla3 = document.getElementById("pantalla3");

//Només és veu la Pantalla 1, amaguem les altres
pantalla2.style.display = "none";
pantalla3.style.display = "none";

//Funció per seleccionar una foto de la galeria
const seleccionarFoto = async () =>{
    try {
        const photo = await Camera.getPhoto({
        quality: 90,
        resultType: "uri",
        source: "PHOTOS"   // Obrir galeria
        });

        //Guardem la foto al localStorage
        localStorage.setItem("foto", photo.webPath);

        //Mostra la Pantalla 2, amaguem la 1
        pantalla1.style.display = "none";
        pantalla2.style.display = "block";

        carregarPantalla2();
    } 
    
    catch (error) {
        console.error("Error seleccionant foto:", error);
    }
}

//Quan cliquem el botó, va a la funció seleccionarFoto i s'obre la galeria
document.getElementById("botoFoto").addEventListener("click", seleccionarFoto);


//Pantalla 2
//Botó per tornar a seleccionar una foto
document.getElementById("botoTornar").addEventListener("click", () => {
    localStorage.removeItem("foto");
    localStorage.removeItem("colorSeleccionat");

    document.getElementById("pantalla2").style.display = "none";
    document.getElementById("pantalla1").style.display = "flex";
});

//Funció per carregar la foto i generar la paleta
function carregarPantalla2(){
    //Posem la foto triada a l'element <img>
    const img = document.getElementById("fotoTriada");
    img.crossOrigin = "anonymous";
    img.src = localStorage.getItem("foto");

    //Quan la imatge està carregada fem ColorThief
    img.onload = () =>{
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 4);

        //Guardem la paleta per utilitzar-la al canvas
        localStorage.setItem("paleta", JSON.stringify(palette));

        //Mostrem la paleta a la pantalla
        const paletaDiv = document.getElementById("paleta");
        paletaDiv.innerHTML = "";

        //Creem un quadrat per cada color
        palette.forEach(color => {
            const div = document.createElement("div");
            div.className = "colorBox";
            div.style.backgroundColor = `rgb(${color})`;

            //Quan l'usuari cliqui un color de la paleta mostrem la inforamció sota
            div.addEventListener("click", () => {
              const hex = rgbAHex(color[0], color[1], color[2]);
              obtenirInfoColor(hex);
            });

            paletaDiv.appendChild(div);
        });
    };
}

//Canviar de RGB a HEX
function rgbAHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

//Funció que obté informació detallada d'un color fent servir The Color API
function obtenirInfoColor(hex){
  //Fem una crida a The Color API passant el color en format HEX
  fetch(`https://www.thecolorapi.com/id?hex=${hex.replace("#", "")}`)
  //Convertim la resposta en JSON
  .then(res => res.json())
  //Afegim el nom del color i rgb que retorna l'API
  .then(data => {
    const nom = data.name.value;
    const rgb = data.rgb.value;
    //Cridem la funció per mostrar la informació a la pantalla
    mostrarInfoColor(nom, hex, rgb);
  })
  //Si hi ha un error, el mostrem a la consola
  .catch(err => console.error("Error API:", err));
}

//Funció per mostrar la informació del color
function mostrarInfoColor(nom, hex, rgb){
  //Afagem el div on es mostrara la informació del color
  const info = document.getElementById("infoColor");
  //Instertem el contingut HTML amb el nom, el color, el HEX i el rgb
  info.innerHTML = `
    <h3>Color seleccionat</h3>
    <div style="width:40px;height:40px;background:${hex};border-radius:4px;margin-bottom:10px;"></div>
    <p><strong>Nom:</strong> ${nom}</p>
    <p><strong>HEX:</strong> ${hex}</p>
    <p><strong>RGB:</strong> ${rgb}</p>
  `;
}



// Botó per anar a la Pantalla 3
document.getElementById("botoCanvas").addEventListener("click", () => {
  pantalla2.style.display = "none";
  pantalla3.style.display = "flex";

  iniciarCanvas();
});


//Pantalla3
//Botó per tornar a la Pantalla 2
document.getElementById("botoEnrere").addEventListener("click", () => {
  pantalla3.style.display = "none";
  pantalla2.style.display = "block";
});

//Elements del panell de configuració
const botoConfig = document.getElementById("botoConfig");
const configPanel = document.getElementById("configPanel");
const colorSwitch = document.querySelector('#switch input[type="checkbox"]');

//Obrir o tancar el panell de configuració
botoConfig.addEventListener("click", () =>{
  configPanel.style.display =
    configPanel.style.display === "block" ? "none" : "block";
});

//Funció per canviar entre mode clar i mode nit
function cambiaTema(ev){

  if(ev.target.checked){
    //// Mode nit activat
    document.documentElement.setAttribute('tema', 'dark');
    setModeNit(true);
  }else{
    //Mode clar
    document.documentElement.setAttribute('tema', 'light');
    setModeNit(false);
  }

  //Repintar fons canvas, perque també es pinti quan canviem de mode
  if(sketchInstance){
    sketchInstance.background(getModeNit() ? 0 : 255);
  }
}

//Quan l'usuari activa/desactiva el switch, canviem el tema
colorSwitch.addEventListener('change', cambiaTema);

