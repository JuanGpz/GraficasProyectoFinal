import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import {math} from './math.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';

export const world = (() => {
  //Indica la posición a partir de la cuál empiezan a aparecer los obstaculos.
  const START_POS = 100;

  //Indica la separación que hay entre obstaculos.
  const SEPARATION_DISTANCE = 10; 

  class WorldObject {
    constructor(params) {
      this.position = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
      this.scale = 1.0;
      this.collider = new THREE.Box3();
      this.params_ = params;
      this.LoadModel_();
    }

    LoadModel_() {
      const texLoader = new THREE.TextureLoader();
      const texture = texLoader.load('./resources/DesertPack/Blend/Textures/Grass.png');
      texture.encoding = THREE.sRGBEncoding;

      const loader = new FBXLoader();
      loader.setPath('./resources/Forest/FBX/');
      loader.load('Bush_2.fbx', (fbx) => {
        fbx.scale.setScalar(0.01);

        this.mesh = fbx;
        this.params_.scene.add(this.mesh);
      });
    }

    UpdateCollider_() {
      this.collider.setFromObject(this.mesh);
    }

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

  class WorldManager {
    constructor(params) {
      this.objects_ = [];
      this.unused_ = [];
      this.speed_ = 12;
      this.params_ = params;
      this.score_ = 0.0;
      this.scoreText_ = '00000';
      this.separationDistance_ = SEPARATION_DISTANCE;
    }

    GetColliders() {
      return this.objects_;
    }

    LastObjectPosition_() {
      if (this.objects_.length == 0) {
        return SEPARATION_DISTANCE;
      }

      return this.objects_[this.objects_.length - 1].position.x;
    }

    SpawnObj_(scale, offset) {
      let obj = null;

      if (this.unused_.length > 0) {
        obj = this.unused_.pop();
        obj.mesh.visible = true;
      } else {
        obj = new WorldObject(this.params_);
      }

      obj.quaternion.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2.0);
      obj.position.x = START_POS + offset;
      obj.scale = scale * 0.01;
      this.objects_.push(obj);
    }

    SpawnCluster_() {
      const scaleIndex = math.rand_int(0, 1);
      const scales = [1, 0.5];
      const ranges = [2, 3];
      const scale = scales[scaleIndex];
      const numObjects = math.rand_int(1, ranges[scaleIndex]);

      for (let i = 0; i < numObjects; ++i) {
        const offset = i * 1 * scale;
        this.SpawnObj_(scale, offset);
      }
    }

    MaybeSpawn_() {
      const closest = this.LastObjectPosition_();
      if (Math.abs(START_POS - closest) > this.separationDistance_) {
        this.SpawnCluster_();
        this.separationDistance_ = math.rand_range(SEPARATION_DISTANCE, SEPARATION_DISTANCE * 1.5);
      }
    }

    Update(timeElapsed) {
      this.MaybeSpawn_();
      this.UpdateColliders_(timeElapsed);
      this.UpdateScore_(timeElapsed);
    }

    UpdateScore_(timeElapsed) {
      this.score_ += timeElapsed * 10.0;
      const scoreText = Math.round(this.score_).toLocaleString(
          'en-US', {minimumIntegerDigits: 5, useGrouping: false});
      if (scoreText == this.scoreText_) {
        return;
      }
      document.getElementById('score-text').innerText = scoreText;
    }

    UpdateColliders_(timeElapsed) {
      const invisible = [];
      const visible = [];
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
      WorldManager: WorldManager,
  };

})();