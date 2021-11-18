import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const player = (() => {

  // Constructor de la clase de jugador con los parametros de posición, velocidad inicial, caja para collider, 
  // modelo a cargar e input a usar para controlarlo.
  class Player {
    constructor(params) {
      this.position_ = new THREE.Vector3(0, 0, 0);
      this.velocity_ = 0.0;
      this.playerBox_ = new THREE.Box3();
      this.params_ = params;
      this.LoadModel_();
      this.InitInput_();
    }

    // Función para cargar el modelo del personaje
    LoadModel_() {

      // Cargamos nuestro modelo de rana en formato FBX en la escena y ajustamos su escala
      const loader = new FBXLoader();
      loader.setPath('./resources/Frog/FBX/');
      loader.load('Frog.fbx', (fbx) => {
        fbx.scale.setScalar(0.0025);
        fbx.quaternion.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), Math.PI / 2);
        this.mesh_ = fbx;
        this.params_.scene.add(this.mesh_);

        // Cargamos y ciclamos la animación que ya estaba en el archivo FBX para simular el movimiento de la rana.
        const m = new THREE.AnimationMixer(fbx);
        this.mixer_ = m;
        if (fbx.animations[0]) {
          const clip = fbx.animations[0];
          const action = this.mixer_.clipAction(clip);
          action.play();
        }
      });
    }

    // Función para determinar el control del personaje
    InitInput_() {
      // Se elije la tecla a usar para controlar a la rana
      this.keys_ = {
        spacebar: false,
      };
      this.oldKeys = { ...this.keys_ };

      // Se agregan listeners para detectar cuando se presiona la tecla
      document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
    }

    // Switch para realizar un evento cuando se presiona la tecla
    OnKeyDown_(event) {
      switch (event.keyCode) {
        case 32:
          this.keys_.space = true;
          break;
      }
    }

    // Switch para realizar un evento cuando se deja de presionar la tecla
    OnKeyUp_(event) {
      switch (event.keyCode) {
        case 32:
          this.keys_.space = false;
          break;
      }
    }

    // Función para revisar colisiones entre el jugador y los obstaculos
    CheckCollisions_() {
      // Usamos la función GetColliders en world.js para regresar los objetos a evaluar como parametros para CheckCollisions
      const colliders = this.params_.world.GetColliders();
      // Usamos los colliders del mesh de nuestro personaje
      this.playerBox_.setFromObject(this.mesh_);
      // Comparamos los colliders del personaje con los colliders de los obstaculos
      for (let c of colliders) {
        const cur = c.collider;
        // Si los colliders del jugador y de algun obstaculo se intersectan se despliega la pantalla de derrota
        if (cur.intersectsBox(this.playerBox_)) {
          this.gameOver = true;
        }
      }
    }

    // Función de update para el jugador
    Update(timeElapsed) {
      // Una vez que se presiona espacio para iniciar el juego se le da al jugador una velocidad para que comienze a moverse
      if (this.keys_.space && this.position_.y == 0.0) {
        // Variable para controlar la velocidad del personaje
        this.velocity_ = 35;
      }
      const acceleration = -75 * timeElapsed;
      this.position_.y += timeElapsed * (
        this.velocity_ + acceleration * 0.5);
      this.position_.y = Math.max(this.position_.y, 0.0);
      this.velocity_ += acceleration;
      this.velocity_ = Math.max(this.velocity_, -100);
      if (this.mesh_) {
        this.mixer_.update(timeElapsed);
        this.mesh_.position.copy(this.position_);
        this.CheckCollisions_();
      }
    }
  };

  return {
    Player: Player,
  };
})();