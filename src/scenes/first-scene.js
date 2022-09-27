

import * as THREE from 'three';

export default function SceneBuilder(geo){
    const scene = new THREE.Scene();
    const scene_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //const scene_camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 1000 );

    // setting camera above and to the right of the mesh to get a downward looking angle to the mesh
    scene_camera.position.y += 1.3;
    scene_camera.position.x += 1;

    scene.background = new THREE.Color(0x444444);

    scene_camera.position.z = 2;

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geo, material);

    scene.add(mesh);

    // point camera towards mesh
    scene_camera.lookAt(mesh.position);

    const renderer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
    });

    return{
     scene: scene,
     camera: scene_camera,
     mesh: mesh,
     renderer: renderer   
    }

}