import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface ClaimMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  status: 'verified' | 'review' | 'gap';
}

const claimMarkers: ClaimMarker[] = [
  { id: '1', lat: 1.3521, lng: 103.8198, label: 'Singapore Facility', status: 'verified' },
  { id: '2', lat: -23.5505, lng: -46.6333, label: 'São Paulo Forest', status: 'gap' },
  { id: '3', lat: 52.52, lng: 13.405, label: 'Berlin Operations', status: 'review' },
  { id: '4', lat: 35.6762, lng: 139.6503, label: 'Tokyo Plant', status: 'verified' },
  { id: '5', lat: -33.8688, lng: 151.2093, label: 'Sydney Hub', status: 'review' },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

const getStatusColor = (status: ClaimMarker['status']) => {
  switch (status) {
    case 'verified': return '#22c55e';
    case 'review': return '#f59e0b';
    case 'gap': return '#ef4444';
  }
};

function ClaimPoint({ marker, onClick, isSelected }: { marker: ClaimMarker; onClick: () => void; isSelected: boolean }) {
  const position = useMemo(() => latLngToVector3(marker.lat, marker.lng, 2.05), [marker.lat, marker.lng]);
  const color = getStatusColor(marker.status);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.setScalar(isSelected ? scale * 1.5 : scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Glow ring */}
      <mesh>
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {isSelected && (
        <Html distanceFactor={8} position={[0, 0.15, 0]}>
          <div className="glass-panel px-3 py-1.5 text-xs whitespace-nowrap">
            <span className="text-foreground font-medium">{marker.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function Earth({ selectedClaim, onClaimSelect }: { selectedClaim: string | null; onClaimSelect: (id: string) => void }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  // Create realistic night-side Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Deep ocean base - dark blue-black
    const oceanGradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
    oceanGradient.addColorStop(0, '#0a1525');
    oceanGradient.addColorStop(0.5, '#071018');
    oceanGradient.addColorStop(1, '#030810');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Continent shapes (simplified realistic positions)
    const continents = [
      // North America
      { x: 180, y: 120, w: 180, h: 120, points: [[0,60],[40,20],[100,10],[150,30],[180,80],[160,120],[80,110],[20,90]] },
      // South America
      { x: 240, y: 240, w: 80, h: 150, points: [[20,0],[60,20],[80,80],[60,140],[20,150],[0,100],[10,40]] },
      // Europe
      { x: 480, y: 100, w: 100, h: 80, points: [[0,40],[30,10],[80,20],[100,50],[80,80],[40,70],[10,60]] },
      // Africa
      { x: 480, y: 180, w: 120, h: 160, points: [[40,0],[100,30],[120,100],[80,160],[20,140],[0,80],[20,20]] },
      // Asia
      { x: 560, y: 80, w: 250, h: 180, points: [[0,80],[50,20],[150,10],[250,60],[230,140],[150,180],[50,160],[20,120]] },
      // Australia
      { x: 780, y: 300, w: 100, h: 80, points: [[20,0],[80,10],[100,50],[70,80],[10,70],[0,30]] },
    ];
    
    // Draw continents with subtle land texture
    continents.forEach(cont => {
      ctx.save();
      ctx.translate(cont.x, cont.y);
      
      // Land gradient
      const landGradient = ctx.createLinearGradient(0, 0, cont.w, cont.h);
      landGradient.addColorStop(0, '#0f1f2e');
      landGradient.addColorStop(0.5, '#152535');
      landGradient.addColorStop(1, '#0d1a28');
      ctx.fillStyle = landGradient;
      
      ctx.beginPath();
      if (cont.points.length > 0) {
        ctx.moveTo(cont.points[0][0], cont.points[0][1]);
        for (let i = 1; i < cont.points.length; i++) {
          ctx.lineTo(cont.points[i][0], cont.points[i][1]);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    
    // City light clusters - realistic population centers
    const cityLights = [
      // North America
      { x: 230, y: 140, intensity: 0.9 }, // New York
      { x: 170, y: 145, intensity: 0.8 }, // Chicago
      { x: 140, y: 160, intensity: 0.85 }, // Los Angeles
      { x: 280, y: 120, intensity: 0.6 }, // Toronto
      { x: 200, y: 210, intensity: 0.7 }, // Mexico City
      // Europe
      { x: 495, y: 130, intensity: 0.9 }, // London
      { x: 510, y: 125, intensity: 0.85 }, // Paris
      { x: 530, y: 120, intensity: 0.8 }, // Berlin
      { x: 520, y: 145, intensity: 0.7 }, // Rome
      { x: 550, y: 110, intensity: 0.75 }, // Moscow
      // Asia
      { x: 700, y: 140, intensity: 0.95 }, // Beijing
      { x: 720, y: 160, intensity: 0.9 }, // Shanghai
      { x: 760, y: 140, intensity: 0.95 }, // Tokyo
      { x: 680, y: 195, intensity: 0.85 }, // Mumbai
      { x: 710, y: 180, intensity: 0.8 }, // Bangkok
      { x: 740, y: 210, intensity: 0.9 }, // Singapore
      // South America
      { x: 280, y: 340, intensity: 0.85 }, // São Paulo
      { x: 270, y: 310, intensity: 0.7 }, // Rio
      { x: 260, y: 380, intensity: 0.6 }, // Buenos Aires
      // Africa
      { x: 520, y: 280, intensity: 0.65 }, // Lagos
      { x: 540, y: 320, intensity: 0.6 }, // Johannesburg
      { x: 560, y: 230, intensity: 0.5 }, // Cairo
      // Australia
      { x: 850, y: 360, intensity: 0.75 }, // Sydney
      { x: 830, y: 350, intensity: 0.65 }, // Melbourne
    ];
    
    // Draw city lights with glow
    cityLights.forEach(city => {
      // Main glow
      const glowSize = 15 + city.intensity * 20;
      const gradient = ctx.createRadialGradient(city.x, city.y, 0, city.x, city.y, glowSize);
      gradient.addColorStop(0, `rgba(255, 200, 120, ${city.intensity * 0.8})`);
      gradient.addColorStop(0.3, `rgba(255, 180, 80, ${city.intensity * 0.4})`);
      gradient.addColorStop(0.6, `rgba(255, 150, 50, ${city.intensity * 0.15})`);
      gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(city.x, city.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Scattered smaller lights around major cities
      for (let i = 0; i < 8 + city.intensity * 15; i++) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 30;
        const size = Math.random() * 1.5 + 0.5;
        const alpha = Math.random() * 0.5 + 0.3;
        
        ctx.fillStyle = `rgba(255, 220, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(city.x + offsetX, city.y + offsetY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Add some random coastal lights
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const size = Math.random() * 1 + 0.3;
      const alpha = Math.random() * 0.3 + 0.1;
      
      ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Cloud layer texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 512, 256);
    
    // Wispy clouds
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const size = Math.random() * 60 + 20;
      const alpha = Math.random() * 0.08 + 0.02;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (earthRef.current && !selectedClaim) {
      earthRef.current.rotation.y += 0.0008;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <group>
      {/* Outer atmosphere - subtle blue glow */}
      <mesh>
        <sphereGeometry args={[2.25, 64, 64]} />
        <meshBasicMaterial 
          color="#4a9eff" 
          transparent 
          opacity={0.03} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Atmosphere glow - cyan tint */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.12, 64, 64]} />
        <meshBasicMaterial 
          color="#22d3ee" 
          transparent 
          opacity={0.06} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.04, 64, 64]} />
        <meshBasicMaterial 
          map={cloudTexture}
          transparent 
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.9}
          metalness={0.1}
          emissive="#ff9944"
          emissiveIntensity={0.02}
          emissiveMap={earthTexture}
        />
      </mesh>
      
      {/* Claim markers */}
      {claimMarkers.map((marker) => (
        <ClaimPoint
          key={marker.id}
          marker={marker}
          onClick={() => onClaimSelect(marker.id)}
          isSelected={selectedClaim === marker.id}
        />
      ))}
    </group>
  );
}

export const Globe = ({ onClaimSelect, selectedClaim }: { onClaimSelect: (id: string) => void; selectedClaim: string | null }) => {
  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        
        <Earth selectedClaim={selectedClaim} onClaimSelect={onClaimSelect} />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          autoRotate={!selectedClaim}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </motion.div>
  );
};

export { claimMarkers };
export type { ClaimMarker };
