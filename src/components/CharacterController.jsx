import {useRef, useState} from "react";
import {CharacterSoldier} from "./CharacterSoldier.jsx";
import {CapsuleCollider, RigidBody} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";

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
    const [animation, setAnimation] = useState('Idle')

    useFrame((_, delta) => {
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
    })

    return (
        <group ref={group} {...props}>
            <RigidBody ref={rigidbody} colliders={false} linearDamping={12} lockRotations>
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