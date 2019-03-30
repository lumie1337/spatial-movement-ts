import { GWorldOps, GSpatialMovementApi } from "./api";
import { HasBoundsHtmlElement } from "./instances";
import { gbuilder } from "./impl/world";

export interface SpatialMovementApi extends GSpatialMovementApi<Element, typeof HasBoundsHtmlElement, SpatialMovementApi> {}

export const SpatialMovementManager: () => SpatialMovementApi = gbuilder(HasBoundsHtmlElement)
