import { GWorldOps, GSpatialMovementApi } from "./api";
import { HasBoundsHtmlElement } from "./instances";
import { gbuilder } from "./impl/world";

export interface SpatialMovementApi extends GSpatialMovementApi<Element, typeof HasBoundsHtmlElement, SpatialMovementApi> {}

const builder: () => SpatialMovementApi = gbuilder(HasBoundsHtmlElement)

export default builder