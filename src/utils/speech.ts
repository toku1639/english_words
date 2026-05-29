export function speakEnglish(text: string): void {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9

  const voices = window.speechSynthesis.getVoices()
  const enVoice =
    voices.find((v) => v.lang.startsWith('en-US') && !v.localService) ??
    voices.find((v) => v.lang.startsWith('en'))
  if (enVoice) utterance.voice = enVoice

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}
