import * as THREE from './three.module.js';

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
      this.JumpInput_();
      this.RightInput_();
      this.LeftInput_();
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
    JumpInput_() {
      // Se elije la tecla a usar para controlar a la rana
      this.keys_ = {
        spacebar: false,
      };
      this.oldKeys = { ...this.keys_ };

      // Se agregan listeners para detectar cuando se presiona la tecla
      document.addEventListener('keydown', (e) => this.JumpKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.JumpKeyUp_(e), false);
    }

    RightInput_() {
      // Se elije la tecla a usar para controlar a la rana
      this.keys_ = {
        ArrowRight : false,
      };
      this.oldKeys = { ...this.keys_ };

      // Se agregan listeners para detectar cuando se presiona la tecla
      document.addEventListener('keydown', (e) => this.RightKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.RightKeyUp_(e), false);
    }

    LeftInput_() {
      // Se elije la tecla a usar para controlar a la rana
      this.keys_ = {
        ArrowLeft: false,
      };
      this.oldKeys = { ...this.keys_ };

      // Se agregan listeners para detectar cuando se presiona la tecla
      document.addEventListener('keydown', (e) => this.LeftKeyDown_(e), false);
      document.addEventListener('keyup', (e) => this.LeftKeyUp_(e), false);
    }

    // Switch para realizar un evento cuando se presiona la tecla
    JumpKeyDown_(event) {
      switch (event.keyCode) {
        case 32:
          this.keys_.space = true;
          break;
      }
    }

    // Switch para realizar un evento cuando se deja de presionar la tecla
    JumpKeyUp_(event) {
      switch (event.keyCode) {
        case 32:
          this.keys_.space = false;
          break;
      }
    }

    RightKeyDown_(event) {
      switch (event.keyCode) {
        case 39:
          this.keys_.ArrowRight = true;
          break;
      }
    }

    // Switch para realizar un evento cuando se deja de presionar la tecla
    RightKeyUp_(event) {
      switch (event.keyCode) {
        case 39:
          this.keys_.ArrowRight = false;
          break;
      }
    }

    LeftKeyDown_(event) {
      switch (event.keyCode) {
        case 37:
          this.keys_.ArrowLeft = true;
          break;
      }
    }

    // Switch para realizar un evento cuando se deja de presionar la tecla
    LeftKeyUp_(event) {
      switch (event.keyCode) {
        case 37:
          this.keys_.ArrowLeft = false;
          break;
      }
    }

    // Función para revisar colisiones entre el jugador y los obstaculos
    CheckCollisions1_() {

      // Usamos la función GetColliders en world.js para regresar los objetos a evaluar como parametros para CheckCollisions
      const colliders1 = this.params_.lane1.GetColliders();

      // Usamos los colliders del mesh de nuestro personaje
      this.playerBox_.setFromObject(this.mesh_);

      // Comparamos los colliders del personaje con los colliders de los obstaculos
      for (let c of colliders1) {
        const cur = c.collider;
        
        // Si los colliders del jugador y de algun obstaculo se intersectan se despliega la pantalla de derrota
        if (cur.intersectsBox(this.playerBox_)) {
          this.gameOver = true;
        }
      }
    }

    CheckCollisions2_() {

      // Usamos la función GetColliders en world.js para regresar los objetos a evaluar como parametros para CheckCollisions
      const colliders2 = this.params_.lane2.GetColliders();

      // Usamos los colliders del mesh de nuestro personaje
      this.playerBox_.setFromObject(this.mesh_);

      // Comparamos los colliders del personaje con los colliders de los obstaculos
      for (let c of colliders2) {
        const cur = c.collider;
        
        // Si los colliders del jugador y de algun obstaculo se intersectan se despliega la pantalla de derrota
        if (cur.intersectsBox(this.playerBox_)) {
          this.gameOver = true;
        }
      }
    }

    CheckCollisions3_() {

      // Usamos la función GetColliders en world.js para regresar los objetos a evaluar como parametros para CheckCollisions
      const colliders3 = this.params_.lane3.GetColliders();

      // Usamos los colliders del mesh de nuestro personaje
      this.playerBox_.setFromObject(this.mesh_);

      // Comparamos los colliders del personaje con los colliders de los obstaculos
      for (let c of colliders3) {
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
      if (this.keys_.space && this.position_.y == 0) {
        // Variable para controlar la velocidad del personaje
        this.velocity_ = 30;
      }
      // Variable que controla la aceleración del personaje
      const acceleration = -75 * timeElapsed;
      
      // Modificamos la posición en Y para que el personaje simule un salto
      this.position_.y += timeElapsed * (this.velocity_ + acceleration * 0.5);
      this.position_.y = Math.max(this.position_.y, 0.0);
      this.velocity_ += acceleration;
      this.velocity_ = Math.max(this.velocity_, -100);
      
      // Una vez que se presiona espacio para iniciar el juego se le da al jugador una velocidad para que comienze a moverse
      if (this.keys_.ArrowRight) {
        // Variable para controlar la velocidad del personaje
        if (this.position_.z < 5) {
          this.position_.z += 5;
          this.keys_.ArrowRight = false
        }
        // this.position_.z = 5;
      }

      if (this.keys_.ArrowLeft == true) {
        // Variable para controlar la velocidad del personaje
        if (this.position_.z > -5) {
          this.position_.z -= 5;
          this.keys_.ArrowLeft = false
        }
      }
      
      // // Modificamos la posición en Y para que el personaje simule un salto
      // this.position_.z = 7
      // this.velocity_ + acceleration * 0.5
      // //this.position_.z = Math.max(this.position_.y, 0.0);
      // this.velocity_ += acceleration;
      // this.velocity_ = Math.max(this.velocity_, -100);

      // Ciclo para mover continuamente al personaje mientras no colisione
      if (this.mesh_) {
        this.mixer_.update(timeElapsed);
        this.mesh_.position.copy(this.position_);
        this.CheckCollisions1_();
        this.CheckCollisions2_();
        this.CheckCollisions3_();

      }
    }
  };

  return {
    Player: Player,
  };
})();