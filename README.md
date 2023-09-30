# tap-ogg

TAP reporter with support playing OGG sound files during TAP stream is producing.
Since the first error occured, it produces mutated audio stream.

It takes TAP stream from standard input, plays sound to the speakers based on the given input, and finally sends unchanged input to the standard output.

As input, you can produce TAP stream in many ways. For example:

* single TAP producer like [ava](https://www.npmjs.com/package/ava), [node.js](https://nodejs.org/dist/latest-v20.x/docs/api/test.html) etc.
* a dedicated tool like [@tap-ogg/tap-merge](https://www.npmjs.com/package/@tap-ogg/tap-merge)
* merging stream build on connection [concurrently](https://www.npmjs.com/package/concurrently) and [tap-merge](https://www.npmjs.com/package/tap-merge)

As output, you can use raw TAP stream, or you can use some TAP consumer.
In my opinion, a funny option is [tap-nyan](https://www.npmjs.com/package/@tap-ogg/tap-nyan) for report visualisation.

## Installation

Using NPM:

```
npm i tap-ogg
```

Using yarn:

```
yarn add tap-ogg
```

## Configuration

Audio mutation effects can be configured in YAML formatted file.
Configuration is read from `config.yml` from current working directory, if it exists.
Otherwise is used default values.
You can start your configuration by generation own file:

```
tap-ogg --defaults > config.yml
```

Feel free to experiment by changing effect parameters values while sound mutating.
The changes will be applied and you can hear it immediately after configuration file, as it's watched on file system.

## CLI Options

```
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -d, --defaults  Print default configuration values                   [boolean]
  -c, --config    YAML configuration file path  [string] [default: "config.yml"]
  -a, --audio     Sound file path. Default is nyan cat song.            [string]
  -s, --silence   Do not play any sound.                               [boolean]
  -v, --volume    Set percent value of sound volume in range [0-100]
                                                         [number] [default: 100]
```

## Nyan Cat Song

Default song that `tap-ogg` plays is got from [The Internet Archive](https://archive.org/details/nyannyannyan).

Original author of this song is daniwell.
You can follow this artist on [Twitter](https://twitter.com/daniwell_aidn) or visit their [website](https://aidn.jp/daniwell/).
