(function() {
    const template = document.createElement('template');
  
    template.innerHTML = `
      <style>
        h2 {
            font-weight: bold;
            font-size: 25px;
        }
    
        img {
            vertical-align: text-top;
            border: 1px solid lightgray;
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }
    
        .wiki {
            font-size: 90%;
        }
        </style>
        <h2></h2>

        <div class="wiki"></div>
    `;
  
    class EncabezadoCuestionario extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({
            mode: 'open'
            });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
  
        connectedCallback() {  
            var temaCuestionario = this.getAttribute('tema');
            //console.log(temaCuestionario);
            var textWiki = this.shadowRoot.querySelector('.wiki');
            var encabezado = this.shadowRoot.querySelector('h2');
            
            addFlickr(temaCuestionario,encabezado);
            addWikipedia(temaCuestionario,textWiki);
            
        }
    }
    window.customElements.define('encabezado-cuestionario', EncabezadoCuestionario);
})();


function addWikipedia (tema, nodo){
    var wikipediaAsinc = 'https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles=' + tema;
    var respuestaWikiAsinc = "";
    var phError = "Error, respuesta incorrecta: ";
    var nuevaPregunta = "";
    	

    fetch(String(wikipediaAsinc)).then(function(respuesta) {
        if (respuesta.ok) {
          return respuesta.json();
        }
        throw Error(phError + respuesta.statusText);
    }).then(function(datos) {
        for (var i in datos.query.pages) {
            respuestaWikiAsinc += datos.query.pages[i].extract;
        }
        if (respuestaWikiAsinc == 'undefined') {
            nodo.textContent = ""; 
        } else {
            nuevaPregunta = respuestaWikiAsinc;
            nodo.textContent = nuevaPregunta;
        }
    }).catch(function(error) {
          console.log('Error: \n', error);
    });

}

function addFlickr (tema, nodo){
    var flickerAsinc = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=090c919d433b826241cb91099c38b7eb&text=' + tema + '&format=json&per_page=10&media=photos&sort=relevance&nojsoncallback=1';
    //var nuevaImagen = document.createElement('img');
    //var nuevoTitulo = document.createTextNode("Cuestionario sobre " + tema);
    var idFoto = "";
    var phError = "Error, respuesta incorrecta: ";

    fetch(String(flickerAsinc)).then(function(respuesta) {
        if (respuesta.ok) {
          return respuesta.json();
        }
        throw Error(phError + respuesta.statusText);
    }).then(function(datos) {
        if (datos.photos.photo.length == 0) {
            var tierra = "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg";
            crearImagen(tierra, tema, nodo);
            /*
            nuevaImagen.setAttribute('src', "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg");
            nodo.appendChild(nuevaImagen);
            nodo.appendChild(nuevoTitulo);
            */
            //Cuestionario sobre ' + tema;
          
        } else {
          idFoto = datos.photos.photo[0].id;
        }
        var flickerAsinc2 = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=f384bc62291acd04dc2d7161702aaff5&photo_id=" + idFoto + "&format=json&nojsoncallback=1";
        fetch(String(flickerAsinc2)).then(function(respuesta) {
            if (respuesta.ok) {
              return respuesta.json();
            }
            throw Error(phError + respuesta.statusTest);
          }).then(function(datos) {
            fotoflicker = datos.sizes.size[0].source;
            crearImagen(fotoflicker, tema, nodo);
            /*
            nuevaImagen.setAttribute('src', fotoflicker);
            nodo.appendChild(nuevaImagen);
            nodo.appendChild(nuevoTitulo);
            */
          }).catch(function(error) {
            console.log('Error: \n', error)
          });
    }).catch(function(error) {
        console.log('Error: \n', error)
    });  
}
function crearImagen(imagen, tema, nodo){
    var nuevaImagen = document.createElement('img');
    var nuevoTitulo = document.createTextNode("Cuestionario sobre " + tema);
    nuevaImagen.setAttribute('src', imagen);
    nodo.appendChild(nuevaImagen);
    nodo.appendChild(nuevoTitulo);
}
