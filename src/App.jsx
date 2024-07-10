import {Loader, PerformanceMonitor, SoftShadows} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import {Suspense} from "react";
import {Experience} from "./components/Experience";
import {Bloom, EffectComposer} from "@react-three/postprocessing";
import {Leaderboard} from "./components/Leaderboard.jsx";

function App() {
    return (
        <>
            <Loader/>
            <Leaderboard/>
            <Canvas shadows camera={{position: [0, 30, 0], fov: 30, near: 2}}>
                <color attach="background" args={["#242424"]}/>
                <SoftShadows size={42}/>
                <Suspense>
                    <Physics>
                        <Experience/>
                    </Physics>
                </Suspense>
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur/>
                </EffectComposer>
            </Canvas>
        </>
    );
}

export default App;
