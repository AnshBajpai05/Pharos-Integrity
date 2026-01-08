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
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  // Create earth texture procedurally
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Dark base
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, 512, 256);
    
    // Simplified continents
    ctx.fillStyle = '#1a2d4a';
    // Add random landmass shapes
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 40 + 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // City lights
    ctx.fillStyle = '#22d3ee';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const size = Math.random() * 2 + 0.5;
      ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (earthRef.current && !selectedClaim) {
      earthRef.current.rotation.y += 0.001;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial 
          color="#22d3ee" 
          transparent 
          opacity={0.08} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.8}
          metalness={0.2}
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
