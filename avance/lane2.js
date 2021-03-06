import * as THREE from './three.module.js';
import {math} from './math.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

// Define la variable a exportar
export const lane2 = (() => {{}
  
  //Indica la posición a partir de la cuál empiezan a aparecer los obstaculos.
  const START_POS = 90;
  
  //Indica la separación que hay entre obstaculos.
  const SEPARATION_DISTANCE = 15;

  // Constructor de la clase del mundo o mapa del juego, creando posición, rotación, escala y caja de colisión
  class WorldObject {
    constructor(params) {
      this.position = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
      this.scale = 1.0;
      this.collider = new THREE.Box3();
      this.params_ = params;
      this.LoadModel_();
    }
    
    // Se cargan los modelos que usara el mapa
    LoadModel_() {
      const texLoader = new THREE.TextureLoader();
      const texture = texLoader.load('./resources/Forest/Textures/Grass.png');
      texture.encoding = THREE.sRGBEncoding;
      const loader = new FBXLoader();
      loader.setPath('./resources/Forest/FBX/');


      // Se carga el modelo de arbusto #2
      loader.load('Bush_2.fbx', (fbx) => {
        fbx.scale.setScalar(0.01);
        this.mesh = fbx;
        this.params_.scene.add(this.mesh);
        fbx.traverse(c => {
          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }
          for (let m of materials) {
            if (m) {
              if (texture) {
                m.map = texture;
              }
              m.specular = new THREE.Color(0x000000);
            }
          }
        });
      });
    }

    // Se le agregan colliders al mesh
    UpdateCollider_() {
      this.collider.setFromObject(this.mesh);
    }

    // Función de update para refrescar constamente los parametros de los meshes
    Update(timeElapsed) {
      if (!this.mesh) {
        return;
      }
      this.mesh.position.copy(this.position);
      this.mesh.quaternion.copy(this.quaternion);
      this.mesh.scale.setScalar(this.scale);
      this.UpdateCollider_();
    }
  }

  class Lane2 {
    // Constructor de la clase de la linea 1
    constructor(params) {
      this.objects_ = [];
      this.unused_ = [];
      this.speed_ = 12;
      this.params_ = params;
      this.separationDistance_ = SEPARATION_DISTANCE;
    }

    // Usamos la función GetColliders para regresar los colliders de un objeto
    GetColliders() {
      return this.objects_;
    }

    // Función para determinar la posición del ultimo objeto y saber cuando crear uno nuevo
    LastObjectPosition_() {
      if (this.objects_.length == 0) {
        return SEPARATION_DISTANCE;
      }
      return this.objects_[this.objects_.length - 1].position.x;
    }

    // Función para eliminar los objetos que ya no se usarán y crear nuevos en el mapa
    SpawnObj_(scale, offset) {
      let obj = null;

      // Dtermina cuando se crea el nuevo objeto
      if (this.unused_.length > 0) {
        obj = this.unused_.pop();
        obj.mesh.visible = true;
      } else {
        obj = new WorldObject(this.params_);
      }

      // Determina la posición del nuevo objeto
      obj.quaternion.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2.0);
      obj.position.x = START_POS + offset;
      obj.position.z = 0;
      obj.scale = scale * 0.01;
      this.objects_.push(obj);
    }

    // Función que crea clusters de 2 a 3 objetos
    SpawnCluster_() {
      // Pueden tener distintas escalas
      const scaleIndex = math.rand_int(0, 1);
      const scales = [1, 0.5];
      const ranges = [2, 3];
      const scale = scales[scaleIndex];
      const numObjects = math.rand_int(1, ranges[scaleIndex]);

      // Se usa la función de Spawn en loop para generar todos los objetos
      for (let i = 0; i < numObjects; ++i) {
        const offset = i * 1 * scale;
        this.SpawnObj_(scale, offset);
      }
    }

    // Función que crea obstaculos con distancias de separación aleatorias.
    MaybeSpawn_() {
      const closest = this.LastObjectPosition_();
      if (Math.abs(START_POS - closest) > this.separationDistance_) {
        this.SpawnCluster_();
        this.separationDistance_ = math.rand_range((SEPARATION_DISTANCE - 5), SEPARATION_DISTANCE * 1.5);
      }
    }

    // Función de update para las funciones que crean objetos
    Update(timeElapsed) {
      this.MaybeSpawn_();
      this.UpdateColliders_(timeElapsed);
    }

    // Función que actualiza los colliders de los objetos en la vista
    UpdateColliders_(timeElapsed) {
      const invisible = [];
      const visible = [];

      // Los objetos fuera de vista se hacen invisibles mientras las que están en la vista son visibles.
      for (let obj of this.objects_) {
        obj.position.x -= timeElapsed * this.speed_;
        if (obj.position.x < -20) {
          invisible.push(obj);
          obj.mesh.visible = false;
        } else {
          visible.push(obj);
        }
        obj.Update(timeElapsed);
      }
      this.objects_ = visible;
      this.unused_.push(...invisible);
    }
  };

  return {
      Lane2: Lane2,
  };
})();