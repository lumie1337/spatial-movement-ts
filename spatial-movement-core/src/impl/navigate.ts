import { HasBounds, Bounds, Point2D } from "../api";
import { BoundsWithTarget, Direction } from "./types";

/**
 * Zips a node together with its bounds.
 */
const boundsWithTarget = <T, I extends HasBounds<T>>(dict: I) => (candidate: T): BoundsWithTarget<T> =>
    Object.assign(
        {},
        dict.boundsFor(candidate),
        {target: candidate}
    )

/**
 * Filters nodes that are not eligable for a particular directional move.
 */
const predDirection = <T>(targetBounds: BoundsWithTarget<T>, direction: Direction) => (candidate: BoundsWithTarget<T>): boolean => {
    switch (direction) {
        case 'w':
            return candidate.left < targetBounds.left
        case 'e':
            return candidate.right > targetBounds.right
        case 'n':
            return candidate.top < targetBounds.top
        case 's':
            return candidate.bottom > targetBounds.bottom
    }
}
const filterDirection = <T>(candidateBounds: BoundsWithTarget<T>[], targetBounds: BoundsWithTarget<T>, direction: Direction): BoundsWithTarget<T>[] =>
    candidateBounds.filter(predDirection(targetBounds, direction))

/**
 * Cardinal Directions
 */
type Orientation = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

/**
 * Determines the cardinal orientation of one node related to an origin.
 * Returns null if the nodes are overlapping.
 */
const orientationFor = (origin: Bounds, node: Bounds): Orientation | null => {
    if (node.right < origin.left) {  // left
        if (node.bottom < origin.top) { // top
            return 'nw'
        }
        else if (node.top > origin.bottom) { // bottom
            return 'sw'
        } else {
            return 'w'
        }
    } else if (node.left > origin.right) { // right
        if (node.bottom < origin.top) { // top
            return 'ne'
        }
        else if (node.top > origin.bottom) { // bottom
            return 'se'
        } else {
            return 'e'
        }
    } else { // center
        if (node.bottom < origin.top) { // top
            return 'n'
        }
        else if (node.top > origin.bottom) { // bottom
            return 's'
        } else {
            return null // overlapping
        }
    }
}

/**
 * calculates the straight line distance when nodes overlap on directions.
 */
const simpleDistance = (origin: Bounds, node: Bounds, orientation: Orientation): number => {
    switch (orientation) {
        case 'n':
            return node.bottom - origin.top
        case 'e':
            return node.left - origin.right
        case 's':
            return node.top - origin.bottom
        case 'w':
            return node.right - origin.left
    }
    return 0
}

/**
 * determines the center point of a bounded rectangle.
 */
const boundsCenter = (bounds: Bounds): Point2D => ({
    x: (bounds.right + bounds.left) / 2,
    y: (bounds.top + bounds.bottom) / 2
})

/**
 * calculates the distance between the center points of two bounded rectangles.
 */
const centerDistance = (origin: Bounds, node: Bounds): number => (
    euclideanDistance(boundsCenter(origin), boundsCenter(node))
    // todo verify algorithm
)

/**
 * calculates the distance between the edges of two rectangles.
 */
const edgeDistance = (origin: Bounds, node: Bounds, orientation: Orientation): number => {
    switch (orientation) {
        case 'nw':
            return euclideanDistance({ x: node.right, y: node.bottom }, {x: origin.left, y: origin.top})
        case 'ne':
            return euclideanDistance({ x: node.left, y: node.bottom }, {x: origin.right, y: origin.top})
        case 'se':
            return euclideanDistance({ x: node.left, y: node.top }, {x: origin.right, y: origin.bottom})
        case 'sw':
            return euclideanDistance({ x: node.right, y: node.top }, {x: origin.left, y: origin.bottom})
    }
    return 0;
}

const squared = (n: number): number => n * n
/**
 * calculates euclidian distance between two points.
 */
const euclideanDistance = (p1: Point2D, p2: Point2D): number => (
    Math.sqrt(squared(p2.x - p1.x) + squared(p2.y - p1.y))
)

/**
 * sorts the candidates by orientation first, then simple/edge distance and then center distance.
 */
const sortCandidates = <T>(candidates: BoundsWithTarget<T>[], target: BoundsWithTarget<T>, direction: Direction): BoundsWithTarget<T>[] => {
    const score = (a: Bounds): { priority: number, score: number, secondaryScore: number } => {
        const orientation = orientationFor(target, a)
        if (!orientation)
            throw new Error("Overlapping boxes not supported.")
        if (orientation == direction)
        {
            return {
                priority: 3, // higher is better
                score: simpleDistance(target, a, orientation),
                secondaryScore: centerDistance(target, a)
            }
        } else if (orientation.length == 2) {
            return {
                priority: 2,
                score: edgeDistance(target, a, orientation),
                secondaryScore: centerDistance(target, a)
            }
        } else {
            return {
                priority: 1,
                score: simpleDistance(target, a, orientation),
                secondaryScore: centerDistance(target, a)
            }
        }
    }
    return candidates.slice().sort((a: Bounds, b: Bounds) => {
        const sa = score(a)
        const sb = score(b)
        if (sa.priority == sb.priority) {
            if (sa.score == sb.score)
                return sb.secondaryScore - sa.secondaryScore
            else
                return sb.score - sa.score
        }
        else
            return sb.priority - sa.priority
    })
}

/**
 * Determines the element to navigate to for a particular direction.
 */
export const navigate = <T, I extends HasBounds<T>>(dict: I) => (candidates: T[], target: T, direction: Direction): Option<T> => {
    const candidatesWithBounds = candidates.map(boundsWithTarget<T, I>(dict))
    const targetWithBounds = boundsWithTarget<T, I>(dict)(target)
    const filteredCandidates = filterDirection(candidatesWithBounds, targetWithBounds, direction)
    if (filteredCandidates.length == 0)
        return null;
    const sortedCandidates = sortCandidates(filteredCandidates, targetWithBounds, direction)
    return sortedCandidates[0].target
}
