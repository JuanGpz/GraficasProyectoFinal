import * as THREE from './three.module.js';

import {player} from './player.js';
import {lane1} from './lane1.js';
import {lane2} from './lane2.js';
import {lane3} from './lane3.js';
import {background} from './background.js';

// VertexShader a usar para renderizar 
const _VS = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

// Fragment Shader a usar para renderizar
const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

// Clase para crear el mundo del juego
class CreateWorld_ {
  constructor() {
    this._Initialize();
    // El juego no se inicia hasta dar un click en la pantalla inicial
    this._gameStarted = false;
    document.getElementById('game-menu').onclick = (msg) => this._OnStart(msg);
  }

  // Función para cambiar el estado de inicio del juego
  _OnStart(msg) {
    document.getElementById('game-menu').style.display = 'none';
    // Cambia la bandera para iniciar el juego
    this._gameStarted = true;
  }

  // Función que inicializa la cámara, la luz, la escena y agrega los elementos a la escena
  _Initialize() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.threejs_.outputEncoding = THREE.sRGBEncoding;
    this.threejs_.gammaFactor = 2.2;
    this.threejs_.setPixelRatio(window.devicePixelRatio);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('container').appendChild(this.threejs_.domElement);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 20000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(-5, 5, 10);
    this.camera_.lookAt(8, 3, 0);

    // Se crea la escena
    this.scene_ = new THREE.Scene();

    // Controles de la luz
    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(60, 100, 10);
    light.target.position.set(40, 0, 0);

    this.scene_.add(light);
    light = new THREE.HemisphereLight(0x202020, 0x004080, 0.6);

    // Se agrega la luz a la escena
    this.scene_.add(light);

    // Color de fondo de la escena
    this.scene_.background = new THREE.Color(0x808080);

    // Se define la geometría y material de la tierra
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20000, 20000, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x136935,
          }));
    ground.rotation.x = -Math.PI / 2;
    this.scene_.add(ground);
    
    // Se definen los colores 
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077FF) },
      bottomColor: { value: new THREE.Color(0x89b2eb) },
      offset: { value: 33 },
      exponent: { value: 0.6 }
    };

    // Define la geometría y material del cielo
    const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VS,
        fragmentShader: _FS,
        side: THREE.BackSide,
    });
    this.scene_.add(new THREE.Mesh(skyGeo, skyMat));

    // Agrega los carriles, al jugador y la clase de nubes a la escena
    this.lane1_ = new lane1.Lane1({scene: this.scene_});
    this.lane2_ = new lane2.Lane2({scene: this.scene_});
    this.lane3_ = new lane3.Lane3({scene: this.scene_});
    this.player_ = new player.Player({scene: this.scene_, lane1: this.lane1_, lane2: this.lane2_, lane3: this.lane3_});
    this.background_ = new background.Background({scene: this.scene_});

    this.gameOver_ = false;
    this.previousRAF_ = null;
    this.RAF_();
  }

  // Función de request animation frame para mostrar los distintos cuadros de una animación
  RAF_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }
      this.RAF_();
      this.Update_((t - this.previousRAF_) / 1000.0);
      this.threejs_.render(this.scene_, this.camera_);
      this.previousRAF_ = t;
    });
  }

  // Función de update que actualiza las lineas, el personaje y el fondo
  Update_(timeElapsed) {
    if (this.gameOver_ || !this._gameStarted) {
      return;
    }

    this.player_.Update(timeElapsed);
    this.lane1_.Update(timeElapsed);
    this.lane2_.Update(timeElapsed);
    this.lane3_.Update(timeElapsed);
    this.background_.Update(timeElapsed);

    // Detiene el update si se pierde
    if (this.player_.gameOver && !this.gameOver_) {
      this.gameOver_ = true;
      document.getElementById('game-over').classList.toggle('active');
    }
  }
}

// Carga el juego cuando se carga la ventana
window.addEventListener('DOMContentLoaded', () => {
 _APP = new CreateWorld_();
});