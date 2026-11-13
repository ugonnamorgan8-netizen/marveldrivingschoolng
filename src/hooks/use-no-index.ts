import { useEffect } from "react";

/** Adds <meta name="robots" content="noindex, nofollow"> while the component is mounted. */
export const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);
};
