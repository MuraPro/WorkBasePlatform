import { useEffect, useState } from 'react';

function useAutoRerender(interval = 60000) {
  const [, forceUpdate] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      forceUpdate(Date.now());
    }, interval);

    return () => clearInterval(id);
  }, [interval]);
}

export default useAutoRerender;
