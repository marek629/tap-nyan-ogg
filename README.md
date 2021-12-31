# tap-ogg

TAP reporter with support playing OGG sound files during TAP stream is producing.
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

## CLI Options

```
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -p, --producer  Executable of TAP stream producer. Could be used more than one
                   time.                                      [array] [required]
  -a, --audio     Sound file path. Default is nyan cat song.            [string]
  -s, --silence   Do not play any sound.                               [boolean]
  -t, --tap       Produce TAP output instead of nyan cat animation.    [boolean]
```

## Nyan Cat Song

Default song that `tap-ogg` plays is got from [The Internet Archive](https://archive.org/details/nyannyannyan).

Original author of this song is daniwell.
You can follow this artist on [Twitter](https://twitter.com/daniwell_aidn) or visit their [website](https://aidn.jp/daniwell/).
