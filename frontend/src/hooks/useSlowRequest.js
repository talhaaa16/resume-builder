import { useEffect, useState } from "react";

// Returns true once `loading` has stayed true for `delayMs`. Used to tell users
// the server is waking up (free-tier hosting sleeps when idle).
export function useSlowRequest(loading, delayMs = 4000) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), delayMs);
    return () => clearTimeout(timer);
  }, [loading, delayMs]);

  return isSlow;
}
