export default class AudioTrackMixer {
    private audioContext;
    private destinationNode;
    private caches;
    constructor();
    addTrack(track: MediaStreamTrack): AudioTrackMixer;
    removeTrack(track: MediaStreamTrack): AudioTrackMixer;
    getTracks(): Array<MediaStreamTrack>;
    getMixedTrack(): MediaStreamTrack | undefined;
}
