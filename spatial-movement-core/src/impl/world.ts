import { HasBounds, GSpatialMovementApiGen } from "../api";
import { InternalWorld, GInternalWorld, Direction } from "./types";
import { navigate } from "./navigate";

export const gbuilder = <T, I extends HasBounds<T>>(dict: I) => (): GSpatialMovementApiGen<T, I> => {
    // todo: use generic HasWorld & HasTarget
    const buildApi = (lastWorld: GInternalWorld<T, I>): GSpatialMovementApiGen<T, I> => ({
        add: addNode(lastWorld),
        remove: removeNode(lastWorld),
        focus: focus(lastWorld),
        left: movement(lastWorld)('w'),
        right: movement(lastWorld)('e'),
        up: movement(lastWorld)('n'),
        down: movement(lastWorld)('s'),
    })

    const addNode = (lastWorld: GInternalWorld<T, I>) => (node: T): GSpatialMovementApiGen<T, I> => {
        const nextWorld = lastWorld ? 
            Object.assign({}, lastWorld, {
                nodes: lastWorld.nodes.concat([node])
            }) : {
                nodes: [node],
                target: node
            }
        return buildApi(nextWorld)
    }
    const removeNode = (lastWorld: GInternalWorld<T, I>) => (node: T): GSpatialMovementApiGen<T, I> => {
        if(!lastWorld)
            return buildApi(lastWorld)
        if(lastWorld.nodes.length == 1)
            return buildApi(null)
        else {
            const nextWorld = Object.assign({}, lastWorld)
            if(node == lastWorld.target) {
                // todo: pick a better new target
                nextWorld.target = nextWorld.nodes[0]
            }
            nextWorld.nodes = nextWorld.nodes.filter(e => e != node)
            return buildApi(nextWorld)
        }
    }
    const focus = (lastWorld: GInternalWorld<T, I>) => (node: T): GSpatialMovementApiGen<T, I> => {
        if(!lastWorld)
            return buildApi(lastWorld)
        if(lastWorld.nodes.find(e => e == node))
            return buildApi(Object.assign({}, lastWorld, {target: node}))
        else
            return buildApi(lastWorld)
    }
    const movement = (lastWorld: GInternalWorld<T, I>) => (direction: Direction) => () => {
        if(!lastWorld)
            return null
        return navigate<T, I>(dict)(lastWorld.nodes.filter((e) => e != lastWorld.target), lastWorld.target, direction)
    }

    return buildApi(null)
}
