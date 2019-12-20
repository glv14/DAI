var contador = 1;

//Funciones Auxiliares
function insertAsLastChild(padre, nuevoHijo)
{
    padre.appendChild(nuevoHijo);
}
function insertAsFirstChild(padre, nuevoHijo)
{
    padre.insertBefore(nuevoHijo, padre.firstChild);
}
function insertBeforeChild(padre, hijo, nuevoHijo)
{
    padre.insertBefore(nuevoHijo, hijo);
}
function removeElement(nodo)
{
    nodo.parentNode.removeChild(nodo);
}
function queryAncestorSelector(node, selector) 
{
    var parent= node.parentNode;
    var all = document.querySelectorAll(selector);
    var found = false;

    while (parent !== document && !found) 
    {
      for (var i = 0; i < all.length && !found; i++) 
      {
        found = (all[i] === parent) ? true : false;
      }
      parent = (!found)?parent.parentNode : parent;
    }
    return (found) ? parent : null;
}

//Funciones Principales
function addCruz(nodo)
{
    var divisor = document.createElement("div");
    divisor.className = "borra";
    divisor.textContent = "☒";
	insertAsFirstChild(nodo, divisor);

    divisor.addEventListener("click", borraPregunta);
}

function borraPregunta(evento)
{
    var pregunta = queryAncestorSelector(evento.target, ".bloque"); //evento.target es donde haces click
    var cuestionario = queryAncestorSelector(pregunta, "section");  //Hay que ponerlo antes del removeElement, 
                                                                    //si no accede a un elemento nulo y peta
    removeElement(pregunta); 

    if(cuestionario.childElementCount === 2)
    {
        removeElement(cuestionario);
        var refe = document.getElementById('h' + cuestionario.id);
        var antecesor = queryAncestorSelector(refe,'li');
        removeElement(antecesor);
    }
}

function addFormPregunta(sec)
{
    var nuevaPregunta= document.createElement('div');
    nuevaPregunta.className = "formulario";
	nuevaPregunta.innerHTML = '<ul><li><label>Enunciado de la pregunta:</label><input type="text" name="' + sec.id + '_pregunta"></li><li><label>Respuesta:</label><input type="radio" name="' + sec.id + '_respuesta" value="verdadero" checked>Verdadero<input type="radio" name="' + sec.id + '_respuesta" value="falso">Falso</li><li><input type="button" value="Añadir nueva pregunta"></li></ul>';
   
    var bloque = sec.querySelector('.bloque');
    insertBeforeChild(sec,bloque,nuevaPregunta);
    nuevaPregunta.querySelector('input[type="button"]').addEventListener("click",addPregunta);
    return nuevaPregunta
}

function addPregunta(evento)
{
    var formulario = queryAncestorSelector(evento.target,"section");

    var pregunta = document.body.querySelector('input[name="' + formulario.id + '_pregunta"]');
    var respuesta;
    var contestacion = queryAncestorSelector(evento.target,"ul").querySelector('input[type="radio"]');
    
    if(pregunta.value == "")
    {
        alert("Pregunta del cuestionario vacia, POR FAVOR RELLENE EL TEXTO");
    }
    else
    {
        var nuevaPregunta= document.createElement('div');
        nuevaPregunta.className = "bloque";
        
        if(contestacion.checked == false)
        {
            respuesta = "false";
        }
        else
        {
            respuesta = "true";
        }
        nuevaPregunta.innerHTML='<div class="pregunta"><p>' + pregunta.value + '</p></div><div class="respuesta" data-valor="' + respuesta + '"></div>';
        var seccion = document.getElementById(formulario.id);
        addCruz(nuevaPregunta);
        insertAsLastChild(seccion,nuevaPregunta);
        pregunta.value = "";
        contestacion.checked = true;
    }
    
}

function addCuestionario(evento)
{
    var temaCuestionario = queryAncestorSelector(evento.target,"ul").querySelector('input[type="text"]');

    if(temaCuestionario.value == "")
    {
        alert("Campos de creación de cuestionario vacios, POR FAVOR RELLENE TODO");
    }
    else
    {
        var nuevoCuestionario = document.createElement('section');
        nuevoCuestionario.id = "c" + contador;
        nuevoCuestionario.innerHTML = '<encabezado-cuestionario tema="' + temaCuestionario.value + '"></encabezado-cuestionario>';
        var respuestaPreg = addFormPregunta(nuevoCuestionario);

        var insertar = document.querySelector("main");
        insertAsLastChild(insertar,nuevoCuestionario);
        var index = document.querySelector("nav").querySelector("ul");
        var nuevoLi = document.createElement('li');
        nuevoLi.innerHTML = '<a id="h' + nuevoCuestionario.id + '" href=#' + nuevoCuestionario.id + '>'+ temaCuestionario.value + '</a>';
        insertAsLastChild(index,nuevoLi);
        temaCuestionario.value = "";
        contador += 1;
    }
}

// "Main"
function init() 
{
    var bloque = document.body.querySelectorAll(".bloque");
    for(var i=0; i<bloque.length; i++)
    {
        addCruz(bloque[i]);
    }
	var seccion = document.body.querySelectorAll("section");
	for(var i=0; i<seccion.length; i++)
    {
        var respuestaCuestionario = addFormPregunta(seccion[i]);
    }
    var btnCuestio = document.body.querySelector('input[name="crea"]');
    btnCuestio.addEventListener("click",addCuestionario);
}

//Tenemos que tener la llamada a la función, si no no te hace nada
document.body.addEventListener("load", init()); //load es para cuando se carga la pagina
                                                //init hay que ponerlo con paréntesis, si no no funciona