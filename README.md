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
import AudioTrackMixer from 'audio-track-mixer';
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

### See full [APIs](https://poplark.github.io/audio-track-mixer/).

### Some Basic Methods of AudioTrackMixer

#### 1. addTrack

Add audio track into the mixer.

##### examples

```js
mixer.addTrack(trackA);
mixer.addTrack(trackB);
```

It's a chain function, so you can also use it just like this

```js
mixer.addTrack(trackA).addTrack(trackB);
```

#### 2. getMixedTrack

Get mixed audio track from the mixer after adding tracks.

##### examples

```js
const track = mixer.getMixedTrack();
```

#### 3. removeTrack

Remove audio track if it has been already added into the mixer or will do nothing.

##### examples

```js
mixer.removeTrack(trackA);
mixer.removeTrack(trackB);
```

It's a chain function, so you can also use it just like this

```js
mixer.removeTrack(trackA).removeTrack(trackB);
```

#### 4. destroy

Clear cache of the mixer to destroy it.

##### examples

```js
const result = mixer.destroy();
```
