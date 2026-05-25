const AUDIO_STORAGE_KEY = "la-paz-wir-audio-settings";

const audioManifest = {
  music: {
    level1: "assets/audio/music/savia-andina-music.mp3",
    victory: "assets/audio/music/victory-baile-caliente-calamarka.mp3",
  },
  ambience: {
    city: "assets/audio/ambience/city-loop.wav",
  },
  sfx: {
    whip: ["assets/audio/sfx/whip.wav"],
    hit: ["assets/audio/sfx/hit-1.wav", "assets/audio/sfx/hit-2.wav"],
    enemyDefeat: ["assets/audio/sfx/enemy-defeat.wav"],
    playerHit: ["assets/audio/sfx/player-hit-1.wav"],
    pickup: ["assets/audio/sfx/pickup-food.wav"],
    waveStart: ["assets/audio/sfx/wave-start.wav"],
    explosionDynamite: ["assets/audio/sfx/explosion-dinamita.wav"],
    defeat: ["assets/audio/sfx/defeat.wav"],
  },
};

const defaultSettings = {
  masterVolume: 0.86,
  musicVolume: 0.24,
  ambienceVolume: 0.16,
  sfxVolume: 0.72,
  muted: false,
};

const sfxCooldowns = {
  whip: 0.11,
  hit: 0.045,
  enemyDefeat: 0.08,
  playerHit: 0.14,
  pickup: 0.12,
  waveStart: 0.7,
  explosionDynamite: 0.18,
  defeat: 0.7,
};

