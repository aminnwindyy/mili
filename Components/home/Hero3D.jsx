import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Hero3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Create buildings
    const buildings = [];
    for (let i = 0; i < 15; i++) {
      const height = Math.random() * 3 + 1;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, height, 0.8),
        new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6),
          transparent: true,
          opacity: 0.8
        })
      );
      
      building.position.x = (Math.random() - 0.5) * 15;
      building.position.z = (Math.random() - 0.5) * 15;
      building.position.y = height / 2;
      
      buildings.push(building);
      scene.add(building);
    }

    // Create tokens
    const tokens = [];
    const tokenGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
    
    for (let i = 0; i < 10; i++) {
      const token = new THREE.Mesh(
        tokenGeometry,
        new THREE.MeshLambertMaterial({
          color: 0xFFD700,
          transparent: true,
          opacity: 0.9
        })
      );
      
      token.position.x = (Math.random() - 0.5) * 20;
      token.position.y = Math.random() * 8 + 3;
      token.position.z = (Math.random() - 0.5) * 20;
      
      tokens.push(token);
      scene.add(token);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Camera position
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      buildings.forEach((building, i) => {
        building.rotation.y += 0.005 * (i % 2 === 0 ? 1 : -1);
        building.position.y = Math.sin(Date.now() * 0.001 + i) * 0.2 + building.geometry.parameters.height / 2;
      });
      
      tokens.forEach((token, i) => {
        token.rotation.y += 0.02;
        token.position.y += Math.sin(Date.now() * 0.002 + i) * 0.01;
      });
      
      const time = Date.now() * 0.0005;
      camera.position.x = Math.sin(time) * 2;
      camera.position.z = 15 + Math.cos(time) * 2;
      camera.lookAt(0, 2, 0);
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      
      buildings.forEach(building => {
        building.geometry.dispose();
        building.material.dispose();
      });
      
      tokens.forEach(token => {
        token.geometry.dispose();
        token.material.dispose();
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[500px] flex items-center justify-center"
      style={{ minHeight: '500px' }}
    />
  );
}