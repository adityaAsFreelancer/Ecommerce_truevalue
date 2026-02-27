import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

// --- 3D Spinner Scene using native Three.js geometries ---
function SpinnerMesh() {
    const outerRef = useRef();
    const innerRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        outerRef.current.rotation.x = t * 1.4;
        outerRef.current.rotation.y = t * 0.9;
        innerRef.current.rotation.x = -t * 1.0;
        innerRef.current.rotation.z = t * 1.2;
    });

    return (
        <>
            {/* Outer green torus */}
            <mesh ref={outerRef}>
                <torusGeometry args={[1, 0.28, 32, 100]} />
                <meshStandardMaterial color="#5EC401" roughness={0.1} metalness={0.6} />
            </mesh>

            {/* Inner dark torus */}
            <mesh ref={innerRef}>
                <torusGeometry args={[0.56, 0.16, 32, 100]} />
                <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Lighting */}
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[-3, -3, 3]} intensity={0.8} color="#5EC401" />
        </>
    );
}

/**
 * Full-page center spinner — 3D Three.js double torus rings
 * Usage: <PageSpinner message="Loading..." />
 */
export const PageSpinner = ({ message = 'Loading...' }) => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ width: 130, height: 130 }}
        >
            <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
            >
                <SpinnerMesh />
            </Canvas>
        </motion.div>
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 font-bold text-sm uppercase tracking-widest"
        >
            {message}
        </motion.p>
    </div>
);

/**
 * Reusable table skeleton loader — animated placeholder rows
 * Usage: <TableSkeleton rows={5} cols={6} />
 */
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
    <>
        {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
                {Array.from({ length: cols }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                        <div
                            className="h-8 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse"
                            style={{ animationDelay: `${(i + j) * 60}ms` }}
                        />
                    </td>
                ))}
            </tr>
        ))}
    </>
);

/**
 * Card Skeleton — for grid/card-based loading
 * Usage: <CardSkeleton count={6} />
 */
export const CardSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-48 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
                <div className="p-4 space-y-3">
                    <div className="h-4 rounded-lg bg-gray-100 animate-pulse w-3/4" />
                    <div className="h-3 rounded-lg bg-gray-100 animate-pulse w-1/2" />
                    <div className="h-8 rounded-xl bg-gray-100 animate-pulse" />
                </div>
            </div>
        ))}
    </div>
);

/**
 * Inline mini spinner for buttons / input states
 * Usage: <MiniSpinner />
 */
export const MiniSpinner = ({ size = 18, color = 'currentColor' }) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-block' }}
    >
        <circle
            cx="12" cy="12" r="10"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            strokeDashoffset="0"
        />
    </motion.svg>
);

export default PageSpinner;
