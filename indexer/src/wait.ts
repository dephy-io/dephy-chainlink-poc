export const wait = (t: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, t);
  });

export const waitAndReject = (t: number) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timed out!")), t);
  });
