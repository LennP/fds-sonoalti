// useWindowWidth.ts
import { useEffect, useState } from "react";

const useWindowWidth = (): number => {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200, // Default to 1200 if window is undefined (e.g., during SSR)
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export default useWindowWidth;
