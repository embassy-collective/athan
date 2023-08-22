export const playAthan = async (volume = 0.4) => {
  console.log('Play notification');
  try {
    const file = 'audio/nod.mp3';
    const audio = new Audio(file);
    audio.volume = volume;

    await audio?.play();
  } catch (err) {
    console.error('Failed to play notification sound:', err);
  }
};
