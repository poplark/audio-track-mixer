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
  private cache: Map<string, TrackCache> = new Map()

  constructor() {
    this.audioContext = new AudioContextClass();
    this.destinationNode = this.audioContext.createMediaStreamDestination();
  }

  addTrack(track: MediaStreamTrack): AudioTrackMixer {
    if (!track.kind || track.kind !== 'audio') {
      throw new Error('not an audio track');
    }
    const mediaStream: MediaStream = new MediaStream();
    mediaStream.addTrack(track);
    const sourceNode: MediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(mediaStream);
    const gainNode: GainNode = this.audioContext.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(this.destinationNode);
    this.cache.set(track.id, {
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
    const cache: TrackCache | undefined = this.cache.get(track.id);

    if (cache) {
      cache.gainNode.disconnect(this.destinationNode);
      cache.sourceNode.disconnect(cache.gainNode);
      this.cache.delete(track.id);
    }
    return this;
  }

  getTracks(): Array<MediaStreamTrack> {
    const tracks: Array<MediaStreamTrack> = [];
    this.cache.forEach(function (item: TrackCache) {
      tracks.push(item.track);
    });
    return tracks;
  }

  getMixedTrack(): MediaStreamTrack {
    return this.destinationNode.stream.getAudioTracks()[0];
  }

  getMixedMediaStream(): MediaStream {
    return this.destinationNode.stream;
  }

  static getTracks(stream: MediaStream): Array<MediaStreamTrack> {
    return stream.getAudioTracks();
  }
}