import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 400 }) => {
    const mesh = useRef();
    const light = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 10 + Math.random() * 50;
            const speed = 0.0002 + Math.random() / 5000;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.getElapsedTime();

        // Optimized loop - using manual for loop for maximum performance
        for (let i = 0; i < count; i++) {
            const p = particles[i];
            p.t += p.speed;
            const { t, factor, xFactor, yFactor, zFactor } = p;

            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t) * 0.5 + 0.5;

            p.mx += (state.mouse.x * 2 - p.mx) * 0.01;
            p.my += (state.mouse.y * 2 - p.my) * 0.01;

            dummy.position.set(
                (p.mx) * a + xFactor + Math.cos((t / 10) * factor),
                (p.my) * b + yFactor + Math.sin((t / 10) * factor),
                zFactor + Math.cos((t / 10) * factor)
            );

            dummy.rotation.set(time * (i / count), time * (i / count), 0);
            dummy.scale.set(s * 0.5, s * 0.5, s * 0.5); // Slightly larger particles
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        }
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={light} distance={150} intensity={0.5} color="#c5a059" />
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                    color="#8a6d3b"
                    emissive="#c5a059"
                    emissiveIntensity={0.05}
                    roughness={0}
                    metalness={1}
                    transparent
                    opacity={0.3}
                />
            </instancedMesh>
        </>
    );
};

export default function Scene() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#020617] pointer-events-none overflow-hidden">
            <Canvas
                camera={{ fov: 75, position: [0, 0, 50] }}
                dpr={1} // Force locked DPR for performance
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
            >
                <fog attach="fog" args={['#020617', 40, 100]} />
                <ambientLight intensity={0.4} />
                <spotLight position={[20, 20, 20]} angle={0.2} penumbra={1} intensity={1} color="#ffffff" />
                <Particles />
            </Canvas>
        </div>
    );
}
