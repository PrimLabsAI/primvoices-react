var St = Object.defineProperty;
var wt = (s, t, r) => t in s ? St(s, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[t] = r;
var S = (s, t, r) => (wt(s, typeof t != "symbol" ? t + "" : t, r), r);
import Ge, { createContext as kt, useContext as Rt, useRef as q, useState as J, useEffect as z, useCallback as ce } from "react";
let ye;
const At = new Uint8Array(16);
function Et() {
  if (!ye && (ye = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !ye))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return ye(At);
}
const D = [];
for (let s = 0; s < 256; ++s)
  D.push((s + 256).toString(16).slice(1));
function _t(s, t = 0) {
  return D[s[t + 0]] + D[s[t + 1]] + D[s[t + 2]] + D[s[t + 3]] + "-" + D[s[t + 4]] + D[s[t + 5]] + "-" + D[s[t + 6]] + D[s[t + 7]] + "-" + D[s[t + 8]] + D[s[t + 9]] + "-" + D[s[t + 10]] + D[s[t + 11]] + D[s[t + 12]] + D[s[t + 13]] + D[s[t + 14]] + D[s[t + 15]];
}
const Pt = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Ye = {
  randomUUID: Pt
};
function He(s, t, r) {
  if (Ye.randomUUID && !t && !s)
    return Ye.randomUUID();
  s = s || {};
  const o = s.random || (s.rng || Et)();
  if (o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, t) {
    r = r || 0;
    for (let a = 0; a < 16; ++a)
      t[r + a] = o[a];
    return t;
  }
  return _t(o);
}
class jt {
  constructor(t) {
    S(this, "socket", null);
    S(this, "audioContext", null);
    S(this, "mediaStream", null);
    S(this, "microphoneSource", null);
    S(this, "audioWorklet", null);
    S(this, "analyser", null);
    S(this, "audioQueue", []);
    S(this, "currentAudioSource", null);
    S(this, "workletInitialized", !1);
    S(this, "isListening", !1);
    S(this, "isConnected", !1);
    S(this, "isPlaying", !1);
    S(this, "callSid", "");
    S(this, "streamSid", "");
    S(this, "config");
    S(this, "speechDetected", !1);
    S(this, "statsInterval", null);
    // Callbacks
    S(this, "onConnectionOpen", null);
    S(this, "onConnectionClose", null);
    S(this, "onConnectionError", null);
    S(this, "onStartListening", null);
    S(this, "onStopListening", null);
    S(this, "onAgentMessage", null);
    S(this, "onPlayStart", null);
    S(this, "onPlayStop", null);
    S(this, "onAudioStats", null);
    this.config = {
      serverUrl: "wss://tts.primvoices.com/ws",
      debug: !1,
      ...t
    }, this.initAudioContext();
  }
  /**
   * Set callbacks for different events
   */
  setCallbacks({
    onOpen: t,
    onClose: r,
    onError: o,
    onMessage: a,
    onListeningStart: d,
    onListeningStop: h,
    onAudioStart: c,
    onAudioStop: u,
    onAudioStats: x
  }) {
    this.onConnectionOpen = t || null, this.onConnectionClose = r || null, this.onConnectionError = o || null, this.onAgentMessage = a || null, this.onStartListening = d || null, this.onStopListening = h || null, this.onPlayStart = c || null, this.onPlayStop = u || null, this.onAudioStats = x || null;
  }
  /**
   * Initialize the WebSocket connection
   */
  connect() {
    if (this.callSid = He(), this.streamSid = He(), this.socket && this.socket.close(), !this.config.serverUrl)
      throw new Error("Server URL is required");
    this.socket = new WebSocket(this.config.serverUrl), this.setupSocketHandlers(), this.config.debug && (console.log(`[WebSocketClient] Connecting to ${this.config.serverUrl}`), console.log(`[WebSocketClient] Session IDs: call=${this.callSid}, stream=${this.streamSid}`));
  }
  /**
   * Setup WebSocket event handlers
   */
  setupSocketHandlers() {
    this.socket && (this.socket.onopen = () => {
      var r;
      this.isConnected = !0;
      const t = {
        start: {
          streamSid: this.streamSid,
          callSid: this.callSid,
          customParameters: {
            inputType: "mic",
            voice: this.config.voiceId || "default",
            agentId: this.config.agentId || "default",
            sample_rate: 16e3,
            // We send at 16000Hz
            format: "pcm",
            response_sample_rate: 24e3
            // Server responds at 24000Hz
          }
        }
      };
      (r = this.socket) == null || r.send(JSON.stringify(t)), this.config.debug && (console.log("[WebSocketClient] Connection established"), console.log("[WebSocketClient] Sent start message:", t)), this.onConnectionOpen && this.onConnectionOpen();
    }, this.socket.onclose = () => {
      this.isConnected = !1, this.config.debug && console.log("[WebSocketClient] Connection closed"), this.onConnectionClose && this.onConnectionClose(), this.stopListening();
    }, this.socket.onerror = (t) => {
      this.config.debug && console.error("[WebSocketClient] WebSocket error:", t), this.onConnectionError && this.onConnectionError();
    }, this.socket.onmessage = (t) => {
      try {
        const r = JSON.parse(t.data);
        r.event === "media" ? this.handleAudioMessage(r) : r.event === "clear" ? this.handleClearMessage(r) : r.event === "transcript" && this.onAgentMessage && r.text && this.onAgentMessage(r.text);
      } catch (r) {
        this.config.debug && console.error("[WebSocketClient] Error parsing message:", r);
      }
    });
  }
  /**
   * Handle audio data received from the server
   */
  handleAudioMessage(t) {
    if (!t.media || !t.media.payload)
      return;
    const r = t.media.payload, o = atob(r), a = new Uint8Array(o.length);
    for (let c = 0; c < o.length; c++)
      a[c] = o.charCodeAt(c);
    let d;
    if (a.length % 2 !== 0) {
      const c = new ArrayBuffer(a.length + a.length % 2);
      new Uint8Array(c).set(a), d = new Int16Array(c);
    } else {
      const c = new ArrayBuffer(a.length);
      new Uint8Array(c).set(a), d = new Int16Array(c);
    }
    const h = new Float32Array(d.length);
    for (let c = 0; c < d.length; c++)
      h[c] = d[c] / 32768;
    this.addToAudioQueue(h, 24e3);
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
        `, r = new Blob([t], { type: "application/javascript" }), o = URL.createObjectURL(r);
        await this.audioContext.audioWorklet.addModule(o), URL.revokeObjectURL(o), this.workletInitialized = !0, this.config.debug && console.log("[WebSocketClient] Audio worklet initialized");
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
          audio: {
            echoCancellation: !0,
            noiseSuppression: !0,
            autoGainControl: !0
          },
          video: !1
        }), !this.audioContext)
          throw new Error("Audio context not initialized");
        if (this.microphoneSource = this.audioContext.createMediaStreamSource(this.mediaStream), this.workletInitialized)
          this.audioWorklet = new AudioWorkletNode(this.audioContext, "audio-processor"), this.microphoneSource.connect(this.audioWorklet), this.analyser && this.microphoneSource.connect(this.analyser), this.audioWorklet.port.onmessage = (r) => {
            r.data.audioData && this.isListening && this.processAudioData(r.data.audioData);
          };
        else {
          this.config.debug && console.log("[WebSocketClient] Using ScriptProcessorNode fallback");
          const r = 4096, o = this.audioContext.createScriptProcessor(r, 1, 1);
          this.microphoneSource.connect(o), o.connect(this.audioContext.destination), this.analyser && this.microphoneSource.connect(this.analyser), o.onaudioprocess = (a) => {
            if (this.isListening) {
              const d = a.inputBuffer.getChannelData(0);
              this.processAudioData(d);
            }
          };
        }
        this.isListening = !0, this.startAudioStatsMonitoring(), this.onStartListening && this.onStartListening(), this.config.debug && console.log("[WebSocketClient] Started listening");
      } catch (r) {
        this.config.debug && console.error("[WebSocketClient] Error starting microphone:", r), this.isListening = !1;
      }
  }
  /**
   * Stop capturing audio from the microphone
   */
  stopListening() {
    this.isListening && (this.mediaStream && (this.mediaStream.getTracks().forEach((t) => t.stop()), this.mediaStream = null), this.microphoneSource && (this.microphoneSource.disconnect(), this.microphoneSource = null), this.audioWorklet && (this.audioWorklet.disconnect(), this.audioWorklet = null), this.isListening = !1, this.stopAudioStatsMonitoring(), this.onStopListening && this.onStopListening(), this.config.debug && console.log("[WebSocketClient] Stopped listening"));
  }
  /**
   * Close the WebSocket connection and clean up resources
   */
  disconnect() {
    this.stopListening(), this.socket && (this.socket.close(), this.socket = null), this.isConnected = !1, this.clearAudioQueue(), this.config.debug && console.log("[WebSocketClient] Disconnected");
  }
  /**
   * Process captured audio data and send it to the server
   */
  processAudioData(t) {
    var r;
    if (!(!this.socket || this.socket.readyState !== WebSocket.OPEN))
      try {
        const o = ((r = this.audioContext) == null ? void 0 : r.sampleRate) || 48e3, a = 8e3;
        if (this.config.debug) {
          const x = t.some((b) => Math.abs(b) > 0.01);
          console.log(`[WebSocketClient] Processing audio frame: ${t.length} samples at ${o}Hz ${x ? "(has sound)" : "(silent)"}`);
        }
        const d = this.downsampleBuffer(t, o, a);
        this.config.debug && console.log(`[WebSocketClient] Downsampled to ${d.length} samples at ${a}Hz`);
        const h = this.linearToMuLaw(d);
        this.config.debug && console.log(`[WebSocketClient] Converted to μ-law format: ${h.length} bytes`);
        const c = this.arrayBufferToBase64(h.buffer), u = {
          event: "media",
          streamSid: this.streamSid,
          media: {
            payload: c
          }
        };
        this.socket.send(JSON.stringify(u)), this.config.debug && console.log(`[WebSocketClient] Sent μ-law encoded audio: ${c.length} base64 chars`);
      } catch (o) {
        this.config.debug && console.error("[WebSocketClient] Error processing or sending audio:", o);
      }
  }
  /**
   * Convert array buffer to base64
   */
  arrayBufferToBase64(t) {
    const r = new Uint8Array(t);
    let o = "";
    for (let a = 0; a < r.byteLength; a++)
      o += String.fromCharCode(r[a]);
    return btoa(o);
  }
  /**
   * Convert linear PCM to muLaw - matches audio.ts implementation
   */
  linearToMuLaw(t) {
    const a = new Uint8Array(t.length);
    for (let d = 0; d < t.length; d++) {
      let h = t[d];
      const c = h < 0 ? 128 : 0;
      c && (h = -h), h = Math.min(h, 32635), h += 33;
      let u = 7, x = 0;
      for (let w = 10; w >= 0; w--)
        if (h & 1 << w) {
          u = Math.floor(w / 2);
          break;
        }
      const b = h >> u + 3 & 15;
      x = u << 4 | b, a[d] = ~(c | x) & 255;
    }
    return a;
  }
  /**
   * Downsample audio buffer - matches audio.ts implementation
   */
  downsampleBuffer(t, r, o) {
    if (o > r)
      throw new Error("downsampling rate should be lower than original sample rate");
    const a = r / o, d = Math.round(t.length / a), h = new Int16Array(d);
    let c = 0;
    for (let u = 0; u < d; u++) {
      const x = Math.round((u + 1) * a);
      let b = 0, w = 0;
      for (let k = c; k < x && k < t.length; k++)
        b += t[k], w++;
      h[u] = w > 0 ? Math.round(b / w * 32767) : 0, c = x;
    }
    return h;
  }
  /**
   * Add audio data to the playback queue
   */
  addToAudioQueue(t, r = 16e3) {
    this.audioQueue.push({ data: t, sampleRate: r }), this.isPlaying || this.playNextInQueue();
  }
  /**
   * Clear the audio playback queue
   */
  clearAudioQueue() {
    this.audioQueue = [], this.currentAudioSource && (this.currentAudioSource.stop(), this.currentAudioSource.disconnect(), this.currentAudioSource = null), this.isPlaying = !1;
  }
  /**
   * Play the next audio chunk in the queue
   */
  playNextInQueue() {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = !1, this.onPlayStop && this.onPlayStop();
      return;
    }
    const t = this.audioQueue.shift();
    if (!t)
      return;
    const { data: r, sampleRate: o } = t, a = this.audioContext.createBuffer(1, r.length, o);
    a.getChannelData(0).set(r), this.currentAudioSource = this.audioContext.createBufferSource(), this.currentAudioSource.buffer = a, this.currentAudioSource.connect(this.audioContext.destination), this.currentAudioSource.onended = () => {
      this.currentAudioSource && (this.currentAudioSource.disconnect(), this.currentAudioSource = null), this.playNextInQueue();
    }, this.currentAudioSource.start(), this.isPlaying = !0, this.onPlayStart && this.audioQueue.length === 0 && this.onPlayStart();
  }
  /**
   * Get the current audio level (volume) from the analyzer
   */
  getAudioLevel() {
    if (!this.analyser)
      return 0;
    const t = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(t);
    let r = 0;
    for (let o = 0; o < t.length; o++)
      r += t[o];
    return r / t.length / 255;
  }
  /**
   * Start monitoring audio levels for speech detection
   */
  startAudioStatsMonitoring() {
    this.statsInterval && clearInterval(this.statsInterval), this.statsInterval = window.setInterval(() => {
      const t = this.getAudioLevel(), r = t > 0.1;
      this.onAudioStats && this.onAudioStats({
        level: t,
        isSpeaking: r
      }), r !== this.speechDetected && (this.speechDetected = r);
    }, 100);
  }
  /**
   * Stop audio stats monitoring
   */
  stopAudioStatsMonitoring() {
    this.statsInterval && (clearInterval(this.statsInterval), this.statsInterval = null);
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
var Pe = { exports: {} }, ue = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qe;
function Tt() {
  if (Qe)
    return ue;
  Qe = 1;
  var s = Ge, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), o = Object.prototype.hasOwnProperty, a = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, d = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(c, u, x) {
    var b, w = {}, k = null, j = null;
    x !== void 0 && (k = "" + x), u.key !== void 0 && (k = "" + u.key), u.ref !== void 0 && (j = u.ref);
    for (b in u)
      o.call(u, b) && !d.hasOwnProperty(b) && (w[b] = u[b]);
    if (c && c.defaultProps)
      for (b in u = c.defaultProps, u)
        w[b] === void 0 && (w[b] = u[b]);
    return { $$typeof: t, type: c, key: k, ref: j, props: w, _owner: a.current };
  }
  return ue.Fragment = r, ue.jsx = h, ue.jsxs = h, ue;
}
var de = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qe;
function Lt() {
  return qe || (qe = 1, process.env.NODE_ENV !== "production" && function() {
    var s = Ge, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), a = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), c = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), x = Symbol.for("react.suspense"), b = Symbol.for("react.suspense_list"), w = Symbol.for("react.memo"), k = Symbol.for("react.lazy"), j = Symbol.for("react.offscreen"), A = Symbol.iterator, R = "@@iterator";
    function O(e) {
      if (e === null || typeof e != "object")
        return null;
      var n = A && e[A] || e[R];
      return typeof n == "function" ? n : null;
    }
    var g = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function v(e) {
      {
        for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), l = 1; l < n; l++)
          i[l - 1] = arguments[l];
        Y("error", e, i);
      }
    }
    function Y(e, n, i) {
      {
        var l = g.ReactDebugCurrentFrame, y = l.getStackAddendum();
        y !== "" && (n += "%s", i = i.concat([y]));
        var C = i.map(function(p) {
          return String(p);
        });
        C.unshift("Warning: " + n), Function.prototype.apply.call(console[e], console, C);
      }
    }
    var U = !1, _ = !1, $ = !1, B = !1, G = !1, T;
    T = Symbol.for("react.module.reference");
    function E(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === o || e === d || G || e === a || e === x || e === b || B || e === j || U || _ || $ || typeof e == "object" && e !== null && (e.$$typeof === k || e.$$typeof === w || e.$$typeof === h || e.$$typeof === c || e.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === T || e.getModuleId !== void 0));
    }
    function be(e, n, i) {
      var l = e.displayName;
      if (l)
        return l;
      var y = n.displayName || n.name || "";
      return y !== "" ? i + "(" + y + ")" : i;
    }
    function se(e) {
      return e.displayName || "Context";
    }
    function W(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && v("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case o:
          return "Fragment";
        case r:
          return "Portal";
        case d:
          return "Profiler";
        case a:
          return "StrictMode";
        case x:
          return "Suspense";
        case b:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case c:
            var n = e;
            return se(n) + ".Consumer";
          case h:
            var i = e;
            return se(i._context) + ".Provider";
          case u:
            return be(e, e.render, "ForwardRef");
          case w:
            var l = e.displayName || null;
            return l !== null ? l : W(e.type) || "Memo";
          case k: {
            var y = e, C = y._payload, p = y._init;
            try {
              return W(p(C));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var I = Object.assign, H = 0, Q, N, K, X, te, ne, Z;
    function fe() {
    }
    fe.__reactDisabledLog = !0;
    function he() {
      {
        if (H === 0) {
          Q = console.log, N = console.info, K = console.warn, X = console.error, te = console.group, ne = console.groupCollapsed, Z = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: fe,
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
        H++;
      }
    }
    function xe() {
      {
        if (H--, H === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: I({}, e, {
              value: Q
            }),
            info: I({}, e, {
              value: N
            }),
            warn: I({}, e, {
              value: K
            }),
            error: I({}, e, {
              value: X
            }),
            group: I({}, e, {
              value: te
            }),
            groupCollapsed: I({}, e, {
              value: ne
            }),
            groupEnd: I({}, e, {
              value: Z
            })
          });
        }
        H < 0 && v("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var re = g.ReactCurrentDispatcher, Ce;
    function ge(e, n, i) {
      {
        if (Ce === void 0)
          try {
            throw Error();
          } catch (y) {
            var l = y.stack.trim().match(/\n( *(at )?)/);
            Ce = l && l[1] || "";
          }
        return `
` + Ce + e;
      }
    }
    var Se = !1, pe;
    {
      var Ke = typeof WeakMap == "function" ? WeakMap : Map;
      pe = new Ke();
    }
    function Te(e, n) {
      if (!e || Se)
        return "";
      {
        var i = pe.get(e);
        if (i !== void 0)
          return i;
      }
      var l;
      Se = !0;
      var y = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var C;
      C = re.current, re.current = null, he();
      try {
        if (n) {
          var p = function() {
            throw Error();
          };
          if (Object.defineProperty(p.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(p, []);
            } catch (F) {
              l = F;
            }
            Reflect.construct(e, [], p);
          } else {
            try {
              p.call();
            } catch (F) {
              l = F;
            }
            e.call(p.prototype);
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
`), M = l.stack.split(`
`), P = f.length - 1, L = M.length - 1; P >= 1 && L >= 0 && f[P] !== M[L]; )
            L--;
          for (; P >= 1 && L >= 0; P--, L--)
            if (f[P] !== M[L]) {
              if (P !== 1 || L !== 1)
                do
                  if (P--, L--, L < 0 || f[P] !== M[L]) {
                    var V = `
` + f[P].replace(" at new ", " at ");
                    return e.displayName && V.includes("<anonymous>") && (V = V.replace("<anonymous>", e.displayName)), typeof e == "function" && pe.set(e, V), V;
                  }
                while (P >= 1 && L >= 0);
              break;
            }
        }
      } finally {
        Se = !1, re.current = C, xe(), Error.prepareStackTrace = y;
      }
      var oe = e ? e.displayName || e.name : "", ee = oe ? ge(oe) : "";
      return typeof e == "function" && pe.set(e, ee), ee;
    }
    function Xe(e, n, i) {
      return Te(e, !1);
    }
    function Ze(e) {
      var n = e.prototype;
      return !!(n && n.isReactComponent);
    }
    function ve(e, n, i) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Te(e, Ze(e));
      if (typeof e == "string")
        return ge(e);
      switch (e) {
        case x:
          return ge("Suspense");
        case b:
          return ge("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case u:
            return Xe(e.render);
          case w:
            return ve(e.type, n, i);
          case k: {
            var l = e, y = l._payload, C = l._init;
            try {
              return ve(C(y), n, i);
            } catch {
            }
          }
        }
      return "";
    }
    var ae = Object.prototype.hasOwnProperty, Le = {}, Oe = g.ReactDebugCurrentFrame;
    function me(e) {
      if (e) {
        var n = e._owner, i = ve(e.type, e._source, n ? n.type : null);
        Oe.setExtraStackFrame(i);
      } else
        Oe.setExtraStackFrame(null);
    }
    function et(e, n, i, l, y) {
      {
        var C = Function.call.bind(ae);
        for (var p in e)
          if (C(e, p)) {
            var f = void 0;
            try {
              if (typeof e[p] != "function") {
                var M = Error((l || "React class") + ": " + i + " type `" + p + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[p] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw M.name = "Invariant Violation", M;
              }
              f = e[p](n, p, l, i, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (P) {
              f = P;
            }
            f && !(f instanceof Error) && (me(y), v("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", i, p, typeof f), me(null)), f instanceof Error && !(f.message in Le) && (Le[f.message] = !0, me(y), v("Failed %s type: %s", i, f.message), me(null));
          }
      }
    }
    var tt = Array.isArray;
    function we(e) {
      return tt(e);
    }
    function nt(e) {
      {
        var n = typeof Symbol == "function" && Symbol.toStringTag, i = n && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return i;
      }
    }
    function rt(e) {
      try {
        return Ie(e), !1;
      } catch {
        return !0;
      }
    }
    function Ie(e) {
      return "" + e;
    }
    function De(e) {
      if (rt(e))
        return v("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nt(e)), Ie(e);
    }
    var le = g.ReactCurrentOwner, it = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, We, Me, ke;
    ke = {};
    function ot(e) {
      if (ae.call(e, "ref")) {
        var n = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function st(e) {
      if (ae.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function at(e, n) {
      if (typeof e.ref == "string" && le.current && n && le.current.stateNode !== n) {
        var i = W(le.current.type);
        ke[i] || (v('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', W(le.current.type), e.ref), ke[i] = !0);
      }
    }
    function lt(e, n) {
      {
        var i = function() {
          We || (We = !0, v("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        i.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: i,
          configurable: !0
        });
      }
    }
    function ct(e, n) {
      {
        var i = function() {
          Me || (Me = !0, v("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        i.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: i,
          configurable: !0
        });
      }
    }
    var ut = function(e, n, i, l, y, C, p) {
      var f = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: n,
        ref: i,
        props: p,
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
        value: y
      }), Object.freeze && (Object.freeze(f.props), Object.freeze(f)), f;
    };
    function dt(e, n, i, l, y) {
      {
        var C, p = {}, f = null, M = null;
        i !== void 0 && (De(i), f = "" + i), st(n) && (De(n.key), f = "" + n.key), ot(n) && (M = n.ref, at(n, y));
        for (C in n)
          ae.call(n, C) && !it.hasOwnProperty(C) && (p[C] = n[C]);
        if (e && e.defaultProps) {
          var P = e.defaultProps;
          for (C in P)
            p[C] === void 0 && (p[C] = P[C]);
        }
        if (f || M) {
          var L = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          f && lt(p, L), M && ct(p, L);
        }
        return ut(e, f, M, y, l, le.current, p);
      }
    }
    var Re = g.ReactCurrentOwner, Fe = g.ReactDebugCurrentFrame;
    function ie(e) {
      if (e) {
        var n = e._owner, i = ve(e.type, e._source, n ? n.type : null);
        Fe.setExtraStackFrame(i);
      } else
        Fe.setExtraStackFrame(null);
    }
    var Ae;
    Ae = !1;
    function Ee(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Ue() {
      {
        if (Re.current) {
          var e = W(Re.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function ft(e) {
      {
        if (e !== void 0) {
          var n = e.fileName.replace(/^.*[\\\/]/, ""), i = e.lineNumber;
          return `

Check your code at ` + n + ":" + i + ".";
        }
        return "";
      }
    }
    var $e = {};
    function ht(e) {
      {
        var n = Ue();
        if (!n) {
          var i = typeof e == "string" ? e : e.displayName || e.name;
          i && (n = `

Check the top-level render call using <` + i + ">.");
        }
        return n;
      }
    }
    function Be(e, n) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var i = ht(n);
        if ($e[i])
          return;
        $e[i] = !0;
        var l = "";
        e && e._owner && e._owner !== Re.current && (l = " It was passed a child from " + W(e._owner.type) + "."), ie(e), v('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', i, l), ie(null);
      }
    }
    function Ne(e, n) {
      {
        if (typeof e != "object")
          return;
        if (we(e))
          for (var i = 0; i < e.length; i++) {
            var l = e[i];
            Ee(l) && Be(l, n);
          }
        else if (Ee(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var y = O(e);
          if (typeof y == "function" && y !== e.entries)
            for (var C = y.call(e), p; !(p = C.next()).done; )
              Ee(p.value) && Be(p.value, n);
        }
      }
    }
    function gt(e) {
      {
        var n = e.type;
        if (n == null || typeof n == "string")
          return;
        var i;
        if (typeof n == "function")
          i = n.propTypes;
        else if (typeof n == "object" && (n.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        n.$$typeof === w))
          i = n.propTypes;
        else
          return;
        if (i) {
          var l = W(n);
          et(i, e.props, "prop", l, e);
        } else if (n.PropTypes !== void 0 && !Ae) {
          Ae = !0;
          var y = W(n);
          v("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", y || "Unknown");
        }
        typeof n.getDefaultProps == "function" && !n.getDefaultProps.isReactClassApproved && v("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function pt(e) {
      {
        for (var n = Object.keys(e.props), i = 0; i < n.length; i++) {
          var l = n[i];
          if (l !== "children" && l !== "key") {
            ie(e), v("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", l), ie(null);
            break;
          }
        }
        e.ref !== null && (ie(e), v("Invalid attribute `ref` supplied to `React.Fragment`."), ie(null));
      }
    }
    var Ve = {};
    function ze(e, n, i, l, y, C) {
      {
        var p = E(e);
        if (!p) {
          var f = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (f += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var M = ft(y);
          M ? f += M : f += Ue();
          var P;
          e === null ? P = "null" : we(e) ? P = "array" : e !== void 0 && e.$$typeof === t ? (P = "<" + (W(e.type) || "Unknown") + " />", f = " Did you accidentally export a JSX literal instead of a component?") : P = typeof e, v("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", P, f);
        }
        var L = dt(e, n, i, y, C);
        if (L == null)
          return L;
        if (p) {
          var V = n.children;
          if (V !== void 0)
            if (l)
              if (we(V)) {
                for (var oe = 0; oe < V.length; oe++)
                  Ne(V[oe], e);
                Object.freeze && Object.freeze(V);
              } else
                v("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ne(V, e);
        }
        if (ae.call(n, "key")) {
          var ee = W(e), F = Object.keys(n).filter(function(Ct) {
            return Ct !== "key";
          }), _e = F.length > 0 ? "{key: someKey, " + F.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ve[ee + _e]) {
            var xt = F.length > 0 ? "{" + F.join(": ..., ") + ": ...}" : "{}";
            v(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, _e, ee, xt, ee), Ve[ee + _e] = !0;
          }
        }
        return e === o ? pt(L) : gt(L), L;
      }
    }
    function vt(e, n, i) {
      return ze(e, n, i, !0);
    }
    function mt(e, n, i) {
      return ze(e, n, i, !1);
    }
    var yt = mt, bt = vt;
    de.Fragment = o, de.jsx = yt, de.jsxs = bt;
  }()), de;
}
process.env.NODE_ENV === "production" ? Pe.exports = Tt() : Pe.exports = Lt();
var m = Pe.exports;
const Je = kt({
  connect: () => {
  },
  disconnect: () => {
  },
  startListening: async () => {
  },
  stopListening: () => {
  },
  isConnected: !1,
  isListening: !1,
  isPlaying: !1,
  messages: [],
  audioStats: null,
  error: null
}), je = () => Rt(Je), Dt = ({
  children: s,
  config: t,
  autoConnect: r = !1
}) => {
  const o = q(null), [a, d] = J(!1), [h, c] = J(!1), [u, x] = J(!1), [b, w] = J([]), [k, j] = J(null), [A, R] = J(null);
  z(() => {
    try {
      return o.current = new jt(t), o.current.setCallbacks({
        onOpen: () => {
          d(!0), R(null);
        },
        onClose: () => {
          d(!1);
        },
        onError: () => {
          R("Connection error occurred");
        },
        onMessage: (_) => {
          w(($) => [...$, _]);
        },
        onListeningStart: () => {
          c(!0);
        },
        onListeningStop: () => {
          c(!1);
        },
        onAudioStart: () => {
          x(!0);
        },
        onAudioStop: () => {
          x(!1);
        },
        onAudioStats: (_) => {
          j(_);
        }
      }), r && o.current.connect(), () => {
        o.current && (o.current.disconnect(), o.current = null);
      };
    } catch (_) {
      R("Failed to initialize client"), console.error("Error initializing PrimVoices client:", _);
    }
  }, [t, r]);
  const O = ce(() => {
    if (o.current)
      try {
        o.current.connect();
      } catch (_) {
        R("Failed to connect"), console.error("Error connecting to PrimVoices:", _);
      }
    else
      R("Client not initialized");
  }, []), g = ce(() => {
    o.current && o.current.disconnect();
  }, []), v = ce(async () => {
    if (o.current)
      try {
        await o.current.startListening();
      } catch (_) {
        R("Failed to start microphone"), console.error("Error starting microphone:", _);
      }
    else
      R("Client not initialized");
  }, []), Y = ce(() => {
    o.current && o.current.stopListening();
  }, []);
  ce(() => {
    w([]);
  }, []);
  const U = {
    connect: O,
    disconnect: g,
    startListening: v,
    stopListening: Y,
    isConnected: a,
    isListening: h,
    isPlaying: u,
    messages: b,
    audioStats: k,
    error: A
  };
  return /* @__PURE__ */ m.jsx(Je.Provider, { value: U, children: s });
}, Wt = ({
  onConnect: s,
  onDisconnect: t,
  onListeningStart: r,
  onListeningStop: o,
  onPlayingStart: a,
  onPlayingStop: d,
  onMessage: h,
  onError: c,
  autoConnect: u = !1,
  autoStartListening: x = !1
}) => {
  const {
    connect: b,
    disconnect: w,
    startListening: k,
    stopListening: j,
    isConnected: A,
    isListening: R,
    isPlaying: O,
    messages: g,
    error: v
  } = je(), Y = q(A), U = q(R), _ = q(O), $ = q(g.length), B = q(v);
  return z(() => {
    u && !A && b();
  }, [u, b, A]), z(() => {
    x && A && !R && k();
  }, [x, A, R, k]), z(() => {
    if (Y.current !== A && (A && s ? s() : !A && t && t(), Y.current = A), U.current !== R && (R && r ? r() : !R && o && o(), U.current = R), _.current !== O && (O && a ? a() : !O && d && d(), _.current = O), $.current !== g.length && g.length > 0) {
      const G = g[g.length - 1];
      h && h(G), $.current = g.length;
    }
    B.current !== v && v && c && (c(v), B.current = v);
  }, [
    A,
    R,
    O,
    g,
    v,
    s,
    t,
    r,
    o,
    a,
    d,
    h,
    c
  ]), null;
}, Mt = ({
  onMessage: s,
  onError: t,
  autoConnect: r = !1,
  welcomeMessage: o = "Click the button to start talking",
  containerClassName: a = "",
  buttonClassName: d = "",
  messageClassName: h = "",
  errorClassName: c = ""
}) => {
  const {
    connect: u,
    disconnect: x,
    startListening: b,
    stopListening: w,
    isConnected: k,
    isListening: j,
    isPlaying: A,
    messages: R,
    audioStats: O,
    error: g
  } = je(), [v, Y] = J(o);
  z(() => {
    r && !k && u();
  }, [r, u, k]), z(() => {
    if (R.length > 0) {
      const G = R[R.length - 1];
      Y(G), s && s(G);
    }
  }, [R, s]), z(() => {
    g && t && t(g);
  }, [g, t]);
  const U = async () => {
    if (!k) {
      u();
      return;
    }
    j ? w() : await b();
  }, _ = () => k ? j ? "Stop Listening" : "Start Listening" : "Connect", $ = () => k ? j ? { backgroundColor: "#e25555" } : { backgroundColor: "#4CAF50" } : { backgroundColor: "#4a90e2" }, B = () => !j || !O ? { width: "0%" } : { width: `${Math.min(100, O.level * 100)}%` };
  return /* @__PURE__ */ m.jsxs("div", { className: `prim-voices-container ${a}`, style: {
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "0 auto"
  }, children: [
    /* @__PURE__ */ m.jsx("div", { style: {
      height: "10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "5px",
      overflow: "hidden",
      marginBottom: "16px"
    }, children: /* @__PURE__ */ m.jsx("div", { style: {
      height: "100%",
      backgroundColor: j ? "#4CAF50" : "#4a90e2",
      borderRadius: "5px",
      transition: "width 0.1s ease-out",
      ...B()
    } }) }),
    /* @__PURE__ */ m.jsx("div", { className: `prim-voices-message ${h}`, style: {
      padding: "16px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      marginBottom: "16px",
      minHeight: "60px"
    }, children: v }),
    g && /* @__PURE__ */ m.jsx("div", { className: `prim-voices-error ${c}`, style: {
      padding: "8px",
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderRadius: "4px",
      marginBottom: "16px"
    }, children: g }),
    /* @__PURE__ */ m.jsx(
      "button",
      {
        className: `prim-voices-button ${d}`,
        onClick: U,
        style: {
          padding: "12px 24px",
          border: "none",
          borderRadius: "4px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          ...$()
        },
        children: _()
      }
    ),
    /* @__PURE__ */ m.jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px",
      fontSize: "12px",
      color: "#666"
    }, children: [
      /* @__PURE__ */ m.jsx("div", { children: k ? "✓ Connected" : "✗ Disconnected" }),
      /* @__PURE__ */ m.jsx("div", { children: A ? "🔊 Playing" : "" })
    ] })
  ] });
}, Ft = ({
  onMessage: s,
  onError: t,
  autoConnect: r = !1,
  welcomeMessage: o = "Hello! How can I help you today?",
  agentName: a = "Assistant",
  userName: d = "You",
  containerClassName: h = "",
  chatClassName: c = "",
  buttonClassName: u = ""
}) => {
  const {
    connect: x,
    disconnect: b,
    startListening: w,
    stopListening: k,
    isConnected: j,
    isListening: A,
    isPlaying: R,
    messages: O,
    audioStats: g,
    error: v
  } = je(), [Y, U] = J([]), _ = q(null), $ = q(null), B = q(null);
  z(() => (r && !j && x(), o && U([{
    id: "welcome",
    text: o,
    isUser: !1,
    timestamp: /* @__PURE__ */ new Date()
  }]), () => {
    B.current !== null && cancelAnimationFrame(B.current);
  }), [r, x, j, o]), z(() => {
    if (O.length > 0) {
      const T = O[O.length - 1];
      U((E) => [
        ...E,
        {
          id: `agent-${Date.now()}`,
          text: T,
          isUser: !1,
          timestamp: /* @__PURE__ */ new Date()
        }
      ]), s && s(T);
    }
  }, [O, s]), z(() => {
    v && t && t(v);
  }, [v, t]), z(() => {
    _.current && (_.current.scrollTop = _.current.scrollHeight);
  }, [Y]);
  const G = async () => {
    if (!j) {
      x();
      return;
    }
    A ? k() : (await w(), U((T) => [
      ...T,
      {
        id: `user-${Date.now()}`,
        text: "🎤 Listening...",
        isUser: !0,
        timestamp: /* @__PURE__ */ new Date()
      }
    ]));
  };
  return z(() => {
    if (!$.current || !g)
      return;
    const T = $.current, E = T.getContext("2d");
    if (!E)
      return;
    const be = () => {
      const W = T.width, I = T.height;
      if (E.clearRect(0, 0, W, I), A) {
        const H = (g == null ? void 0 : g.level) || 0, Q = 3, N = 1, K = Math.floor(W / (Q + N)), X = I * 0.8, te = E.createLinearGradient(0, I, 0, 0);
        te.addColorStop(0, "#4a90e2"), te.addColorStop(1, "#64b5f6");
        const ne = E.createLinearGradient(0, I, 0, 0);
        ne.addColorStop(0, "#4CAF50"), ne.addColorStop(1, "#81C784"), E.fillStyle = g != null && g.isSpeaking ? ne : te;
        for (let Z = 0; Z < K; Z++) {
          const fe = Z * (Q + N), he = H * X, xe = Math.sin(Z * 0.2 + Date.now() * 5e-3) * he * 0.3, re = Math.max(2, he + xe);
          E.fillRect(fe, I - re, Q, re);
        }
      } else if (R) {
        const H = Date.now() * 1e-3, Q = 3;
        E.strokeStyle = "#4CAF50", E.lineWidth = 2, E.beginPath();
        for (let N = 0; N < W; N++) {
          const K = N / W, X = I / 2 + Math.sin(K * Math.PI * 2 * Q + H * 3) * (I * 0.2) + Math.sin(K * Math.PI * 2 * Q * 2 + H * 5) * (I * 0.05);
          N === 0 ? E.moveTo(N, X) : E.lineTo(N, X);
        }
        E.stroke();
      } else
        E.strokeStyle = "#ccc", E.lineWidth = 2, E.beginPath(), E.moveTo(0, I / 2), E.lineTo(W, I / 2), E.stroke();
    }, se = () => {
      be(), B.current = requestAnimationFrame(se);
    };
    return se(), () => {
      B.current !== null && cancelAnimationFrame(B.current);
    };
  }, [A, R, g]), /* @__PURE__ */ m.jsxs("div", { className: `prim-voices-advanced-container ${h}`, style: {
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
    /* @__PURE__ */ m.jsxs("div", { style: {
      padding: "16px",
      backgroundColor: "#f8f8f8",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ m.jsx("div", { style: { fontWeight: "bold" }, children: a }),
      /* @__PURE__ */ m.jsxs("div", { style: {
        fontSize: "12px",
        color: j ? "#4CAF50" : "#e25555",
        display: "flex",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ m.jsx("div", { style: {
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: j ? "#4CAF50" : "#e25555",
          marginRight: "4px"
        } }),
        j ? "Connected" : "Disconnected"
      ] })
    ] }),
    /* @__PURE__ */ m.jsxs(
      "div",
      {
        ref: _,
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
          Y.map((T) => /* @__PURE__ */ m.jsxs(
            "div",
            {
              style: {
                alignSelf: T.isUser ? "flex-end" : "flex-start",
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: T.isUser ? "18px 18px 0 18px" : "18px 18px 18px 0",
                backgroundColor: T.isUser ? "#E3F2FD" : "#f0f0f0",
                color: "#333",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
              },
              children: [
                /* @__PURE__ */ m.jsx("div", { style: {
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginBottom: "4px",
                  color: T.isUser ? "#1976D2" : "#555"
                }, children: T.isUser ? d : a }),
                /* @__PURE__ */ m.jsx("div", { children: T.text }),
                /* @__PURE__ */ m.jsx("div", { style: { fontSize: "10px", textAlign: "right", marginTop: "4px", color: "#888" }, children: T.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ]
            },
            T.id
          )),
          v && /* @__PURE__ */ m.jsx("div", { style: {
            alignSelf: "center",
            padding: "8px 16px",
            borderRadius: "16px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            fontSize: "12px",
            margin: "8px 0",
            maxWidth: "80%",
            textAlign: "center"
          }, children: v })
        ]
      }
    ),
    /* @__PURE__ */ m.jsx("div", { style: {
      padding: "8px 16px",
      borderTop: "1px solid #e0e0e0",
      backgroundColor: "#f8f8f8"
    }, children: /* @__PURE__ */ m.jsx(
      "canvas",
      {
        ref: $,
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
    /* @__PURE__ */ m.jsxs("div", { style: {
      padding: "16px",
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }, children: [
      /* @__PURE__ */ m.jsx(
        "button",
        {
          className: `prim-voices-button ${u}`,
          onClick: G,
          style: {
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: A ? "#e25555" : "#4CAF50",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
          },
          children: A ? /* @__PURE__ */ m.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ m.jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2" }) }) : /* @__PURE__ */ m.jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ m.jsx("path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }),
            /* @__PURE__ */ m.jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
            /* @__PURE__ */ m.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" })
          ] })
        }
      ),
      /* @__PURE__ */ m.jsx("div", { style: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "14px",
        color: "#757575"
      }, children: A ? `Listening... ${g != null && g.isSpeaking ? "Speech detected" : "Waiting for speech"}` : "Click the microphone button to start speaking" })
    ] })
  ] });
};
export {
  Ft as AdvancedAudioConversation,
  Mt as BasicAudioConversation,
  Wt as HeadlessAudioConversation,
  Dt as PrimVoicesProvider,
  jt as WebSocketClient,
  je as usePrimVoices
};
//# sourceMappingURL=index.es.js.map
