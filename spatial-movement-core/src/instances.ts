import { HasBounds } from "./api";

// instance HasBounds HtmlElement
export const HasBoundsHtmlElement: HasBounds<Element> = {
    boundsFor: (instance: Element) => instance.getBoundingClientRect()
}