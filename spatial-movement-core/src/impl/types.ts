import { HasBounds, Bounds } from "../api";
import { HasBoundsHtmlElement } from "../instances";

// generic types
type GHasWorld<T, IN, I extends HasBounds<T>> = (dict: I) => ({
    worldFor: (instance: IN) => T[]
})
type GHasTarget<T, IN, I extends HasBounds<T>> = (dict: HasBounds<T>) => ({
    targetFor: (instance: IN) => T | null
})

// concrete instances for InternalWorld
export type GDInternalWorld<T, I extends HasBounds<T>> = (dict: I) => (null | {
    nodes: T[],
    target: T
})
export type GInternalWorld<T, I extends HasBounds<T>> = ReturnType<GDInternalWorld<T, I>>
export type InternalWorld = GInternalWorld<Element, typeof HasBoundsHtmlElement>

export type HasWorld<T> = ReturnType<GHasWorld<Element, T, typeof HasBoundsHtmlElement>>
export const HasWorldInternalWorld: HasWorld<InternalWorld> = {
    worldFor: (instance: InternalWorld) => instance ? instance.nodes : []
}

export type HasTarget<T> = ReturnType<GHasTarget<Element, T, typeof HasBoundsHtmlElement>>
export const HasTargetInternalWorld: HasTarget<InternalWorld> = {
    targetFor: (instance: InternalWorld) => instance ? instance.target : null
}

export type WithTarget<T> = {
    target: T
}
export type Direction = 'w' | 'e' | 's' | 'n'
export type BoundsWithTarget<T> = Bounds & WithTarget<T>