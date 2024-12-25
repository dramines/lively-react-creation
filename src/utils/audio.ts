export const playTickSound = () => {
  const audio = new Audio('addedcart.mp3');
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.log('Audio playback failed:', error);
  });
};