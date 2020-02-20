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
    static getTracks(stream: MediaStream): Array<MediaStreamTrack>;
}
