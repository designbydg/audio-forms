let currentAudio: HTMLAudioElement | null = null;

export const cleanAudioUrl = (url: string): string => {
  return url
    .replace(/([^:])\/+/g, '$1/') // Remove duplicate slashes except after colon
    .replace(/:\/{3,}/g, '://') // Fix protocol separator
    .replace(/\/+$/g, ''); // Remove trailing slashes
};

export const playAudio = (audioUrl: string): Promise<void> => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  const audio = new Audio(audioUrl);
  currentAudio = audio;
  return audio.play();
};

export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

export const pauseAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
  }
};

export const isAudioPlaying = (): boolean => {
  return currentAudio !== null && !currentAudio.paused;
};