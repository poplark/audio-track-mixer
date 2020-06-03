# 音轨合并器

[English](./README.md) | 中文

将多个音频轨道（[MediaStreamTrack](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack)）合并成一个。

## 安装

### 使用包管理器

用 `npm` 或 `yarn` 安装

npm:

```shell
npm install audio-track-mixer --save
```

yarn:

```shell
yarn add audio-track-mixer
```

### 在页面中直接使用 script 标签导入

```html
<script src="index.js"></script>
```


## 项目中导入方式

### ES6 规范

```js
import AudioTrackMixer from 'audio-track-mixer';
```

### npm 的 ES5 规范

```js
const AudioTrackMixer = require('audio-track-mixer');
```

### script 标签方式

使用 script 标签方式导入时，AudioTrackMixer 将是一个全局对象，可直接使用。


## 使用方法

```js
const mixer = new AudioTrackMixer();

mixer.addTrack(trackA);
mixer.addTrack(trackB);

const mixedTrack = mixer.getMixedTrack();
```


## API

### 查看全部 [APIS](https://poplark.github.io/audio-track-mixer/).

### AudioTrackMixer 一些基本的方法

#### 1. addTrack 方法

将一个音频轨道添加到合并器中。

##### 示例 

```js
mixer.addTrack(trackA);
mixer.addTrack(trackB);
```

由于它是一个链式调用函数，所以你也可以像下面那样调用

```js
mixer.addTrack(trackA).addTrack(trackB);
```

#### 2. getMixedTrack 方法

从合并器中获取被添加的音频轨道。

##### 示例 

```js
const track = mixer.getMixedTrack();
```

#### 3. removeTrack 方法

移除被添加的音频轨道（合并的音轨将自动移除该被删除的音频轨道的音效）。

##### 示例

```js
mixer.removeTrack(trackA);
mixer.removeTrack(trackB);
```

由于它是一个链式调用函数，所以你也可以像下面那样调用

```js
mixer.removeTrack(trackA).removeTrack(trackB)
```

#### 4. destroy 方法

清除合并器内的缓存等，以销毁此合并器。

##### 示例

```js
const result = mixer.destroy();
```
