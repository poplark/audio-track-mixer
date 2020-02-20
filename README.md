# Audio Track Mixer

English | [中文](./README-zh_CN.md)

Mix audio tracks ([MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)) into one.

## Installation

### package manager

Install with `npm` or `yarn`

npm:

```shell
npm install audio-track-mixer --save
```

yarn:

```shell
yarn add audio-track-mixer
```

### script label

```html
<script src="index.js"></script>
```


## Importing

### ES6

```js
import AudioTrackMixer from './audio-track-mixer';
```

### ES5 with npm

```js
const AudioTrackMixer = require('audio-track-mixer');
```

### script

When use script label, AudioTrackMixer will be a global Object.


## Usage

```js
const mixer = new AudioTrackMixer();

mixer.addTrack(trackA);
mixer.addTrack(trackB);

const mixedTrack = mixer.getMixedTrack();
```


## API


## Methods of AudioTrackMixer

### 1. constructor

The constructor of the AudioTrackMixer class.

```js
const mixer = new AudioTrackMixer();
```

#### parameters

no parameters

#### return values

- mixer
  - type: AudioTrackMixer
  - description: The method will return an AudioTrackMixer object.


### 2. addTrack

Add audio track into the mixer.

```js
mixer.addTrack(track);
```

#### parameters

- track
  - type: MediaStreamTrack
  - description: The kind of MediaStreamTrack must 'audio', or it will throw an Error.

#### return values

- mixer
  - type: AudioTrackMixer
  - description: The method will return mixer itself to support the chain call.


#### examples

```js
mixer.addTrack(trackA);
mixer.addTrack(trackB);
```

It's a chain function, so you can also use it just like this

```js
mixer.addTrack(trackA).addTrack(trackB);
```

### 3. getMixedTrack

Get mixed audio track from the mixer after adding tracks.

```js
const track = mixer.getMixedTrack();
```

#### parameters

no parameters

#### return values

- track
  - type: MediaStreamTrack
  - description: -


### 4. removeTrack

Remove audio track if it has been already added into the mixer or will do nothing.

```js
mixer.removeTrack(track);
```

#### parameters

- track
  - type: MediaStreamTrack
  - description: The kind of MediaStreamTrack must 'audio', or it will throw an Error. And the track must has been already added, or it will do nothing.

#### return values

- mixer
  - type: AudioTrackMixer
  - description: The method will return mixer itself to support the chain call.

#### examples

```js
mixer.removeTrack(trackA);
mixer.removeTrack(trackB);
```

It's a chain function, so you can also use it just like this

```js
mixer.removeTrack(trackA).removeTrack(trackB)
```


### 5. getTracks

Get all added audio tracks from the mixer. (not include the mixed one).

```js
const tracks = mixer.getTracks();
```

#### parameters

no parameters

#### return values

- tracks
  - type: Array
  - description: An array of MediaStreamTrack with kind 'audio'.


### 6. getMixedMediaStream

Get media stream which contains mixed audio track. 

```js
const stream = mixer.getMixedMediaStream();
```

#### parameters

no parameters

#### return values

- stream
  - type: MediaStream
  - description: see [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)


## Static methods of AudioTrackMixer

### 1. getTracks

Get all audio tracks from a media stream.
[MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream).

```js
const tracks = AudioTrackMixer.getTracks(stream);
```

#### parameters

- stream
  - type: MediaStream
  - description: see [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)

#### return values

- tracks
  - type: Array
  - description: An array of MediaStreamTrack with kind 'audio'.
