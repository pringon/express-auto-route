class HttpError extends Error {
  constructor(public status: string | number, name: string) {
    super(name);
  }
}

export default HttpError;
