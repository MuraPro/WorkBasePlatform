import { createContext, useContext } from 'react';

export const PageLoaderContext = createContext(null);

export const usePageLoading = () => {
  const ctx = useContext(PageLoaderContext);
  if (!ctx) {
    return {
      pageLoading: false,
      setPageLoading: () => {},
    };
  }
  return ctx;
};
