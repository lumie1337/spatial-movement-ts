import { HasBounds } from "./api";

// instance HasBounds HtmlElement
export const HasBoundsHtmlElement: HasBounds<HTMLElement> = {
    boundsFor: (instance: HTMLElement) => instance.getBoundingClientRect()
}