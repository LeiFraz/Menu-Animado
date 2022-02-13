const menu = document.getElementById('menu');
const indicador = document.getElementById('indicador');
const secciones = document.querySelectorAll('.seccion');

/* como todas las secciones tienen el mismo tamaño, da igual cual elegir, NO es necesario buscar todos los
enlaces "querySelectorAll('a')". 

Con "offsetWidth" obtenemos el tamaño que tiene ese elemento en pantalla*/
let tamañoIndicador = menu.querySelector('a').offsetWidth;
//console.log(tamañoIndicador);

/* accedemos al indicador(span), luego a sus  estilos y por ultimo elegimos que propiedad... de ahi le
asignamos el tamaño del indicador y ponemos la cadena 'px' por que la propiedad requiere que se le 
indique que son en pixeles, esa es su medida. */
indicador.style.width = tamañoIndicador + 'px';

/* para saber en que seccion estamos */
let indexSeccionActiva; 

// Observer
const observer = new IntersectionObserver((entradas, observer) => {
	/*entradas van a ser todos los elementos que se vean en pantalla y que se esten observando
	(lo que queremos observar lo pusimos debajo con "observer.observe(ELEMENTO)") */

	/*queremos identificar cual de las entradas se esta viendo en pantalla, para ello hacemos un forEach
	de las entradas (que en este caso tiene a las secciones)*/
	entradas.forEach(entrada => {
		/*por cada seccion hacemos un if e identificamos cual esta siendo itersectada (la que se ve
			en el momento)... se le pregunta ¿te estas mostrando en pantalla? por asi decirlo */
		if(entrada.isIntersecting){
			// Obtenemos cual es la seccion que esta entrando en pantalla.
			// console.log(`La entrada ${entrada.target.id} esta intersectando`);

			/*
			Creamos un arreglo con las secciones y luego obtenemos el index de la seccion que esta en pantalla.

			Transformamos las secciones en un arreglo "[...secciones]", debido que al trarlo asi nomas
			con la funcion "querySelectorAll" este no nos trae un arreglo como tal sino una Lista, por lo tanto 
			hay funciones que no se pueden utilizar, como en este caso el .indexOf que se usa solo con arreglos.
			
			Al usarlo como arreglo, usamos la propiedad indexOf y obtenemos una seccion en especifico*/
			indexSeccionActiva = [...secciones].indexOf(entrada.target);

			/* el indicador se debe desplazar de acuerdo a la seccion que se este viendo.
			para eso se ponen las comillas, el translado en el eje x y dentro:
			- el tamaño del indicador (que ya lo calculamos) y lo multiplicamos por X cantidad, segun la 
			seccion...
			porque? simple, si las secciones tienen un tamaño de 100px c/u y hay 5, eso quiere decir que el
			tamaño maximo del ancho de la pantalla (por asi decirlo) es de 500px.
			Si sacamos el tamaño para el span/Indicador este va a tener 100px.
			Entonces la primera seccion posee 100px (en el eje x comenzaria en la coordenada 0 y termina en la 100), 
			la segunda posee 100px (en el eje de las x, comenzaria en la posicion 100 y termina en la 200), 
			la tercera posee 100px (comenzaria en la posicion 200 y terminaria en la 300)...
			Siguiendo esa lógica al multiplicar el indicador por la seccion, obtenemos su posicion.
			Indicador(100px) * seccion 1 (0)= coordenada 0 (pegada al borde izquierdo)
			Indicador(100px) * seccion 2 (1)= coordenada 100 (pegada al final de la 1ra seccion)
			Indicador(100px) * seccion 3 (2)= coordenada 200 (pegada al final de la 2da seccion)
			Indicador(100px) * seccion 4 (3)= coordenada 300 (pegada al final de la 3ra seccion)
			Indicador(100px) * seccion 5 (4)= coordenada 400 (pegada al final de la 4ta seccion)

			Empieza desde 0 por que anteriormente ponemos todas las secciones en un arreglo, 
			y estos empiezan desde 0.
			*/
			indicador.style.transform = `translateX(${tamañoIndicador * indexSeccionActiva}px)`;
		}
	});
}, {
	/* para indicarle los margenes al observer
	-80px por el tema del NAV que ese es su tamaño */
	rootMargin: '-80px 0px 0px 0px',
	threshold: 0.2
	/*el threshold, ejecuta el codigo cuando toda la seccion este dentro de la parte visible(viewport) eso si
	se le pone 1.0... al tener el 0.2 decimos que cuando se vea el 20% del contenido observado, se ejecute. */
});

// Agregamos un observador para el hero.
observer.observe(document.getElementById('hero'));

// Asignamos un observador a cada una de las secciones
secciones.forEach(seccion => observer.observe(seccion));

// Evento para cuando la pantalla cambie de tamaño, asi ACTUALIZAMOS el INDICADOR.
const onResize = () => {
	// Calculamos el nuevo tamaño que deberia tener el indicador.
	tamañoIndicador = menu.querySelector('a').offsetWidth;

	// Cambiamos el tamaño del indicador.
	indicador.style.width = `${tamañoIndicador}px`;

	// Volvemos a posicionar el indicador.
	indicador.style.transform = `translateX(${tamañoIndicador * indexSeccionActiva}px)`;
}

/* cuando hay un cambio de tamaño llamamos a la funcion de arriba */
window.addEventListener('resize', onResize);