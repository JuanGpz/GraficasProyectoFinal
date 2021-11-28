import * as THREE from './three.module.js';

import {math} from './math.js';

import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const background = (() => {

  // Clase de nube con constructor que designa su posición, rotación, escala y carga el modelo
  class BackgroundCloud {
    constructor(params) {
      this.params_ = params;
      this.position_ = new THREE.Vector3();
      this.quaternion_ = new THREE.Quaternion();
      this.scale_ = 1.0;
      this.mesh_ = null;

      this.LoadModel_();
    }

    // Loader para el modelo de nube que elige uno de los tres modelos al azar asi como su escala
    LoadModel_() {
      const loader = new GLTFLoader();
      loader.setPath('./resources/Clouds/GLTF/');
      loader.load('Cloud' + math.rand_int(1, 3) + '.glb', (glb) => {
        this.mesh_ = glb.scene;
        this.params_.scene.add(this.mesh_);

        this.position_.x = math.rand_range(0, 2000);
        this.position_.y = math.rand_range(100, 200);
        this.position_.z = math.rand_range(500, -1000);
        this.scale_ = math.rand_range(10, 20);

        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), math.rand_range(0, 360));
        this.quaternion_.copy(q);
      });
    }

    // Clase de update para mover las nubes en dirección horizontal
    Update(timeElapsed) {
      if (!this.mesh_) {
        return;
      }

      // Movimiento de las nubes
      this.position_.x -= timeElapsed * 10;
      if (this.position_.x < -100) {
        this.position_.x = math.rand_range(2000, 3000);
      }

      this.mesh_.position.copy(this.position_);
      this.mesh_.quaternion.copy(this.quaternion_);
      this.mesh_.scale.setScalar(this.scale_);
    }
  };

  // Constructor de la clase de background que tiene un conjunto de nubes
  class Background {
    constructor(params) {
      this.params_ = params;
      this.clouds_ = [];

      this.SpawnClouds_();
    }

    // Crea las nubes en el background siempre y cuando haya menos de 25
    SpawnClouds_() {
      for (let i = 0; i < 25; ++i) {
        const cloud = new BackgroundCloud(this.params_);

        this.clouds_.push(cloud);
      }
    }

    // Función de update para las nubes
    Update(timeElapsed) {
      for (let c of this.clouds_) {
        c.Update(timeElapsed);
      }
    }
  }

  return {
      Background: Background,
  };
})();