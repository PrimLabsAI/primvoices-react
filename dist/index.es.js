var kt = Object.defineProperty;
var Et = (s, t, i) => t in s ? kt(s, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : s[t] = i;
var m = (s, t, i) => (Et(s, typeof t != "symbol" ? t + "" : t, i), i);
import Xe, { createContext as Rt, useContext as At, useRef as J, useState as Q, useEffect as z, useCallback as ue } from "react";
let we;
const Lt = new Uint8Array(16);
function _t() {
  if (!we && (we = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !we))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return we(Lt);
}
const j = [];
for (let s = 0; s < 256; ++s)
  j.push((s + 256).toString(16).slice(1));
function Pt(s, t = 0) {
  return j[s[t + 0]] + j[s[t + 1]] + j[s[t + 2]] + j[s[t + 3]] + "-" + j[s[t + 4]] + j[s[t + 5]] + "-" + j[s[t + 6]] + j[s[t + 7]] + "-" + j[s[t + 8]] + j[s[t + 9]] + "-" + j[s[t + 10]] + j[s[t + 11]] + j[s[t + 12]] + j[s[t + 13]] + j[s[t + 14]] + j[s[t + 15]];
}
const Tt = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), He = {
  randomUUID: Tt
};
function Qe(s, t, i) {
  if (He.randomUUID && !t && !s)
    return He.randomUUID();
  s = s || {};
  const r = s.random || (s.rng || _t)();
  if (r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, t) {
    i = i || 0;
    for (let a = 0; a < 16; ++a)
      t[i + a] = r[a];
    return t;
  }
  return Pt(r);
}
const jt = 132, Je = 32635, Ot = [
  0,
  0,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7
];
function Dt(s) {
  let t, i, r, a;
  return t = s >> 8 & 128, t != 0 && (s = -s), s = s + jt, s > Je && (s = Je), i = Ot[s >> 7 & 255], r = s >> i + 3 & 15, a = ~(t | i << 4 | r), a;
}
function It(s) {
  let t = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++)
    t[i] = Dt(s[i]);
  return t;
}
class Wt {
  constructor() {
    m(this, "LOG_LEVELS", {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3
    });
    m(this, "DEFAULT_LOG_LEVEL", this.LOG_LEVELS.INFO);
    m(this, "logLevel", this.DEFAULT_LOG_LEVEL);
  }
  setLogLevel(t) {
    this.logLevel = this.LOG_LEVELS[t];
  }
  debug(t, ...i) {
    this.logLevel <= this.LOG_LEVELS.DEBUG && console.debug(t, ...i);
  }
  info(t, ...i) {
    this.logLevel <= this.LOG_LEVELS.INFO && console.info(t, ...i);
  }
  warn(t, ...i) {
    this.logLevel <= this.LOG_LEVELS.WARN && console.warn(t, ...i);
  }
  error(t, ...i) {
    this.logLevel <= this.LOG_LEVELS.ERROR && console.error(t, ...i);
  }
}
const ve = new Wt();
class Ft {
  constructor(t) {
    m(this, "socket", null);
    m(this, "audioContext", null);
    m(this, "mediaStream", null);
    m(this, "microphoneSource", null);
    m(this, "audioWorklet", null);
    m(this, "analyser", null);
    m(this, "audioQueue", []);
    m(this, "currentAudioSource", null);
    m(this, "workletInitialized", !1);
    m(this, "isListening", !1);
    m(this, "isConnected", !1);
    m(this, "isPlaying", !1);
    m(this, "callSid", "");
    m(this, "streamSid", "");
    m(this, "config");
    m(this, "speechDetected", !1);
    m(this, "statsInterval", null);
    // Callbacks
    m(this, "onConnectionOpen", null);
    m(this, "onConnectionClose", null);
    m(this, "onConnectionError", null);
    m(this, "onStartListening", null);
    m(this, "onStopListening", null);
    m(this, "onAgentMessage", null);
    m(this, "onPlayStart", null);
    m(this, "onPlayStop", null);
    m(this, "onAudioStats", null);
    this.config = {
      serverUrl: "wss://tts.primvoices.com/ws",
      debug: !1,
      ...t
    }, ve.setLogLevel(this.config.debug ? "DEBUG" : "INFO"), this.initAudioContext();
  }
  /**
   * Set callbacks for different events
   */
  setCallbacks({
    onOpen: t,
    onClose: i,
    onError: r,
    onMessage: a,
    onListeningStart: p,
    onListeningStop: w,
    onAudioStart: c,
    onAudioStop: h,
    onAudioStats: A
  }) {
    this.onConnectionOpen = t || null, this.onConnectionClose = i || null, this.onConnectionError = r || null, this.onAgentMessage = a || null, this.onStartListening = p || null, this.onStopListening = w || null, this.onPlayStart = c || null, this.onPlayStop = h || null, this.onAudioStats = A || null;
  }
  /**
   * Initialize the WebSocket connection
   */
  async connect() {
    if (this.callSid = Qe(), this.streamSid = Qe(), this.socket && this.socket.close(), !this.config.serverUrl)
      throw new Error("Server URL is required");
    return this.socket = new WebSocket(this.config.serverUrl), ve.debug(`[WebSocketClient] Connecting to ${this.config.serverUrl}`), ve.debug(`[WebSocketClient] Session IDs: call=${this.callSid}, stream=${this.streamSid}`), new Promise((t, i) => {
      if (!this.socket) {
        i(new Error("WebSocket not initialized"));
        return;
      }
      this.socket.onopen = () => {
        var a;
        this.isConnected = !0;
        const r = {
          start: {
            streamSid: this.streamSid,
            callSid: this.callSid,
            customParameters: {
              inputType: "mic",
              agentId: this.config.agentId || "default",
              versionStatus: this.config.versionStatus || "staged"
            }
          }
        };
        (a = this.socket) == null || a.send(JSON.stringify(r)), ve.debug("[WebSocketClient] Connection established"), ve.debug("[WebSocketClient] Sent start message:", r), this.onConnectionOpen && (this.onConnectionOpen(), t());
      }, this.socket.onclose = () => {
        this.isConnected = !1, this.config.debug && console.log("[WebSocketClient] Connection closed"), this.onConnectionClose && this.onConnectionClose(), this.stopListening();
      }, this.socket.onerror = (r) => {
        this.config.debug && console.error("[WebSocketClient] WebSocket error:", r), this.onConnectionError && this.onConnectionError();
      }, this.socket.onmessage = (r) => {
        try {
          const a = JSON.parse(r.data);
          a.event === "media" ? this.handleAudioMessage(a) : a.event === "clear" ? this.handleClearMessage(a) : a.event === "transcript" && this.onAgentMessage && a.text && this.onAgentMessage(a.text);
        } catch (a) {
          this.config.debug && console.error("[WebSocketClient] Error parsing message:", a);
        }
      };
    });
  }
  /**
   * Handle audio data received from the server
   */
  handleAudioMessage(t) {
    if (!t.media || !t.media.payload)
      return;
    const i = t.media.payload, r = atob(i), a = new Uint8Array(r.length);
    for (let c = 0; c < r.length; c++)
      a[c] = r.charCodeAt(c);
    let p;
    if (a.length % 2 !== 0) {
      const c = new ArrayBuffer(a.length + a.length % 2);
      new Uint8Array(c).set(a), p = new Int16Array(c);
    } else {
      const c = new ArrayBuffer(a.length);
      new Uint8Array(c).set(a), p = new Int16Array(c);
    }
    const w = new Float32Array(p.length);
    for (let c = 0; c < p.length; c++)
      w[c] = p[c] / 32768;
    this.addToAudioQueue(w, 24e3);
  }
  handleClearMessage(t) {
    this.config.debug && console.log("[WebSocketClient] Received clear message:", t), this.clearAudioQueue();
  }
  /**
   * Initialize the audio context and related components
   */
  async initAudioContext() {
    try {
      if (this.audioContext = new (window.AudioContext || window.webkitAudioContext)(), this.analyser = this.audioContext.createAnalyser(), this.analyser.fftSize = 256, this.audioContext.audioWorklet && !this.workletInitialized) {
        const t = `
          class AudioProcessor extends AudioWorkletProcessor {
            constructor() {
              super();
              this.port.onmessage = this.handleMessage.bind(this);
            }
          
            handleMessage(event) {
              if (event.data.command === 'stop') {
                // Handle stop command if needed
              }
            }
          
            process(inputs, outputs, parameters) {
              // Get input data from the microphone
              const input = inputs[0];
              if (input.length > 0 && input[0].length > 0) {
                const audioData = input[0];
                
                // Send audio data to the main thread
                this.port.postMessage({
                  audioData: audioData
                });
              }
              
              // Return true to keep the processor alive
              return true;
            }
          }
          
          registerProcessor('audio-processor', AudioProcessor);
        `, i = new Blob([t], { type: "application/javascript" }), r = URL.createObjectURL(i);
        await this.audioContext.audioWorklet.addModule(r), URL.revokeObjectURL(r), this.workletInitialized = !0, this.config.debug && console.log("[WebSocketClient] Audio worklet initialized");
      }
    } catch (t) {
      this.config.debug && console.error("[WebSocketClient] Error initializing audio context:", t);
    }
  }
  /**
   * Start capturing audio from the microphone and sending it to the server
   */
  async startListening() {
    var t;
    if (!(this.isListening || !this.isConnected))
      try {
        if (((t = this.audioContext) == null ? void 0 : t.state) === "suspended" && await this.audioContext.resume(), this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: !0,
          video: !1
        }), !this.audioContext)
          throw new Error("Audio context not initialized");
        if (this.microphoneSource = this.audioContext.createMediaStreamSource(this.mediaStream), this.workletInitialized)
          this.audioWorklet = new AudioWorkletNode(this.audioContext, "audio-processor"), this.microphoneSource.connect(this.audioWorklet), this.analyser && this.microphoneSource.connect(this.analyser), this.audioWorklet.port.onmessage = (i) => {
            i.data.audioData && this.isListening && this.processAudioData(i.data.audioData);
          };
        else {
          this.config.debug && console.log("[WebSocketClient] Using ScriptProcessorNode fallback");
          const i = 4096, r = this.audioContext.createScriptProcessor(i, 1, 1);
          this.microphoneSource.connect(r), r.connect(this.audioContext.destination), this.analyser && this.microphoneSource.connect(this.analyser), r.onaudioprocess = (a) => {
            if (this.isListening) {
              const p = a.inputBuffer.getChannelData(0);
              this.processAudioData(p);
            }
          };
        }
        this.isListening = !0, this.startAudioStatsMonitoring(), this.onStartListening && this.onStartListening(), this.config.debug && console.log("[WebSocketClient] Started listening");
      } catch (i) {
        this.config.debug && console.error("[WebSocketClient] Error starting microphone:", i), this.isListening = !1;
      }
  }
  /**
   * Stop capturing audio from the microphone
   */
  stopListening() {
    this.isListening && (this.mediaStream && (this.mediaStream.getTracks().forEach((t) => t.stop()), this.mediaStream = null), this.microphoneSource && (this.microphoneSource.disconnect(), this.microphoneSource = null), this.audioWorklet && (this.audioWorklet.disconnect(), this.audioWorklet = null), this.isListening = !1, this.stopAudioStatsMonitoring(), this.onStopListening && this.onStopListening(), this.config.debug && console.log("[WebSocketClient] Stopped listening"));
  }
  /**
   * Send a text message to the server
   */
  sendText(t) {
    !this.socket || this.socket.readyState !== WebSocket.OPEN || this.socket.send(JSON.stringify({ event: "text", text: t }));
  }
  /**
   * Close the WebSocket connection and clean up resources
   */
  disconnect() {
    this.stopListening(), this.clearAudioQueue(), this.stopAudioStatsMonitoring(), this.socket && (this.socket.close(), this.socket = null), this.isConnected = !1, this.onConnectionClose && this.onConnectionClose();
  }
  /**
   * Process captured audio data and send it to the server
   */
  processAudioData(t) {
    var i;
    if (!(!this.socket || this.socket.readyState !== WebSocket.OPEN))
      try {
        const r = ((i = this.audioContext) == null ? void 0 : i.sampleRate) || 48e3, a = 16e3;
        if (this.config.debug) {
          const A = t.some((k) => Math.abs(k) > 0.01);
          console.log(`[WebSocketClient] Processing audio frame: ${t.length} samples at ${r}Hz ${A ? "(has sound)" : "(silent)"}`);
        }
        const p = this.downsampleBuffer(t, r, a);
        this.config.debug && console.log(`[WebSocketClient] Downsampled to ${p.length} samples at ${a}Hz`);
        const w = It(p);
        this.config.debug && console.log(`[WebSocketClient] Converted to μ-law format: ${w.length} bytes`);
        const c = this.arrayBufferToBase64(w.buffer), h = {
          event: "media",
          streamSid: this.streamSid,
          media: {
            payload: c
          }
        };
        this.socket.send(JSON.stringify(h)), this.config.debug && console.log(`[WebSocketClient] Sent μ-law encoded audio: ${c.length} base64 chars`);
      } catch (r) {
        this.config.debug && console.error("[WebSocketClient] Error processing or sending audio:", r);
      }
  }
  /**
   * Convert array buffer to base64
   */
  arrayBufferToBase64(t) {
    const i = new Uint8Array(t);
    let r = "";
    for (let a = 0; a < i.byteLength; a++)
      r += String.fromCharCode(i[a]);
    return btoa(r);
  }
  /**
   * Downsample audio buffer - matches audio.ts implementation
   */
  downsampleBuffer(t, i, r) {
    if (r > i)
      throw new Error("downsampling rate should be lower than original sample rate");
    const a = i / r, p = Math.round(t.length / a), w = new Int16Array(p);
    let c = 0;
    for (let h = 0; h < p; h++) {
      const A = Math.round((h + 1) * a);
      let k = 0, _ = 0;
      for (let E = c; E < A && E < t.length; E++)
        k += t[E], _++;
      w[h] = _ > 0 ? Math.round(k / _ * 32767) : 0, c = A;
    }
    return w;
  }
  /**
   * Add audio data to the playback queue
   */
  addToAudioQueue(t, i = 16e3) {
    this.audioQueue.push({ data: t, sampleRate: i }), this.isPlaying || this.playNextInQueue();
  }
  /**
   * Clear the audio playback queue and stop any current playback
   */
  clearAudioQueue() {
    if (this.audioQueue = [], this.currentAudioSource) {
      if (this.analyser)
        try {
          this.currentAudioSource.disconnect(this.analyser);
        } catch {
        }
      try {
        this.currentAudioSource.stop(), this.currentAudioSource.disconnect();
      } catch {
      }
      this.currentAudioSource = null;
    }
    this.isPlaying = !1;
  }
  /**
   * Play the next audio chunk in the queue
   */
  playNextInQueue() {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = !1, this.isListening || this.stopAudioStatsMonitoring(), this.onPlayStop && this.onPlayStop();
      return;
    }
    const t = this.audioQueue.shift();
    if (!t)
      return;
    const { data: i, sampleRate: r } = t, a = this.audioContext.createBuffer(1, i.length, r);
    a.getChannelData(0).set(i), this.currentAudioSource = this.audioContext.createBufferSource(), this.currentAudioSource.buffer = a, this.analyser && this.currentAudioSource.connect(this.analyser), this.currentAudioSource.connect(this.audioContext.destination), this.currentAudioSource.onended = () => {
      this.currentAudioSource && (this.currentAudioSource.disconnect(), this.currentAudioSource = null), this.playNextInQueue();
    }, this.currentAudioSource.start(), this.isPlaying = !0, this.statsInterval || this.startAudioStatsMonitoring(), this.onPlayStart && this.audioQueue.length === 0 && this.onPlayStart();
  }
  /**
   * Get the current audio level (volume) from the analyzer
   * This works for both microphone input and audio playback, depending on what's currently active
   */
  getAudioLevel() {
    if (!this.analyser)
      return 0;
    const t = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(t);
    let i = 0;
    for (let r = 0; r < t.length; r++)
      i += t[r];
    return i / t.length / 255;
  }
  /**
   * Start monitoring audio levels for speech detection
   */
  startAudioStatsMonitoring() {
    this.statsInterval && clearInterval(this.statsInterval), this.statsInterval = window.setInterval(() => {
      const t = this.getAudioLevel(), i = t > 0.1;
      this.onAudioStats && this.onAudioStats({
        level: t,
        isSpeaking: i,
        isPlayback: this.isPlaying
        // Indicate if these stats are from playback
      }), i !== this.speechDetected && (this.speechDetected = i);
    }, 100);
  }
  /**
   * Stop audio stats monitoring
   */
  stopAudioStatsMonitoring() {
    this.statsInterval && !this.isListening && !this.isPlaying && (clearInterval(this.statsInterval), this.statsInterval = null);
  }
  /**
   * Utility methods to check current state
   */
  isCurrentlyConnected() {
    return this.isConnected;
  }
  isCurrentlyListening() {
    return this.isListening;
  }
  isCurrentlyPlaying() {
    return this.isPlaying;
  }
}
var Te = { exports: {} }, ye = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qe;
function Mt() {
  if (qe)
    return ye;
  qe = 1;
  var s = Xe, t = Symbol.for("react.element"), i = Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, a = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: !0, ref: !0, __self: !0, __source: !0 };
  function w(c, h, A) {
    var k, _ = {}, E = null, D = null;
    A !== void 0 && (E = "" + A), h.key !== void 0 && (E = "" + h.key), h.ref !== void 0 && (D = h.ref);
    for (k in h)
      r.call(h, k) && !p.hasOwnProperty(k) && (_[k] = h[k]);
    if (c && c.defaultProps)
      for (k in h = c.defaultProps, h)
        _[k] === void 0 && (_[k] = h[k]);
    return { $$typeof: t, type: c, key: E, ref: D, props: _, _owner: a.current };
  }
  return ye.Fragment = i, ye.jsx = w, ye.jsxs = w, ye;
}
var xe = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ke;
function Ut() {
  return Ke || (Ke = 1, process.env.NODE_ENV !== "production" && function() {
    var s = Xe, t = Symbol.for("react.element"), i = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), a = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), w = Symbol.for("react.provider"), c = Symbol.for("react.context"), h = Symbol.for("react.forward_ref"), A = Symbol.for("react.suspense"), k = Symbol.for("react.suspense_list"), _ = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), D = Symbol.for("react.offscreen"), L = Symbol.iterator, v = "@@iterator";
    function O(e) {
      if (e === null || typeof e != "object")
        return null;
      var n = L && e[L] || e[v];
      return typeof n == "function" ? n : null;
    }
    var b = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function d(e) {
      {
        for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), l = 1; l < n; l++)
          o[l - 1] = arguments[l];
        W("error", e, o);
      }
    }
    function W(e, n, o) {
      {
        var l = b.ReactDebugCurrentFrame, x = l.getStackAddendum();
        x !== "" && (n += "%s", o = o.concat([x]));
        var C = o.map(function(g) {
          return String(g);
        });
        C.unshift("Warning: " + n), Function.prototype.apply.call(console[e], console, C);
      }
    }
    var Y = !1, M = !1, S = !1, U = !1, G = !1, re;
    re = Symbol.for("react.module.reference");
    function X(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === r || e === p || G || e === a || e === A || e === k || U || e === D || Y || M || S || typeof e == "object" && e !== null && (e.$$typeof === E || e.$$typeof === _ || e.$$typeof === w || e.$$typeof === c || e.$$typeof === h || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === re || e.getModuleId !== void 0));
    }
    function ke(e, n, o) {
      var l = e.displayName;
      if (l)
        return l;
      var x = n.displayName || n.name || "";
      return x !== "" ? o + "(" + x + ")" : o;
    }
    function de(e) {
      return e.displayName || "Context";
    }
    function B(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && d("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case r:
          return "Fragment";
        case i:
          return "Portal";
        case p:
          return "Profiler";
        case a:
          return "StrictMode";
        case A:
          return "Suspense";
        case k:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case c:
            var n = e;
            return de(n) + ".Consumer";
          case w:
            var o = e;
            return de(o._context) + ".Provider";
          case h:
            return ke(e, e.render, "ForwardRef");
          case _:
            var l = e.displayName || null;
            return l !== null ? l : B(e.type) || "Memo";
          case E: {
            var x = e, C = x._payload, g = x._init;
            try {
              return B(g(C));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var y = Object.assign, R = 0, me, fe, q, $, Z, H, N;
    function ee() {
    }
    ee.__reactDisabledLog = !0;
    function ie() {
      {
        if (R === 0) {
          me = console.log, fe = console.info, q = console.warn, $ = console.error, Z = console.group, H = console.groupCollapsed, N = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ee,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        R++;
      }
    }
    function he() {
      {
        if (R--, R === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: y({}, e, {
              value: me
            }),
            info: y({}, e, {
              value: fe
            }),
            warn: y({}, e, {
              value: q
            }),
            error: y({}, e, {
              value: $
            }),
            group: y({}, e, {
              value: Z
            }),
            groupCollapsed: y({}, e, {
              value: H
            }),
            groupEnd: y({}, e, {
              value: N
            })
          });
        }
        R < 0 && d("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var te = b.ReactCurrentDispatcher, K;
    function oe(e, n, o) {
      {
        if (K === void 0)
          try {
            throw Error();
          } catch (x) {
            var l = x.stack.trim().match(/\n( *(at )?)/);
            K = l && l[1] || "";
          }
        return `
` + K + e;
      }
    }
    var se = !1, ae;
    {
      var be = typeof WeakMap == "function" ? WeakMap : Map;
      ae = new be();
    }
    function Oe(e, n) {
      if (!e || se)
        return "";
      {
        var o = ae.get(e);
        if (o !== void 0)
          return o;
      }
      var l;
      se = !0;
      var x = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var C;
      C = te.current, te.current = null, ie();
      try {
        if (n) {
          var g = function() {
            throw Error();
          };
          if (Object.defineProperty(g.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(g, []);
            } catch (F) {
              l = F;
            }
            Reflect.construct(e, [], g);
          } else {
            try {
              g.call();
            } catch (F) {
              l = F;
            }
            e.call(g.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (F) {
            l = F;
          }
          e();
        }
      } catch (F) {
        if (F && l && typeof F.stack == "string") {
          for (var f = F.stack.split(`
`), I = l.stack.split(`
`), P = f.length - 1, T = I.length - 1; P >= 1 && T >= 0 && f[P] !== I[T]; )
            T--;
          for (; P >= 1 && T >= 0; P--, T--)
            if (f[P] !== I[T]) {
              if (P !== 1 || T !== 1)
                do
                  if (P--, T--, T < 0 || f[P] !== I[T]) {
                    var V = `
` + f[P].replace(" at new ", " at ");
                    return e.displayName && V.includes("<anonymous>") && (V = V.replace("<anonymous>", e.displayName)), typeof e == "function" && ae.set(e, V), V;
                  }
                while (P >= 1 && T >= 0);
              break;
            }
        }
      } finally {
        se = !1, te.current = C, he(), Error.prepareStackTrace = x;
      }
      var ce = e ? e.displayName || e.name : "", ne = ce ? oe(ce) : "";
      return typeof e == "function" && ae.set(e, ne), ne;
    }
    function et(e, n, o) {
      return Oe(e, !1);
    }
    function tt(e) {
      var n = e.prototype;
      return !!(n && n.isReactComponent);
    }
    function Se(e, n, o) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Oe(e, tt(e));
      if (typeof e == "string")
        return oe(e);
      switch (e) {
        case A:
          return oe("Suspense");
        case k:
          return oe("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case h:
            return et(e.render);
          case _:
            return Se(e.type, n, o);
          case E: {
            var l = e, x = l._payload, C = l._init;
            try {
              return Se(C(x), n, o);
            } catch {
            }
          }
        }
      return "";
    }
    var ge = Object.prototype.hasOwnProperty, De = {}, Ie = b.ReactDebugCurrentFrame;
    function Ce(e) {
      if (e) {
        var n = e._owner, o = Se(e.type, e._source, n ? n.type : null);
        Ie.setExtraStackFrame(o);
      } else
        Ie.setExtraStackFrame(null);
    }
    function nt(e, n, o, l, x) {
      {
        var C = Function.call.bind(ge);
        for (var g in e)
          if (C(e, g)) {
            var f = void 0;
            try {
              if (typeof e[g] != "function") {
                var I = Error((l || "React class") + ": " + o + " type `" + g + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[g] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw I.name = "Invariant Violation", I;
              }
              f = e[g](n, g, l, o, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (P) {
              f = P;
            }
            f && !(f instanceof Error) && (Ce(x), d("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", o, g, typeof f), Ce(null)), f instanceof Error && !(f.message in De) && (De[f.message] = !0, Ce(x), d("Failed %s type: %s", o, f.message), Ce(null));
          }
      }
    }
    var rt = Array.isArray;
    function Ee(e) {
      return rt(e);
    }
    function it(e) {
      {
        var n = typeof Symbol == "function" && Symbol.toStringTag, o = n && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return o;
      }
    }
    function ot(e) {
      try {
        return We(e), !1;
      } catch {
        return !0;
      }
    }
    function We(e) {
      return "" + e;
    }
    function Fe(e) {
      if (ot(e))
        return d("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", it(e)), We(e);
    }
    var pe = b.ReactCurrentOwner, st = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Me, Ue, Re;
    Re = {};
    function at(e) {
      if (ge.call(e, "ref")) {
        var n = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function lt(e) {
      if (ge.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function ct(e, n) {
      if (typeof e.ref == "string" && pe.current && n && pe.current.stateNode !== n) {
        var o = B(pe.current.type);
        Re[o] || (d('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', B(pe.current.type), e.ref), Re[o] = !0);
      }
    }
    function ut(e, n) {
      {
        var o = function() {
          Me || (Me = !0, d("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: o,
          configurable: !0
        });
      }
    }
    function dt(e, n) {
      {
        var o = function() {
          Ue || (Ue = !0, d("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: o,
          configurable: !0
        });
      }
    }
    var ft = function(e, n, o, l, x, C, g) {
      var f = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: n,
        ref: o,
        props: g,
        // Record the component responsible for creating this element.
        _owner: C
      };
      return f._store = {}, Object.defineProperty(f._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(f, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: l
      }), Object.defineProperty(f, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: x
      }), Object.freeze && (Object.freeze(f.props), Object.freeze(f)), f;
    };
    function ht(e, n, o, l, x) {
      {
        var C, g = {}, f = null, I = null;
        o !== void 0 && (Fe(o), f = "" + o), lt(n) && (Fe(n.key), f = "" + n.key), at(n) && (I = n.ref, ct(n, x));
        for (C in n)
          ge.call(n, C) && !st.hasOwnProperty(C) && (g[C] = n[C]);
        if (e && e.defaultProps) {
          var P = e.defaultProps;
          for (C in P)
            g[C] === void 0 && (g[C] = P[C]);
        }
        if (f || I) {
          var T = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          f && ut(g, T), I && dt(g, T);
        }
        return ft(e, f, I, x, l, pe.current, g);
      }
    }
    var Ae = b.ReactCurrentOwner, $e = b.ReactDebugCurrentFrame;
    function le(e) {
      if (e) {
        var n = e._owner, o = Se(e.type, e._source, n ? n.type : null);
        $e.setExtraStackFrame(o);
      } else
        $e.setExtraStackFrame(null);
    }
    var Le;
    Le = !1;
    function _e(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Be() {
      {
        if (Ae.current) {
          var e = B(Ae.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function gt(e) {
      {
        if (e !== void 0) {
          var n = e.fileName.replace(/^.*[\\\/]/, ""), o = e.lineNumber;
          return `

Check your code at ` + n + ":" + o + ".";
        }
        return "";
      }
    }
    var Ne = {};
    function pt(e) {
      {
        var n = Be();
        if (!n) {
          var o = typeof e == "string" ? e : e.displayName || e.name;
          o && (n = `

Check the top-level render call using <` + o + ">.");
        }
        return n;
      }
    }
    function Ve(e, n) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var o = pt(n);
        if (Ne[o])
          return;
        Ne[o] = !0;
        var l = "";
        e && e._owner && e._owner !== Ae.current && (l = " It was passed a child from " + B(e._owner.type) + "."), le(e), d('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', o, l), le(null);
      }
    }
    function ze(e, n) {
      {
        if (typeof e != "object")
          return;
        if (Ee(e))
          for (var o = 0; o < e.length; o++) {
            var l = e[o];
            _e(l) && Ve(l, n);
          }
        else if (_e(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var x = O(e);
          if (typeof x == "function" && x !== e.entries)
            for (var C = x.call(e), g; !(g = C.next()).done; )
              _e(g.value) && Ve(g.value, n);
        }
      }
    }
    function vt(e) {
      {
        var n = e.type;
        if (n == null || typeof n == "string")
          return;
        var o;
        if (typeof n == "function")
          o = n.propTypes;
        else if (typeof n == "object" && (n.$$typeof === h || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        n.$$typeof === _))
          o = n.propTypes;
        else
          return;
        if (o) {
          var l = B(n);
          nt(o, e.props, "prop", l, e);
        } else if (n.PropTypes !== void 0 && !Le) {
          Le = !0;
          var x = B(n);
          d("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", x || "Unknown");
        }
        typeof n.getDefaultProps == "function" && !n.getDefaultProps.isReactClassApproved && d("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function yt(e) {
      {
        for (var n = Object.keys(e.props), o = 0; o < n.length; o++) {
          var l = n[o];
          if (l !== "children" && l !== "key") {
            le(e), d("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), le(null);
            break;
          }
        }
        e.ref !== null && (le(e), d("Invalid attribute `ref` supplied to `React.Fragment`."), le(null));
      }
    }
    var Ye = {};
    function Ge(e, n, o, l, x, C) {
      {
        var g = X(e);
        if (!g) {
          var f = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (f += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var I = gt(x);
          I ? f += I : f += Be();
          var P;
          e === null ? P = "null" : Ee(e) ? P = "array" : e !== void 0 && e.$$typeof === t ? (P = "<" + (B(e.type) || "Unknown") + " />", f = " Did you accidentally export a JSX literal instead of a component?") : P = typeof e, d("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", P, f);
        }
        var T = ht(e, n, o, x, C);
        if (T == null)
          return T;
        if (g) {
          var V = n.children;
          if (V !== void 0)
            if (l)
              if (Ee(V)) {
                for (var ce = 0; ce < V.length; ce++)
                  ze(V[ce], e);
                Object.freeze && Object.freeze(V);
              } else
                d("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              ze(V, e);
        }
        if (ge.call(n, "key")) {
          var ne = B(e), F = Object.keys(n).filter(function(wt) {
            return wt !== "key";
          }), Pe = F.length > 0 ? "{key: someKey, " + F.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ye[ne + Pe]) {
            var Ct = F.length > 0 ? "{" + F.join(": ..., ") + ": ...}" : "{}";
            d(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Pe, ne, Ct, ne), Ye[ne + Pe] = !0;
          }
        }
        return e === r ? yt(T) : vt(T), T;
      }
    }
    function xt(e, n, o) {
      return Ge(e, n, o, !0);
    }
    function mt(e, n, o) {
      return Ge(e, n, o, !1);
    }
    var bt = mt, St = xt;
    xe.Fragment = r, xe.jsx = bt, xe.jsxs = St;
  }()), xe;
}
process.env.NODE_ENV === "production" ? Te.exports = Mt() : Te.exports = Ut();
var u = Te.exports;
const Ze = Rt({
  connect: () => {
  },
  disconnect: () => {
  },
  startListening: async () => {
  },
  stopListening: () => {
  },
  sendTextMessage: () => {
  },
  isConnected: !1,
  isListening: !1,
  isPlaying: !1,
  messages: [],
  audioStats: null,
  error: null
}), je = () => At(Ze), Nt = ({
  children: s,
  config: t,
  autoConnect: i = !1
}) => {
  const r = J(null), [a, p] = Q(!1), [w, c] = Q(!1), [h, A] = Q(!1), [k, _] = Q([]), [E, D] = Q(null), [L, v] = Q(null);
  z(() => {
    try {
      return r.current = new Ft(t), r.current.setCallbacks({
        onOpen: () => {
          p(!0), v(null);
        },
        onClose: () => {
          p(!1);
        },
        onError: () => {
          v("Connection error occurred");
        },
        onMessage: (S) => {
          _((U) => [...U, S]);
        },
        onListeningStart: () => {
          c(!0);
        },
        onListeningStop: () => {
          c(!1);
        },
        onAudioStart: () => {
          A(!0);
        },
        onAudioStop: () => {
          A(!1);
        },
        onAudioStats: (S) => {
          D(S);
        }
      }), i && r.current.connect(), () => {
        r.current && (r.current.disconnect(), r.current = null);
      };
    } catch (S) {
      v("Failed to initialize client"), console.error("Error initializing PrimVoices client:", S);
    }
  }, [t, i]);
  const O = ue(() => {
    if (r.current)
      try {
        r.current.connect();
      } catch (S) {
        v("Failed to connect"), console.error("Error connecting to PrimVoices:", S);
      }
    else
      v("Client not initialized");
  }, []), b = ue(() => {
    r.current && r.current.disconnect();
  }, []), d = ue(async () => {
    if (r.current)
      try {
        await r.current.startListening();
      } catch (S) {
        v("Failed to start microphone"), console.error("Error starting microphone:", S);
      }
    else
      v("Client not initialized");
  }, []), W = ue(() => {
    r.current && r.current.stopListening();
  }, []), Y = ue((S) => {
    if (r.current && a)
      try {
        r.current.sendText(S);
      } catch (U) {
        v("Failed to send message"), console.error("Error sending text message:", U);
      }
    else
      v("Client not connected");
  }, [a]);
  ue(() => {
    _([]);
  }, []);
  const M = {
    connect: O,
    disconnect: b,
    startListening: d,
    stopListening: W,
    sendTextMessage: Y,
    isConnected: a,
    isListening: w,
    isPlaying: h,
    messages: k,
    audioStats: E,
    error: L
  };
  return /* @__PURE__ */ u.jsx(Ze.Provider, { value: M, children: s });
}, Vt = ({
  onConnect: s,
  onDisconnect: t,
  onListeningStart: i,
  onListeningStop: r,
  onPlayingStart: a,
  onPlayingStop: p,
  onMessage: w,
  onError: c,
  autoConnect: h = !1,
  autoStartListening: A = !1
}) => {
  const {
    connect: k,
    disconnect: _,
    startListening: E,
    stopListening: D,
    isConnected: L,
    isListening: v,
    isPlaying: O,
    messages: b,
    error: d
  } = je(), W = J(L), Y = J(v), M = J(O), S = J(b.length), U = J(d);
  return z(() => {
    h && !L && k();
  }, [h, k, L]), z(() => {
    A && L && !v && E();
  }, [A, L, v, E]), z(() => {
    if (W.current !== L && (L && s ? s() : !L && t && t(), W.current = L), Y.current !== v && (v && i ? i() : !v && r && r(), Y.current = v), M.current !== O && (O && a ? a() : !O && p && p(), M.current = O), S.current !== b.length && b.length > 0) {
      const G = b[b.length - 1];
      w && w(G), S.current = b.length;
    }
    U.current !== d && d && c && (c(d), U.current = d);
  }, [
    L,
    v,
    O,
    b,
    d,
    s,
    t,
    i,
    r,
    a,
    p,
    w,
    c
  ]), null;
}, zt = ({
  onMessage: s,
  onError: t,
  autoConnect: i = !1,
  welcomeMessage: r = "Click the button to start talking",
  containerClassName: a = "",
  buttonClassName: p = "",
  messageClassName: w = "",
  errorClassName: c = ""
}) => {
  const {
    connect: h,
    disconnect: A,
    startListening: k,
    stopListening: _,
    isConnected: E,
    isListening: D,
    isPlaying: L,
    messages: v,
    audioStats: O,
    error: b
  } = je(), [d, W] = Q(r);
  z(() => {
    i && !E && h();
  }, [i, h, E]), z(() => {
    if (v.length > 0) {
      const G = v[v.length - 1];
      W(G), s && s(G);
    }
  }, [v, s]), z(() => {
    b && t && t(b);
  }, [b, t]);
  const Y = async () => {
    if (!E) {
      h();
      return;
    }
    D ? _() : await k();
  }, M = () => E ? D ? "Stop Listening" : "Start Listening" : "Connect", S = () => E ? D ? { backgroundColor: "#e25555" } : { backgroundColor: "#4CAF50" } : { backgroundColor: "#4a90e2" }, U = () => !D || !O ? { width: "0%" } : { width: `${Math.min(100, O.level * 100)}%` };
  return /* @__PURE__ */ u.jsxs("div", { className: `prim-voices-container ${a}`, style: {
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ u.jsx("div", { style: {
      height: "10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "5px",
      overflow: "hidden",
      marginBottom: "16px"
    }, children: /* @__PURE__ */ u.jsx("div", { style: {
      height: "100%",
      backgroundColor: D ? "#4CAF50" : "#4a90e2",
      borderRadius: "5px",
      transition: "width 0.1s ease-out",
      ...U()
    } }) }),
    /* @__PURE__ */ u.jsx("div", { className: `prim-voices-message ${w}`, style: {
      padding: "16px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      marginBottom: "16px",
      minHeight: "60px"
    }, children: d }),
    b && /* @__PURE__ */ u.jsx("div", { className: `prim-voices-error ${c}`, style: {
      padding: "8px",
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: "4px",
      marginBottom: "16px"
    }, children: b }),
    /* @__PURE__ */ u.jsx(
      "button",
      {
        className: `prim-voices-button ${p}`,
        onClick: Y,
        style: {
          padding: "12px 24px",
          border: "none",
          borderRadius: "4px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          ...S()
        },
        children: M()
      }
    ),
    /* @__PURE__ */ u.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px",
      fontSize: "12px",
      color: "#666"
    }, children: [
      /* @__PURE__ */ u.jsx("div", { children: E ? "✓ Connected" : "✗ Disconnected" }),
      /* @__PURE__ */ u.jsx("div", { children: L ? "🔊 Playing" : "" })
    ] })
  ] });
}, Yt = ({
  onMessage: s,
  onError: t,
  autoConnect: i = !1,
  welcomeMessage: r = "Hello! How can I help you today?",
  agentName: a = "Assistant",
  userName: p = "You",
  containerClassName: w = "",
  chatClassName: c = "",
  buttonClassName: h = ""
}) => {
  const {
    connect: A,
    disconnect: k,
    startListening: _,
    stopListening: E,
    sendTextMessage: D,
    isConnected: L,
    isListening: v,
    isPlaying: O,
    messages: b,
    audioStats: d,
    error: W
  } = je(), [Y, M] = Q([]), [S, U] = Q(""), G = J(null), re = J(null), X = J(null);
  z(() => (i && !L && A(), r && M([{
    id: "welcome",
    text: r,
    isUser: !1,
    timestamp: /* @__PURE__ */ new Date()
  }]), () => {
    X.current !== null && cancelAnimationFrame(X.current);
  }), [i, A, L, r]), z(() => {
    if (b.length > 0) {
      const y = b[b.length - 1];
      M((R) => [
        ...R,
        {
          id: `agent-${Date.now()}`,
          text: y,
          isUser: !1,
          timestamp: /* @__PURE__ */ new Date()
        }
      ]), s && s(y);
    }
  }, [b, s]), z(() => {
    W && t && t(W);
  }, [W, t]), z(() => {
    G.current && (G.current.scrollTop = G.current.scrollHeight);
  }, [Y]);
  const ke = async () => {
    if (!L) {
      A();
      return;
    }
    v ? E() : (await _(), M((y) => [
      ...y,
      {
        id: `user-${Date.now()}`,
        text: "🎤 Listening...",
        isUser: !0,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]));
  }, de = () => {
    S.trim() && (L || A(), M((y) => [
      ...y,
      {
        id: `user-text-${Date.now()}`,
        text: S,
        isUser: !0,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]), D(S), U(""));
  }, B = (y) => {
    y.key === "Enter" && de();
  };
  return z(() => {
    if (!re.current || !d)
      return;
    const y = re.current, R = y.getContext("2d");
    if (!R)
      return;
    const me = () => {
      const q = y.width, $ = y.height;
      if (R.clearRect(0, 0, q, $), v) {
        const Z = (d == null ? void 0 : d.level) || 0, H = 3, N = 1, ee = Math.floor(q / (H + N)), ie = $ * 0.8, he = R.createLinearGradient(0, $, 0, 0);
        he.addColorStop(0, "#4a90e2"), he.addColorStop(1, "#64b5f6");
        const te = R.createLinearGradient(0, $, 0, 0);
        te.addColorStop(0, "#4CAF50"), te.addColorStop(1, "#81C784"), R.fillStyle = d != null && d.isSpeaking ? te : he;
        for (let K = 0; K < ee; K++) {
          const oe = K * (H + N), se = Z * ie, ae = Math.sin(K * 0.2 + Date.now() * 5e-3) * se * 0.3, be = Math.max(2, se + ae);
          R.fillRect(oe, $ - be, H, be);
        }
      } else if (O) {
        const Z = Date.now() * 1e-3, H = 3;
        R.strokeStyle = "#4CAF50", R.lineWidth = 2, R.beginPath();
        for (let N = 0; N < q; N++) {
          const ee = N / q, ie = $ / 2 + Math.sin(ee * Math.PI * 2 * H + Z * 3) * ($ * 0.2) + Math.sin(ee * Math.PI * 2 * H * 2 + Z * 5) * ($ * 0.05);
          N === 0 ? R.moveTo(N, ie) : R.lineTo(N, ie);
        }
        R.stroke();
      } else
        R.strokeStyle = "#ccc", R.lineWidth = 2, R.beginPath(), R.moveTo(0, $ / 2), R.lineTo(q, $ / 2), R.stroke();
    }, fe = () => {
      me(), X.current = requestAnimationFrame(fe);
    };
    return fe(), () => {
      X.current !== null && cancelAnimationFrame(X.current);
    };
  }, [v, O, d]), /* @__PURE__ */ u.jsxs("div", { className: `prim-voices-advanced-container ${w}`, style: {
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "600px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0"
  }, children: [
    /* @__PURE__ */ u.jsxs("div", { style: {
      padding: "16px",
      backgroundColor: "#f8f8f8",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ u.jsx("div", { style: { fontWeight: "bold" }, children: a }),
      /* @__PURE__ */ u.jsxs("div", { style: {
        fontSize: "12px",
        color: L ? "#4CAF50" : "#e25555",
        display: "flex",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ u.jsx("div", { style: {
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: L ? "#4CAF50" : "#e25555",
          marginRight: "4px"
        } }),
        L ? "Connected" : "Disconnected"
      ] })
    ] }),
    /* @__PURE__ */ u.jsxs(
      "div",
      {
        ref: G,
        className: `prim-voices-chat ${c}`,
        style: {
          padding: "16px",
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        },
        children: [
          Y.map((y) => /* @__PURE__ */ u.jsxs(
            "div",
            {
              style: {
                alignSelf: y.isUser ? "flex-end" : "flex-start",
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: y.isUser ? "18px 18px 0 18px" : "18px 18px 18px 0",
                backgroundColor: y.isUser ? "#E3F2FD" : "#f0f0f0",
                color: "#333",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
              },
              children: [
                /* @__PURE__ */ u.jsx("div", { style: {
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginBottom: "4px",
                  color: y.isUser ? "#1976D2" : "#555"
                }, children: y.isUser ? p : a }),
                /* @__PURE__ */ u.jsx("div", { children: y.text }),
                /* @__PURE__ */ u.jsx("div", { style: { fontSize: "10px", textAlign: "right", marginTop: "4px", color: "#888" }, children: y.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ]
            },
            y.id
          )),
          W && /* @__PURE__ */ u.jsx("div", { style: {
            alignSelf: "center",
            padding: "8px 16px",
            borderRadius: "16px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            fontSize: "12px",
            margin: "8px 0",
            maxWidth: "80%",
            textAlign: "center"
          }, children: W })
        ]
      }
    ),
    /* @__PURE__ */ u.jsx("div", { style: {
      padding: "8px 16px",
      borderTop: "1px solid #e0e0e0",
      backgroundColor: "#f8f8f8"
    }, children: /* @__PURE__ */ u.jsx(
      "canvas",
      {
        ref: re,
        width: 468,
        height: 60,
        style: {
          width: "100%",
          height: "60px",
          backgroundColor: "#fff",
          borderRadius: "8px"
        }
      }
    ) }),
    /* @__PURE__ */ u.jsxs("div", { style: {
      padding: "16px",
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }, children: [
      /* @__PURE__ */ u.jsx(
        "button",
        {
          className: `prim-voices-button ${h}`,
          onClick: ke,
          style: {
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: v ? "#e25555" : "#4CAF50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            flexShrink: 0
          },
          children: v ? /* @__PURE__ */ u.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ u.jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2" }) }) : /* @__PURE__ */ u.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ u.jsx("path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }),
            /* @__PURE__ */ u.jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
            /* @__PURE__ */ u.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" })
          ] })
        }
      ),
      /* @__PURE__ */ u.jsxs("div", { style: {
        flex: 1,
        display: "flex",
        gap: "8px"
      }, children: [
        /* @__PURE__ */ u.jsx(
          "input",
          {
            type: "text",
            value: S,
            onChange: (y) => U(y.target.value),
            onKeyPress: B,
            placeholder: "Type a message...",
            style: {
              flex: 1,
              borderRadius: "24px",
              border: "1px solid #e0e0e0",
              padding: "12px 16px",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1) inset"
            }
          }
        ),
        /* @__PURE__ */ u.jsx(
          "button",
          {
            onClick: de,
            disabled: !S.trim(),
            style: {
              borderRadius: "50%",
              border: "none",
              backgroundColor: S.trim() ? "#1976D2" : "#e0e0e0",
              color: "white",
              width: "48px",
              height: "48px",
              cursor: S.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: S.trim() ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none",
              transition: "background-color 0.2s ease",
              flexShrink: 0
            },
            children: /* @__PURE__ */ u.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ u.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
              /* @__PURE__ */ u.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
            ] })
          }
        )
      ] })
    ] })
  ] });
};
export {
  Yt as AdvancedAudioConversation,
  zt as BasicAudioConversation,
  Vt as HeadlessAudioConversation,
  Nt as PrimVoicesProvider,
  Ft as WebSocketClient,
  je as usePrimVoices
};
//# sourceMappingURL=index.es.js.map
