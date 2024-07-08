import {useRef, useState} from "react";
import {CharacterSoldier} from "./CharacterSoldier.jsx";
import {CapsuleCollider, RigidBody, vec3} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {isHost} from "playroomkit";
import {CameraControls} from "@react-three/drei";

const MOVEMENT_SPEED = 200

export const CharacterController = ({
                                        state,
                                        joystick,
                                        userPlayer,
                                        ...props
                                    }) => {
    const group = useRef()
    const character = useRef()
    const rigidbody = useRef()
    const controls = useRef()
    const [animation, setAnimation] = useState('Idle')

    useFrame((_, delta) => {

        // CAMERA FOLLOW
        if (controls.current) {
            const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20
            const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16
            const playerWorldPos = vec3(rigidbody.current.translation())
            controls.current.setLookAt(
                playerWorldPos.x,
                playerWorldPos.y + (state.state.dead ? 12 : cameraDistanceY),
                playerWorldPos.z + (state.state.dead ? 2 : cameraDistanceZ),
                playerWorldPos.x,
                playerWorldPos.y + 1.5,
                playerWorldPos.z,
                true
            )
        }

        // Update player position based on joystick state
        const angle = joystick.angle()
        if (joystick.isJoystickPressed() && angle) {
            setAnimation('Run')
            character.current.rotation.y = angle

            // move character in its own direction
            const impulse = {
                x: Math.sin(angle) * MOVEMENT_SPEED * delta,
                y: 0,
                z: Math.cos(angle) * MOVEMENT_SPEED * delta
            }

            rigidbody.current.applyImpulse(impulse, true)
        } else {
            setAnimation('Idle')
        }
        if (isHost()) {
            state.setState("pos", rigidbody.current.translation())
        } else {
            const pos = state.getState('pos')
        }
    })

    return (
        <group ref={group} {...props}>
            {
                userPlayer && (<CameraControls ref={controls}/>)
            }
            <RigidBody
                ref={rigidbody}
                colliders={false}
                linearDamping={12}
                lockRotations
                type={isHost() ? 'dynamic' : 'kinematicPosition'}
            >
                <group ref={character}>
                    <CharacterSoldier
                        color={state.state.profile?.color}
                        animation={animation}
                    />
                </group>
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]}/>
            </RigidBody>
        </group>
    )
}