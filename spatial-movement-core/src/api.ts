import { Option } from "./lib/option";

/**
 * A 2-dimensional point.
 */
export type Point2D = {
    x: number,
    y: number
}

/**
 * Bounds for a Rectangular area.
 */
export type Bounds = {
    left: number,
    right: number,
    top: number,
    bottom: number
}

/**
 * Any type for which we know how to get its rectangular bounds.
 * 
 * ```
 * class HasBounds a where
 *   boundsFor :: a -> Bounds
 * ```
 */
export type HasBounds<T> = {
    boundsFor: (instance: T) => Bounds
}

/**
 * Any type for which we know how to add and remove nodes with constraint HasBounds.
 */
export type GDWorldOps<T, I extends HasBounds<T>, R extends GWorldOps<T, I, R>> = (dict: I) => ({
    add: (node: T) => R,
    remove: (node: T) => R
})
export type GWorldOps<T, I extends HasBounds<T>, R extends GWorldOps<T, I, R>> = ReturnType<GDWorldOps<T, I, R>>


/**
 * Any type for which we know how to set a focus node with constraint HasBounds.
 */
export type GDWorldFocusOps<T, I extends HasBounds<T>, R extends GWorldFocusOps<T, I, R>> = (dict: I) => ({
    focus: (node: T) => R
})
export type GWorldFocusOps<T, I extends HasBounds<T>, R extends GWorldFocusOps<T, I, R>> = ReturnType<GDWorldFocusOps<T, I, R>>

/**
 * Any type for which we know how to find directional movement nodes.
 */
export type GDWorldMovementOps<T, I extends HasBounds<T>, R extends GWorldMovementOps<T, I, R>> = (dict: I) => ({
    up: () => Option<T>,
    down: () => Option<T>,
    left: () => Option<T>,
    right: () => Option<T>,
})
export type GWorldMovementOps<T, I extends HasBounds<T>, R extends GWorldMovementOps<T, I, R>> = ReturnType<GDWorldMovementOps<T, I, R>>

export interface GSpatialMovementApiGen<T, I extends HasBounds<T>> extends
    GWorldOps<T, I, GSpatialMovementApiGen<T, I>>,
    GWorldFocusOps<T, I, GSpatialMovementApiGen<T, I>>,
    GWorldMovementOps<T, I, GSpatialMovementApiGen<T, I>> {}

export interface GSpatialMovementApi<T, I extends HasBounds<T>, R extends GSpatialMovementApi<T, I, R>> extends
    GWorldOps<T, I, R>,
    GWorldFocusOps<T, I, R>,
    GWorldMovementOps<T, I, R> {}