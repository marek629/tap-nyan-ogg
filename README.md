# tap-ogg

TAP reporter with support playing OGG sound files during TAP stream is producing.
Since the first error occured, it produces mutated audio stream.

It uses [tap-nyan](https://github.com/LKay/tap-nyan) for report visualisation.

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
  -p, --producer  Executable of TAP stream producer. Could be used more than one
                   time.                                      [array] [required]
  -a, --audio     Sound file path. Default is nyan cat song.            [string]
  -s, --silence   Do not play any sound.                               [boolean]
  -v, --volume    Set percent value of sound volume in range [0-100]
                                                         [number] [default: 100]
  -t, --tap       Produce TAP output instead of nyan cat animation.    [boolean]
```

## Nyan Cat Song

Default song that `tap-ogg` plays is got from [The Internet Archive](https://archive.org/details/nyannyannyan).

Original author of this song is daniwell.
You can follow this artist on [Twitter](https://twitter.com/daniwell_aidn) or visit their [website](https://aidn.jp/daniwell/).
