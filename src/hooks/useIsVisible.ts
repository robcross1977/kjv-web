import { MutableRefObject, RefObject, useEffect, useState } from "react";

/**
 * The useIsVisible hook returns a boolean indicating whether the referenced element is currently visible or not.
 *
 * Example Usage:
 * export function MyComponent() {
 *   const ref = useRef();
 *   const isVisible = useIsVisible(ref);
 *
 *   return (
 *     <div ref={ref}>
 *       <p>{isVisible ? "Visible" : "Not visible"}</p>
 *     </div>
 *   );
 * }
 *
 * @param ref A reference to the element to observe for visibility
 * @returns A boolean indiciating whether the element is visible or not
 */

export function useIsVisible(ref: MutableRefObject<any>) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
}
