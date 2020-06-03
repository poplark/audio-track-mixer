/**
 * @ignore
 */
const AudioContextClass = <typeof AudioContext>((window as any).AudioContext || (window as any).webkitAudioContext || (window as any).mozAudioContext || (window as any).msAudioContext || (window as any).oAudioContext);

/**
 * @ignore
 */
interface TrackCache {
  track: MediaStreamTrack
  mediaStream: MediaStream
  sourceNode: MediaStreamAudioSourceNode
  gainNode: GainNode
}

/**
 * @ignore
 */
const BASE = 128;

// todo - use decorator to validate track

/**
 * @example
 * ```
 * import AudioTrackMixer from 'audio-track-mixer';
 * ```
 */
export default class AudioTrackMixer {
  private audioContext: AudioContext;
  private destinationNode: MediaStreamAudioDestinationNode;
  private caches: Map<string, TrackCache> = new Map();

  private analyserSourceNode: MediaStreamAudioSourceNode;
  private analyser: AnalyserNode
  private timeDomainData: Uint8Array

  /**
   * The constructor function
   * 
   * @returns An AudioTrackMixer object
   * @throws Will throw an error if the environment does not support to mix audio track
   * @example
   * ```
   * const mixer = new AudioTrackMixer();
   * ```
   */
  constructor() {
    if (!AudioContextClass) {
      throw new Error('the environment doesnot support to mix audio track');
    }

    this.audioContext = new AudioContextClass();

    // some browser may not support to mix audio track, such as Edge 18.xxx
    if (!this.audioContext.createMediaStreamDestination
      || typeof this.audioContext.createMediaStreamDestination !== 'function') {
      throw new Error('the environment doesnot support to mix audio track');
    }

    this.destinationNode = this.audioContext.createMediaStreamDestination();

    const outStream = this.destinationNode.stream;
    this.analyserSourceNode = this.audioContext.createMediaStreamSource(outStream);
    this.analyser = this.audioContext.createAnalyser();
    this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyserSourceNode.connect(this.analyser);

    // hack - safari 浏览器（desktop, mobile未知) 切换屏幕时，Audio 被关闭的问题
    this.audioContext.onstatechange = () => {
      if ((this.audioContext as any).state === 'interrupted') {
        this.audioContext.resume();
      }
    }
  }

  /**
   * Add an audio track ([MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)) into the mixer
   * 
   * @param track - An audio track
   * @returns The method will return the mixer itself to support the chain invoke.
   * @throws Will throw an error if the track is not an audio kind MediaStreamTrack
   * @throws Will throw an error if the track has already been added into the mixer
   * @example
   * ```
   * mixer.addTrack(trackA);
   * mixer.addTrack(trackB);
   * ```
   * 
   * **Note**
   * 
   * It's also a chain function, so you can also use it just like:
   * 
   * ```
   * mixer.addTrack(trackA).addTrack(trackB);
   * ```
   */
  addTrack(track: MediaStreamTrack): AudioTrackMixer {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const cache: TrackCache | undefined = this.caches.get(track.id);
    if (cache) {
      throw new Error(`audio track (id: ${track.id}) has already been added`);
    }

    const mediaStream: MediaStream = new MediaStream();
    mediaStream.addTrack(track);
    const sourceNode: MediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(mediaStream);
    const gainNode: GainNode = this.audioContext.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(this.destinationNode);
    this.caches.set(track.id, {
      track,
      mediaStream,
      sourceNode,
      gainNode
    });
    return this;
  }

  /**
   * Remove an audio track from the mixer
   * 
   * @param track - The audio track added into the mixer
   * @returns The method will return the mixer itself to support the chain invoke.
   * @throws Will throw an error if the track is not an audio kind MediaStreamTrack
   * @example
   * ```
   * mixer.removeTrack(trackA);
   * mixer.removeTrack(trackB);
   * ```
   * 
   * **Note**
   * 
   * It's also a chain function, so you can also use it just like:
   * 
   * ```
   * mixer.removeTrack(trackA).removeTrack(trackB);
   * ```
   */
  removeTrack(track: MediaStreamTrack): AudioTrackMixer {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const cache: TrackCache | undefined = this.caches.get(track.id);

    if (cache) {
      cache.gainNode.disconnect(this.destinationNode);
      cache.sourceNode.disconnect(cache.gainNode);
      this.caches.delete(track.id);
    }
    return this;
  }