export function createAudioManager({ storage = window.localStorage } = {}) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const settings = readSettings(storage);
  const loadPromises = new Map();
  const buffers = new Map();
  const lastPlayed = new Map();

  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let ambienceGain = null;
  let sfxGain = null;
  let activeMusic = null;
  let activeAmbience = null;
  let unlocked = false;
  let preloadStarted = false;

  function ensureContext() {
    if (!AudioContextClass) return null;
    if (ctx) return ctx;

    ctx = new AudioContextClass();
    masterGain = ctx.createGain();
    musicGain = ctx.createGain();
    ambienceGain = ctx.createGain();
    sfxGain = ctx.createGain();

    musicGain.connect(masterGain);
    ambienceGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(ctx.destination);
    applySettings();

    return ctx;
  }

  async function unlock() {
    const audioContext = ensureContext();
    if (!audioContext) return false;
    if (audioContext.state === "suspended") await audioContext.resume();
    unlocked = true;
    preloadAll();
    return true;
  }

  function preloadAll() {
    if (preloadStarted) return;
    preloadStarted = true;
    allAudioEntries().forEach(([id, src]) => {
      loadBuffer(id, src).catch(() => {});
    });
  }

  function allAudioEntries() {
    const entries = [];
    Object.entries(audioManifest.music).forEach(([id, src]) => entries.push([`music:${id}`, src]));
    Object.entries(audioManifest.ambience).forEach(([id, src]) => entries.push([`ambience:${id}`, src]));
    Object.entries(audioManifest.sfx).forEach(([id, srcs]) => {
      srcs.forEach((src, index) => entries.push([`sfx:${id}:${index}`, src]));
    });
    return entries;
  }

  async function loadBuffer(id, src) {
    ensureContext();
    if (!ctx) return null;
    if (buffers.has(id)) return buffers.get(id);
    if (loadPromises.has(id)) return loadPromises.get(id);

    const promise = fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`Audio request failed: ${src}`);
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        buffers.set(id, buffer);
        return buffer;
      });
    loadPromises.set(id, promise);
    return promise;
  }

  async function playMusic(id, { loop = true, restart = false } = {}) {
    if (!unlocked) return;
    if (activeMusic?.id === id && !restart) return;
    stopMusic(0.35);

    const src = audioManifest.music[id];
    if (!src) return;
    const buffer = await loadBuffer(`music:${id}`, src).catch(() => null);
    if (!buffer || !ctx) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(musicGain);
    source.start();
    ramp(gain.gain, effectiveMusicVolume(), 0.45);
    activeMusic = { id, source, gain };
  }

  function stopMusic(fadeSeconds = 0.25) {
    if (!activeMusic || !ctx) return;
    const current = activeMusic;
    activeMusic = null;
    ramp(current.gain.gain, 0, fadeSeconds);
    window.setTimeout(() => {
      try {
        current.source.stop();
      } catch {}
      current.source.disconnect();
      current.gain.disconnect();
    }, Math.max(0, fadeSeconds * 1000 + 40));
  }

  async function playAmbience(id, { loop = true } = {}) {
    if (!unlocked) return;
    if (activeAmbience?.id === id) return;

    stopAmbience(0.35);
    const src = audioManifest.ambience[id];
    if (!src) return;
    const buffer = await loadBuffer(`ambience:${id}`, src).catch(() => null);
    if (!buffer || !ctx) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.value = 0;
    source.connect(gain);
    gain.connect(ambienceGain);
    source.start();
    ramp(gain.gain, effectiveAmbienceVolume(), 0.5);
    activeAmbience = { id, source, gain };
  }

  function stopAmbience(fadeSeconds = 0.25) {
    if (!activeAmbience || !ctx) return;
    const current = activeAmbience;
    activeAmbience = null;
    ramp(current.gain.gain, 0, fadeSeconds);
    window.setTimeout(() => {
      try {
        current.source.stop();
      } catch {}
      current.source.disconnect();
      current.gain.disconnect();
    }, Math.max(0, fadeSeconds * 1000 + 40));
  }

  async function playSfx(id, { volume = 1, playbackRate = 1 } = {}) {
    if (!unlocked || settings.muted || !ctx) return;
    const now = ctx.currentTime;
    const cooldown = sfxCooldowns[id] ?? 0.04;
    if (now - (lastPlayed.get(id) ?? -Infinity) < cooldown) return;
    lastPlayed.set(id, now);

    const variants = audioManifest.sfx[id];
    if (!variants?.length) return;
    const variantIndex = Math.floor(Math.random() * variants.length);
    const buffer = await loadBuffer(`sfx:${id}:${variantIndex}`, variants[variantIndex]).catch(() => null);
    if (!buffer || !ctx) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    gain.gain.value = Math.max(0, Math.min(1.4, volume));
    source.connect(gain);
    gain.connect(sfxGain);
    source.start();
    source.addEventListener("ended", () => {
      source.disconnect();
      gain.disconnect();
    }, { once: true });
  }

  function setMasterVolume(value) {
    settings.masterVolume = clamp01(value);
    applySettings();
    saveSettings(storage, settings);
  }

  function setMusicVolume(value) {
    settings.musicVolume = clamp01(value);
    applySettings();
    saveSettings(storage, settings);
  }

  function setSfxVolume(value) {
    settings.sfxVolume = clamp01(value);
    applySettings();
    saveSettings(storage, settings);
  }

  function setMuted(value) {
    settings.muted = Boolean(value);
    applySettings();
    saveSettings(storage, settings);
  }

  function applySettings() {
    if (!masterGain) return;
    masterGain.gain.value = settings.muted ? 0 : settings.masterVolume;
    musicGain.gain.value = settings.musicVolume;
    ambienceGain.gain.value = settings.ambienceVolume;
    sfxGain.gain.value = settings.sfxVolume;
  }

  function ramp(param, value, seconds) {
    if (!ctx) return;
    param.cancelScheduledValues(ctx.currentTime);
    param.setValueAtTime(param.value, ctx.currentTime);
    param.linearRampToValueAtTime(value, ctx.currentTime + seconds);
  }

  function effectiveMusicVolume() {
    return 1;
  }

  function effectiveAmbienceVolume() {
    return 1;
  }

  function getSettings() {
    return { ...settings };
  }

  function isSupported() {
    return Boolean(AudioContextClass);
  }

  return {
    unlock,
    preloadAll,
    playMusic,
    stopMusic,
    playAmbience,
    stopAmbience,
    playSfx,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    setMuted,
    getSettings,
    isSupported,
  };
}

function readSettings(storage) {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(storage.getItem(AUDIO_STORAGE_KEY) || "{}"),
    };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(storage, settings) {
  try {
    storage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}
