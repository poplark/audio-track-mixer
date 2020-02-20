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
import AudioTrackMixer from './audio-track-mixer';
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


### AudioTrackMixer 的方法

#### 1. 构造函数

AudioTrackMixer 类的构造器。


```js
const mixer = new AudioTrackMixer();
```

##### 参数

无参数

##### 返回值

- mixer
  - 类型: AudioTrackMixer
  - 描述: 方法将返回一个 AudioTrackMixer 对象。


#### 2. addTrack 方法

将一个音频轨道添加到合并器中。

```js
mixer.addTrack(track);
```

##### 参数 

- track
  - 类型: MediaStreamTrack
  - 描述: MediaStreamTrack 的 kind 值必须是 'audio'，否则方法将抛出一个错误。

##### 返回值

- mixer
  - 类型: AudioTrackMixer
  - 描述: 该方法将返回合并器自身，以支持链式调用。


##### 示例 

```js
mixer.addTrack(trackA);
mixer.addTrack(trackB);
```

由于它是一个链式调用函数，所以你也可以像下面那样调用

```js
mixer.addTrack(trackA).addTrack(trackB);
```

#### 3. getMixedTrack 方法

从合并器中获取被添加的音频轨道。


```js
const track = mixer.getMixedTrack();
```

##### 参数 

无参数

##### 返回值

- track
  - 类型: MediaStreamTrack
  - 描述: -


#### 4. removeTrack 方法

移除被添加的音频轨道（合并的音轨将自动移除该被删除的音频轨道的音效）。

```js
mixer.removeTrack(track);
```

##### 参数

- track
  - 类型: MediaStreamTrack
  - 描述: MediaStreamTrack 的 kind 值必须是 'audio'，否则方法将抛出一个错误，如果音频轨道没有被添加过，那么将不处理该音频轨道。

##### 返回值

- mixer
  - 类型: AudioTrackMixer
  - 描述: 该方法将返回合并器自身，以支持链式调用。

##### 示例

```js
mixer.removeTrack(trackA);
mixer.removeTrack(trackB);
```

由于它是一个链式调用函数，所以你也可以像下面那样调用

```js
mixer.removeTrack(trackA).removeTrack(trackB)
```


#### 5. getTracks 方法

获取所有被添加到合并器的音频轨道。

```js
const tracks = mixer.getTracks();
```

##### 参数

无参数

##### 返回值

- tracks
  - 类型: Array
  - 描述: 返回值是包含若干个音频轨道的数组


#### 6. getMixedMediaStream 方法

获取包含合并后的音频轨道的媒体流。

```js
const stream = mixer.getMixedMediaStream();
```

##### 参数

无参数

##### 返回值

- stream
  - 类型: MediaStream
  - 描述: 参见 [MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)


#### 7. destroy 方法

清除合并器内的缓存等，以销毁此合并器。

```js
const result = mixer.destroy();
```

> 最好获取结果抛出的错误以防止应用崩溃，就像这样处理：```result.then(function() { ... }).catch(function(err) { ... })```

#### 参数

无参数

#### 返回值

- result
  - 类型: Promise
  - 描述: -


### AudioTrackMixer 的静态方法

#### 1. getTracks

从一个媒体流中提取出所有的音频轨道。 媒体流参见 [MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream).

```js
const tracks = AudioTrackMixer.getTracks(stream);
```

##### 参数

- stream
  - 类型: MediaStream
  - 描述: 参见 [MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)

##### 返回值

- tracks
  - 类型: Array
  - 描述: 返回值是包含若干个音频轨道的数组
