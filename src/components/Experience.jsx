import {Environment, OrbitControls} from "@react-three/drei";
import {Map} from "./Map"
import {useEffect, useState} from "react";
import {insertCoin, Joystick, myPlayer, onPlayerJoin} from "playroomkit";
import {CharacterController} from "./CharacterController.jsx";

export const Experience = () => {
    const [players, setPlayers] = useState([]);

    const start = async () => {
        // Show Playroom UI, let it handle players joining etc and wait for host to tap "Launch"
        await insertCoin({
            //  streamMode: true,
            // allowGamepads: true
        })

        // Create a joystick controller for each joining player
        onPlayerJoin((state) => {
            console.log('join')
            // Joystick will only create UI for current player (myPlayer)
            // For others, it will only sync their state
            const joystick = new Joystick(state, {
                type: "angular",
                buttons: [
                    {id: 'fire', label: 'Fire'},
                    {id: 'jump', label: 'Jump'}
                ]
            })
            const newPlayer = {state, joystick}
            state.setState('health', 100)
            state.setState('deaths', 0)
            state.setState('kills', 0)
            setPlayers((players) => [...players, newPlayer])
            state.onQuit(() => {
                setPlayers((players) => players.filter(player => player.state.id !== state.id))
            })
        })
    }





    useEffect(() => {
        start()
    }, [])


    return (
        <>
            <directionalLight
                position={[25, 18, -25]}
                intensity={0.3}
                castShadow
                shadow-camera-near={0}
                shadow-camera-far={80}
                shadow-camera-left={-30}
                shadow-camera-right={30}
                shadow-camera-top={25}
                shadow-camera-bottom={-25}
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-bias={-0.0001}
            />
            <OrbitControls/>
            <Map/>
            {

                players.map(({state, joystick}, index) => (
                    <CharacterController
                        key={state.id}
                        position-x={index * 2}
                        position-y={3}
                        state={state}
                        joystick={joystick}
                        userPlayer={state.id === myPlayer()?.id}
                    />
                ))
            }
            <Environment preset="sunset"/>
        </>
    );
};
