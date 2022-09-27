
import * as THREE from 'three';
import css from './css/style.css';

import SceneBuilder from './scenes/first-scene.js';

import mouseController from './mouse-controller.js';

import extendScreenSize from './extend-screen-size.js';

export default class Main
{
  constructor()
  {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    
    // fixing the renderers canvas element to be fixed to keep the canvas from moving while scrolling
    this.renderer.domElement.style.position = `fixed`;

    // body element is being resized to allow for the scroll event to be triggered to all for the texture animation
    extendScreenSize();

    this.time = 0.0;

    this.mouseContoller = mouseController();

    this.geometry = new THREE.PlaneGeometry(1.5, 1.5);
    this.material = new THREE.ShaderMaterial( {

      uniforms: {
        scene1Texture: { value: null },
        scene2Texture: { value: null },
        scene3Texture: { value: null },
        time: { value: 0.0}
      },

      vertexShader: `

      varying vec2 vUv;

        void main(){

          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
        }
      `,

      fragmentShader: `
        uniform sampler2D scene1Texture;
        uniform sampler2D scene2Texture;
        uniform sampler2D scene3Texture;
        uniform float time;

        varying vec2 vUv;

        void main(){

          vec2 uv = vUv;

          vec4 scene1Tex = texture(scene1Texture, uv);
          vec4 scene2Tex = texture(scene2Texture, uv);
          vec4 scene3Tex = texture(scene3Texture, uv);                    

          vec4 mixTex1 = mix(scene1Tex, scene2Tex, abs(sin(time * 0.001)));
          vec4 mixTex2 = mix(scene2Tex, scene3Tex, time);

          vec4 finalMix = mix(mixTex1, mixTex2, sin(time));

          gl_FragColor = mixTex1;
        }

      `

     } );
    this.cube = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.cube );

    this.camera.position.z = 1;

    this.scene1 = SceneBuilder(new THREE.BoxGeometry(1, 1, 1));
    this.scene2 = SceneBuilder(new THREE.ConeGeometry(1, 2, 32));
    this.scene3 = SceneBuilder(new THREE.TorusGeometry(0.5, 0.1, 6, 100));

    this.animate = this.animate.bind(this);

    this.animate();
  }



  animate(){
    requestAnimationFrame( this.animate );

    this.time = performance.now();

    this.renderer.setRenderTarget(this.scene1.renderer);
    this.renderer.render(this.scene1.scene, this.scene1.camera);
    this.renderer.setRenderTarget(null);

    this.renderer.setRenderTarget(this.scene2.renderer);
    this.renderer.render(this.scene2.scene, this.scene2.camera);
    this.renderer.setRenderTarget(null);

    this.renderer.setRenderTarget(this.scene3.renderer);
    this.renderer.render(this.scene3.scene, this.scene3.camera);
    this.renderer.setRenderTarget(null);

    this.material.uniforms.scene1Texture.value = this.scene1.renderer.texture;
    this.material.uniforms.scene2Texture.value = this.scene2.renderer.texture;
    this.material.uniforms.scene3Texture.value = this.scene3.renderer.texture;

    this.material.uniforms.time.value = this.time;
    
    this.renderer.render( this.scene, this.camera );
  };

}

new Main();