  /**
   * Set volume of the track added into the mixer
   * 
   * @param track - The track added into the mixer
   * @param volume - Volume range [0, 100]
   * @throws Will throw an error if the track is not an audio kind MediaStreamTrack
   * 
   * @example
   * ```
   * mixer.setTrackVolume(trackA, 50);
   * ```
   */
  setTrackVolume(track: MediaStreamTrack, volume: number): void {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const cache: TrackCache | undefined = this.caches.get(track.id);

    if (cache) {
      cache.gainNode.gain.value = volume / 100;
    }
  }

  /**
   * Mute the track added into the mixer
   * 
   * @param track - The track added into the mixer
   * @returns True if mute successfully, False when failure
   * @throws Will throw an error if the track is not an audio kind MediaStreamTrack
   * 
   * @example
   * ```
   * const result = mixer.muteTrack(trackA);
   * ```
   */
  muteTrack(track: MediaStreamTrack): boolean {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const cache: TrackCache | undefined = this.caches.get(track.id);
    if (cache) {
      cache.track.enabled = false;
      return true;
    }
    return false;
  }

  /**
   * Unmute the track added into the mixer
   * 
   * @param track - The track added into the mixer
   * @returns True if unmute successfully, False when failure
   * @throws Will throw an error if the track is not an audio kind MediaStreamTrack
   * 
   * @example
   * ```
   * const result = mixer.unmuteTrack(trackA);
   * ```
   */
  unmuteTrack(track: MediaStreamTrack): boolean {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const cache: TrackCache | undefined = this.caches.get(track.id);
    if (cache) {
      cache.track.enabled = true;
      return true;
    }
    return false;
  }

  /**
   * Get all tracks added into the mixer. (not the mixed one).
   * 
   * @returns All tracks added into the mixer
   * @example
   * ```
   * const tracks = mixer.getTracks();
   * ```
   */
  getTracks(): Array<MediaStreamTrack> {
    const tracks: Array<MediaStreamTrack> = [];
    this.caches.forEach(function (cache: TrackCache) {
      tracks.push(cache.track);
    });
    return tracks;
  }

  /**
   * Get the mixed track from the mixer after adding tracks.
   * 
   * @returns The mixed audio track
   * @example
   * ```
   * const mixedTrack = mixer.getMixedTrack();
   * ```
   */
  getMixedTrack(): MediaStreamTrack {
    return this.destinationNode.stream.getAudioTracks()[0];
  }

  /**
   * Get the volume of the mixed track
   * 
   * @returns Volume range [0, 100]
   * @example
   * ```
   * const volume = mixer.getMixedTrackVolume();
   * ```
   */
  getMixedTrackVolume(): number {
    let max = 0;
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(this.timeDomainData);
      this.timeDomainData.forEach(item => {
        max = Math.max(max, Math.abs(item - BASE));
      });
    }
    return Math.floor((max / BASE) * 100);
  }

  /**
   * Get media stream which contains mixed audio track
   * 
   * @returns The media stream includes the mixed audio track, you can play it directly
   * @example
   * ```
   * audio.srcObject = mixer.getMixedMediaStream(); // audio is an Audio object
   * ```
   */
  getMixedMediaStream(): MediaStream {
    return this.destinationNode.stream;
  }

  /**
   * Clear cache of the mixer and destroy it.
   *
   * @returns An promise
   * @example
   * ```
   * mixer
   *  .destroy()
   *  .catch(err => {
   *    ...
   *  });
   * ```
   */
  destroy(): Promise<void> {
    this.caches.forEach((cache: TrackCache) => {
      cache.gainNode.disconnect(this.destinationNode);
      cache.sourceNode.disconnect(cache.gainNode);
    });
    this.caches.clear();
    return this.audioContext.close();
  }

  /**
   * Sometimes, you may get a [MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream), this function will extract all audio tracks from the MediaStream
   * 
   * @param stream A source MediaStream
   * @returns An Array of audio kind MediaStreamTrack
   * @example
   * ```
   * const audioTracks = AudioTrackMixer.getTracks(stream);
   * ```
   */
  static getTracks(stream: MediaStream): Array<MediaStreamTrack> {
    return stream.getAudioTracks();
  }
}

/**
 * The version of AudioTrackMixer
 * 
 * @example
 * ```
 * import { version } from 'audio-track-mixer';
 * ```
 */
//@ts-ignore
const version: string = __VERSION__;

export { version };
