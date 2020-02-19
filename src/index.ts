const AudioContextClass = <typeof AudioContext>((<any>window).AudioContext || (<any>window).webkitAudioContext || (<any>window).mozAudioContext || (<any>window).msAudioContext || (<any>window).oAudioContext);

interface TrackCache {
  track: MediaStreamTrack
  mediaStream: MediaStream
  sourceNode: MediaStreamAudioSourceNode
  gainNode: GainNode
}

export default class AudioTrackMixer {
  private audioContext: AudioContext
  private destinationNode: MediaStreamAudioDestinationNode
  private caches: Map<string, TrackCache> = new Map()

  constructor() {
    this.audioContext = new AudioContextClass();
    this.destinationNode = this.audioContext.createMediaStreamDestination();
  }

  addTrack(track: MediaStreamTrack): AudioTrackMixer {
    const mediaStream: MediaStream = new MediaStream();
    mediaStream.addTrack(track);
    const sourceNode: MediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(mediaStream);
    const gainNode: GainNode = this.audioContext.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(this.destinationNode);
    this.caches[track.id] = {
      track,
      mediaStream,
      sourceNode,
      gainNode
    }
    return this;
  }

  removeTrack(track: MediaStreamTrack): AudioTrackMixer {
    const cache: TrackCache | undefined = this.caches[track.id];

    if (cache) {
      cache.gainNode.disconnect(this.destinationNode);
      cache.sourceNode.disconnect(cache.gainNode);
    }
    this.caches.delete(track.id);
    return this;
  }

  getTracks(): Array<MediaStreamTrack> {
    const tracks: Array<MediaStreamTrack> = [];
    this.caches.forEach(function (item: TrackCache) {
      tracks.push(item.track);
    });
    return tracks;
  }

  getMixedTrack(): MediaStreamTrack {
    return this.destinationNode.stream.getAudioTracks()[0];
  }
}