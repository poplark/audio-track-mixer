const AudioContextClass = <typeof AudioContext>((<any>window).AudioContext || (<any>window).webkitAudioContext || (<any>window).mozAudioContext || (<any>window).msAudioContext || (<any>window).oAudioContext);

interface TrackCache {
  track: MediaStreamTrack
  mediaStream: MediaStream
  sourceNode: MediaStreamAudioSourceNode
  gainNode: GainNode
}

const BASE = 128;

// todo - use decorator to validate track

export default class AudioTrackMixer {
  private audioContext: AudioContext
  private destinationNode: MediaStreamAudioDestinationNode
  private caches: Map<string, TrackCache> = new Map()

  private analyser: AnalyserNode
  private timeDomainData: Uint8Array

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

    this.analyser = this.audioContext.createAnalyser();
    this.timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
    this.destinationNode.connect(this.analyser);

    // hack - safari 浏览器（desktop, mobile未知) 切换屏幕时，Audio 被关闭的问题
    this.audioContext.onstatechange = () => {
      if (<any>this.audioContext.state === 'interrupted') {
        this.audioContext.resume();
      }
    }
  }

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

  setTrackVolume(track: MediaStreamTrack, volume: number): boolean {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const cache: TrackCache | undefined = this.caches.get(track.id);

    if (cache) {
      cache.gainNode.gain.value = volume / 100;
    }
    return false;
  }

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

  getTracks(): Array<MediaStreamTrack> {
    const tracks: Array<MediaStreamTrack> = [];
    this.caches.forEach(function (cache: TrackCache) {
      tracks.push(cache.track);
    });
    return tracks;
  }

  getMixedTrack(): MediaStreamTrack {
    return this.destinationNode.stream.getAudioTracks()[0];
  }

  getMixedTrackVolume(): number {
    let max = 0;
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(this.timeDomainData);
      this.timeDomainData.forEach(item => {
        max = Math.max(max, Math.abs(item - BASE));
      });
    }
    return max / BASE;
  }

  getMixedMediaStream(): MediaStream {
    return this.destinationNode.stream;
  }

  destroy(): Promise<void> {
    this.caches.forEach((cache: TrackCache) => {
      cache.gainNode.disconnect(this.destinationNode);
      cache.sourceNode.disconnect(cache.gainNode);
    });
    this.caches.clear();
    return this.audioContext.close();
  }

  static getTracks(stream: MediaStream): Array<MediaStreamTrack> {
    return stream.getAudioTracks();
  }
}
