(() => {
  const synth = window.speechSynthesis;
  if (!synth || synth.__mathKidAiBridge) return;

  const nativeSpeak = synth.speak.bind(synth);
  const nativeCancel = synth.cancel.bind(synth);
  let currentAudio = null;
  let token = 0;
  let sdkPromise = null;

  function loadSDK() {
    if (window.puter?.ai?.txt2speech) return Promise.resolve(true);
    if (sdkPromise) return sdkPromise;

    sdkPromise = new Promise(resolve => {
      const existing = document.querySelector('script[data-math-kid-puter]');
      if (existing) {
        if (window.puter?.ai?.txt2speech) return resolve(true);
        existing.addEventListener('load', () => resolve(Boolean(window.puter?.ai?.txt2speech)), { once: true });
        existing.addEventListener('error', () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      script.dataset.mathKidPuter = '1';
      script.onload = () => resolve(Boolean(window.puter?.ai?.txt2speech));
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });

    return sdkPromise;
  }

  function stopAiAudio() {
    if (!currentAudio) return;
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }

  function cancel() {
    token += 1;
    stopAiAudio();
    try { nativeCancel(); } catch (_) {}
  }

  function nativeFallback(utterance) {
    try {
      nativeCancel();
      nativeSpeak(utterance);
    } catch (_) {}
  }

  async function speakWithAi(utterance) {
    const text = typeof utterance === 'string' ? utterance : utterance?.text;
    if (!text) return false;

    cancel();
    const myToken = token;
    const ready = await loadSDK();
    if (!ready || myToken !== token) {
      if (myToken === token && typeof utterance !== 'string') nativeFallback(utterance);
      return false;
    }

    try {
      // Same neural voice setup used by tic-tac-toe-simple-game for Quỳnh Anh.
      const audio = await window.puter.ai.txt2speech(text, {
        provider: 'xai',
        voice: 'eve'
      });

      if (myToken !== token) return false;
      currentAudio = audio;

      await new Promise(resolve => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          if (currentAudio === audio) currentAudio = null;
          resolve();
        };
        audio.onended = done;
        audio.onerror = done;
        const playPromise = audio.play();
        if (playPromise?.catch) {
          playPromise.catch(() => {
            done();
            if (myToken === token && typeof utterance !== 'string') nativeFallback(utterance);
          });
        }
      });
      return myToken === token;
    } catch (err) {
      console.warn('Math Kid AI voice unavailable; using browser Vietnamese voice.', err);
      if (myToken === token && typeof utterance !== 'string') nativeFallback(utterance);
      return false;
    }
  }

  try {
    synth.speak = utterance => { void speakWithAi(utterance); };
    synth.cancel = cancel;
    synth.__mathKidAiBridge = true;
  } catch (err) {
    console.warn('Unable to patch speechSynthesis; browser voice remains active.', err);
  }

  window.MathKidVoice = {
    speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      return speakWithAi(utterance);
    },
    cancel,
    ready: () => Boolean(window.puter?.ai?.txt2speech),
    preload: loadSDK
  };

  // Warm up the SDK so the first spoken instruction starts faster.
  loadSDK();
})();
