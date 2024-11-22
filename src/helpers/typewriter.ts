export const typewriter = (text: string, setText: (text: string) => void) => {
  let i = 0;
  const intervalId = setInterval(() => {
    setText(text.slice(0, i));
    i += Math.floor(Math.random() * 3) + 1;
    if (i > text.length) {
      clearInterval(intervalId);
    }
  }, 50);

  return intervalId;
};
