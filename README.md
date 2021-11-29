# GraficasProyectoFinal

- Propuesta #3: Juego "jumper sidescroller"

Consiste de un juego en el que un personaje (un animal por ejemplo) aparenta estar corriendo y la pantalla se recorre hacia un lado y van emergiendo obstaculos y recompensas (si es que se escoge un animal como personaje podria ser comida para el animal) que determinan el puntuaje final.

•	Abstracto del Juego

Haremos un juego con gráficas 3D del género endless runner con elementos de side-scroller, es decir, un juego en el que el usuario controla un personaje que corre a lo largo de un mapa que se recorre infinitamente y únicamente se detiene cuando pierde. 

•	Jugabilidad

- El usuario será capaz de controlar únicamente el salto del personaje, todo lo demás será automático. 
- El personaje del usuario se moverá continuamente corriendo en dirección hacia la derecha, aunque la cámara se quedará estática, esto resultará en que el personaje siempre estará en la misma sección de la pantalla, aunque esté en constante movimiento; de igual manera veremos cómo se recorre el mapa a pesar de que la cámara no se mueve.
- Una sesión inicia cuando se carga la página y se acaba cuando se cierra o refresca.
- Cuando se inicia el juego se desplegará un mensaje de "Press (imagen de la barra espaciadora) to Start" y comenzará hasta que el usuario presione su barra espaciadora.
- Si se llega perder se desplegará un mensaje de "Game Over", la puntuación de esa corrida, la mayor puntuación de la sesión y un símbolo para reiniciar el juego.
- Para reiniciar el juego después de perder el usuario deberá presionar su barra espaciadora de nuevo.

•	Mecánicas

- El usuario puede controlar los 3 movimientos de la rana; estos son moverse hacía la izquierda (con la flecha izquierda del teclado), moverse hacía la derecha (con la flecha derecha del teclado) y saltar (con la barra espaciadora del teclado). 
- El ratón no tendrá ninguna funcionalidad dentro del juego. 
- El objetivo del juego es lograr el mayor puntaje posible evadiendo obstáculos que aparezcan en pantalla, estos pueden ser rocas, árboles o arbustos. 
- El puntaje se acumulará con una tasa de 1 punto por cada 0.5 segundos que el usuario permanezca corriendo sin perder y perderá únicamente cuando la rana colisione con algún obstáculo. 
- El usuario podrá obtener puntos extra colisionando con mariposas dentro del juego, obteniendo 20 puntos adicionales.

•	Mapa

- La vista dentro del juego será isométrica. 
- El mapa consiste de tres carriles (central, derecho e izquierdo) en los que se generan automáticamente obstáculos y recompensas, el mapa siempre estará en movimiento y el jugador debe evitar colisiones con obstáculos y provocarlas con las mariposas. 

•	Referencias

Usamos el tutorial de Basic World Demo en el siguiente repositorio: https://github.com/simondevyoutube/ThreeJS_Tutorial_BasicWorld
