export const memoSelector = (factory) => {
  let selector;
  return () => {
    if (!selector) selector = factory();
    return selector;
  };
};
