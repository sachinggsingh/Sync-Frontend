export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const simulateTyping = async (text, onUpdate, options = {}) => {
  const {
    minDelay = 50,
    maxDelay = 150,
    initialDelay = 500,
    endDelay = 1000,
  } = options;

  // Initial delay before starting
  await sleep(initialDelay);

  let currentText = '';

  for (let char of text) {
    // Random delay between characters
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await sleep(delay);

    // Add character
    currentText += char;
    onUpdate(currentText);
  }

  // Final delay after completion
  await sleep(endDelay);
  return currentText;
};

export const getRandomTypingDelay = () => ({
  minDelay: 30 + Math.random() * 20,
  maxDelay: 100 + Math.random() * 50,
  initialDelay: 300 + Math.random() * 200,
  endDelay: 500 + Math.random() * 500,
}); 