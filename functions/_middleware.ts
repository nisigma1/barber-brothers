type MiddlewareContext = {
  next: () => Promise<Response>;
};
export const onRequest = async ({ next }: MiddlewareContext) => {
  return next();
};
