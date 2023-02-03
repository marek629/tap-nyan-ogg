# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

### Changed

- sound effects was expanded by echo effect

### Fixed

- shell context for child processes run as `--producer` CLI parameter
- `--silence` option working


## [0.3.0] - 2022-11-20

### Added

- `--volume` CLI switch for volume control


## [0.2.0] - 2022-11-01

### Added

- sound effects on failing tests


## [0.1.1] - 2022-01-23

### Fixed

- current working directory issues
- ERR_MODULE_NOT_FOUND issue while playing audio file


## [0.1.0] - 2021-12-31

### Added

- TAP stream producers support
- `--tap` CLI switch for producing TAP output instead of nyan cat animation
- `--audio` CLI parameter for passing another file to play
- `--silence` CLI switch for do not play any sound


[unreleased]: https://github.com/marek629/tap-nyan-ogg
[0.3.0]: https://www.npmjs.com/package/tap-ogg/v/0.3.0
[0.2.0]: https://www.npmjs.com/package/tap-ogg/v/0.2.0
[0.1.1]: https://www.npmjs.com/package/tap-ogg/v/0.1.1
[0.1.0]: https://www.npmjs.com/package/tap-ogg/v/0.1.0
