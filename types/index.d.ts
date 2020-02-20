export default class AudioTrackMixer {
    private audioContext;
    private destinationNode;
    private cache;
    constructor();
    addTrack(track: MediaStreamTrack): AudioTrackMixer;
    removeTrack(track: MediaStreamTrack): AudioTrackMixer;
    getTracks(): Array<MediaStreamTrack>;
    getMixedTrack(): MediaStreamTrack;
    getMixedMediaStream(): MediaStream;
    destroy(): Promise<void>;
    static getTracks(stream: MediaStream): Array<MediaStreamTrack>;
}
