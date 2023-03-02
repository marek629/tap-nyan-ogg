import {createReadStream as $8weU6$createReadStream} from "fs";

import { filename } from 'dirname-filename-esm'




import $8weU6$fspromises, {stat as $8weU6$stat} from "fs/promises";
import $8weU6$path, {dirname as $8weU6$dirname1} from "path";
import {argv as $8weU6$argv, cwd as $8weU6$cwd, env as $8weU6$env, exit as $8weU6$exit} from "process";
import $8weU6$suldashiogg from "@suldashi/ogg";
import {dirname as $8weU6$dirname} from "dirname-filename-esm";
import $8weU6$vorbis from "vorbis";
import {Transform as $8weU6$Transform, pipeline as $8weU6$pipeline, PassThrough as $8weU6$PassThrough} from "stream";
import {takeCoverage as $8weU6$takeCoverage} from "v8";
import {throttle as $8weU6$throttle} from "debouncing";
import $8weU6$speaker from "speaker";
import {isDeepStrictEqual as $8weU6$isDeepStrictEqual} from "util";
import $8weU6$events from "events";
import {mergeDeepRight as $8weU6$mergeDeepRight} from "ramda";
import $8weU6$yaml from "yaml";
import {Queue as $8weU6$Queue} from "@datastructures-js/queue";




















const $b5f246dd37abe703$export$842c7f1d8282385d = Object.seal({
    exit: $8weU6$exit,
    readFile: (0, $8weU6$fspromises).readFile
});
const $b5f246dd37abe703$var$defaultSettings = Object.freeze({
    effect: {
        echo: {
            enabled: true,
            size: 8000,
            gain: 0.85
        },
        tremolo: {
            enabled: true,
            lfo: {
                frequency: 33,
                sampling: 8000
            }
        }
    }
});
const $b5f246dd37abe703$export$b99b6f6e38298768 = new (0, $8weU6$events);
const $b5f246dd37abe703$var$watchFile = async ()=>{
    const { configFilePath: configFilePath  } = (0, $8weU6$env);
    if (!configFilePath) {
        console.error("wrong path from process:", process.argv);
        return;
    }
    for await (const { filename: filename  } of (0, $8weU6$fspromises).watch((0, $8weU6$dirname1)(configFilePath)))if (filename === configFilePath) $b5f246dd37abe703$export$b99b6f6e38298768.emit("change");
};
if ((0, $8weU6$env).isAudioProcess) $b5f246dd37abe703$var$watchFile();
const $b5f246dd37abe703$export$72c04af63de9061a = async ()=>{
    const { configFilePath: configFilePath  } = (0, $8weU6$env);
    const { exit: exit , readFile: readFile  } = $b5f246dd37abe703$export$842c7f1d8282385d;
    try {
        const code = await readFile(configFilePath, "utf-8");
        if (code.trim() === "") return {};
        return (0, $8weU6$yaml).parse(code);
    } catch (e) {
        if (e.code !== "ENOENT") {
            console.error(e);
            exit(4);
        }
        return {};
    }
};
const $b5f246dd37abe703$export$f2283db29a78ea0 = async (file, state)=>(0, $8weU6$mergeDeepRight)((0, $8weU6$mergeDeepRight)($b5f246dd37abe703$var$defaultSettings, await file()), state());
const $b5f246dd37abe703$export$a91807c918b9332e = ()=>(0, $8weU6$yaml).stringify($b5f246dd37abe703$var$defaultSettings);


const $5c6fcfd5b50ea5d0$var$store = {
    format: {
        sampleRate: 44100
    }
};
const $5c6fcfd5b50ea5d0$export$825f8f0ad33951e4 = (state)=>{
    for(const key in state)$5c6fcfd5b50ea5d0$var$store[key] = state[key];
};
const $5c6fcfd5b50ea5d0$export$50fdfeece43146fd = ()=>$5c6fcfd5b50ea5d0$var$store;


const $f9dfcc1caef9a121$var$deliverConfiguration = ()=>(0, $b5f246dd37abe703$export$f2283db29a78ea0)((0, $b5f246dd37abe703$export$72c04af63de9061a), (0, $5c6fcfd5b50ea5d0$export$50fdfeece43146fd));
const $f9dfcc1caef9a121$export$842c7f1d8282385d = {
    deliverConfiguration: $f9dfcc1caef9a121$var$deliverConfiguration
};
const $f9dfcc1caef9a121$var$cache = Object.seal({
    input: new Map(),
    result: new Map()
});
const $f9dfcc1caef9a121$export$25a7e7a5abf9696a = async (name, selector, factory)=>{
    const { deliverConfiguration: deliverConfiguration  } = $f9dfcc1caef9a121$export$842c7f1d8282385d;
    const config = await deliverConfiguration();
    const data = selector(config);
    if ($f9dfcc1caef9a121$var$cache.input.has(name) && (0, $8weU6$isDeepStrictEqual)(data, $f9dfcc1caef9a121$var$cache.input.get(name))) return $f9dfcc1caef9a121$var$cache.result.get(name);
    const value = factory(data);
    $f9dfcc1caef9a121$var$cache.input.set(name, data);
    $f9dfcc1caef9a121$var$cache.result.set(name, value);
    return value;
};
const $f9dfcc1caef9a121$export$d2adf65b87e47523 = ()=>{
    for(const key in $f9dfcc1caef9a121$var$cache){
        const map = $f9dfcc1caef9a121$var$cache[key];
        map.clear();
    }
};






const $7eabf566f9ac704a$export$822607f76a6b1170 = ({ bitDepth: bitDepth , float: float , signed: signed  })=>{
    if (float) {
        if (signed) switch(bitDepth){
            case 32:
                return Float32Array;
            case 64:
                return Float64Array;
            default:
                throw new Error("Unsupported float bit depth!");
        }
    }
    if (signed) switch(bitDepth){
        case 8:
            return Int8Array;
        case 16:
            return Int16Array;
        case 32:
            return Int32Array;
        case 64:
            return BigInt64Array;
        default:
            throw new Error("Unsupported signed integer bit depth!");
    }
    switch(bitDepth){
        case 8:
            return Uint8Array;
        case 16:
            return Uint16Array;
        case 32:
            return Uint32Array;
        case 64:
            return BigUint64Array;
        default:
            throw new Error("Unsupported unsigned integer bit depth!");
    }
};







const $ca37bfd0324037b5$export$f416f9931619449a = Object.freeze({
    isValid: true
});
class $ca37bfd0324037b5$export$44abddc3fd19288a extends (0, $8weU6$PassThrough) {
    #errorOccured = false;
    #errorRegex = /^\s*not ok \d+ - /im;
    #buffer = "";
    constructor(options = {}){
        super(options);
    }
    get isValid() {
        return !this.#errorOccured;
    }
    _transform(chunk, encoding, callback) {
        if (this.#errorRegex.test(this._string(chunk))) {
            const oldFlag = this.#errorOccured;
            this.#errorOccured = true;
            if (this.#errorOccured !== oldFlag) this.emit("changed");
        }
        super._transform(chunk, encoding, callback);
    }
    _string(chunk) {
        const str = chunk.toString();
        const lastBreakLineIndex = str.lastIndexOf("\n");
        if (lastBreakLineIndex >= 0) {
            const lines = this.#buffer + str.slice(0, lastBreakLineIndex);
            this.#buffer = str.slice(lastBreakLineIndex);
            return lines;
        }
        return this.#buffer += str.slice(0);
    }
}




const $495e610db69ccfec$var$config = {
    observer: (0, $ca37bfd0324037b5$export$f416f9931619449a),
    process: process,
    watcher: (0, $b5f246dd37abe703$export$b99b6f6e38298768)
};
class $495e610db69ccfec$export$a32b0b1c1ac59d04 {
    enabled;
    observer;
    watcher;
    process;
    get observerState() {
        return this.observer;
    }
    constructor(cfg = $495e610db69ccfec$var$config){
        this.enabled = false;
        this.observer = cfg.observer;
        this.watcher = cfg.watcher;
        this.watcher.on("change", this.setup.bind(this));
        this.process = cfg.process;
        this.process.on("message", ({ kind: kind , value: value  })=>{
            switch(kind){
                case "tap-stream-observer-state":
                    this.observer = JSON.parse(value);
                    break;
                default:
                    break;
            }
        });
    }
    mix(a, b) {
        return a + b - a * b;
    }
    get isDisabled() {
        return !this.enabled || this.observer.isValid;
    }
    effect({ ChunkBuffer: ChunkBuffer  }) {
        return new (0, $8weU6$Transform)({
            transform: (chunk, encoding, callback)=>{
                if (this.isDisabled) {
                    callback(null, chunk);
                    return;
                }
                const array = new ChunkBuffer(chunk.buffer);
                callback(null, new Uint8Array(array.map(this.sampleMapper.bind(this)).buffer));
            }
        });
    }
}
const $495e610db69ccfec$export$f66d476873aa7f00 = (v)=>v;


const $f078c4e85cad0dff$export$842c7f1d8282385d = Object.seal({
    deliver: $f9dfcc1caef9a121$export$25a7e7a5abf9696a
});
const $f078c4e85cad0dff$var$echoSelector = ({ effect: { echo: { enabled: enabled , gain: gain , size: size  }  }  })=>({
        enabled: enabled,
        gain: gain,
        size: size
    });
class $f078c4e85cad0dff$export$95f5f2a91e6b436d extends (0, $495e610db69ccfec$export$a32b0b1c1ac59d04) {
    gain;
    queue;
    async setup() {
        const { deliver: deliver  } = $f078c4e85cad0dff$export$842c7f1d8282385d;
        const { enabled: enabled , gain: gain , size: size  } = await deliver("effect.echo", $f078c4e85cad0dff$var$echoSelector, (0, $495e610db69ccfec$export$f66d476873aa7f00));
        this.enabled = enabled;
        this.gain = gain;
        this.queue = new (0, $8weU6$Queue)(new Array(size).fill(1));
    }
    sampleMapper(sample) {
        const value = this.queue.dequeue();
        this.queue.enqueue(sample);
        return this.mix(sample, value * this.gain);
    }
}
const $f078c4e85cad0dff$export$d6d05aea2a3e8977 = async (deps)=>{
    const instance = new $f078c4e85cad0dff$export$95f5f2a91e6b436d;
    await instance.setup();
    return instance.effect(deps);
};



const $29b2f5703799abd1$export$173bbe91bb23610 = ({ sampling: sampling , frequency: frequency , number: number  })=>2 * number * frequency * Math.PI / sampling;
class $29b2f5703799abd1$export$230d30512a20bd9b {
    #sampling = 44100;
    #frequency = 20;
    constructor({ sampling: sampling , frequency: frequency  }){
        this.#sampling = sampling;
        this.#frequency = frequency;
    }
    at(n) {
        return Math.sin($29b2f5703799abd1$export$173bbe91bb23610({
            sampling: this.#sampling,
            frequency: this.#frequency,
            number: n
        }));
    }
}



const $906fc1c1c6a5f2b2$export$842c7f1d8282385d = Object.seal({
    deliver: $f9dfcc1caef9a121$export$25a7e7a5abf9696a
});
const $906fc1c1c6a5f2b2$export$fb8d7aff166c482 = ({ effect: { tremolo: { lfo: lfo  }  } , format: format  })=>{
    if (!Object.hasOwn(lfo, "frequency")) throw new RangeError("frequency must be configured in tremolo effect");
    var ref;
    const sampling = (ref = format === null || format === void 0 ? void 0 : format.sampleRate) !== null && ref !== void 0 ? ref : lfo.sampling;
    return {
        ...lfo,
        sampling: sampling
    };
};
const $906fc1c1c6a5f2b2$export$c86e31794080fa42 = ({ frequency: frequency , sampling: sampling  })=>new (0, $29b2f5703799abd1$export$230d30512a20bd9b)({
        sampling: sampling,
        frequency: frequency
    });
const $906fc1c1c6a5f2b2$export$a55a9e806096b2f = ({ effect: { tremolo: { enabled: enabled  }  }  })=>enabled;
class $906fc1c1c6a5f2b2$export$973d64996e3474e3 extends (0, $495e610db69ccfec$export$a32b0b1c1ac59d04) {
    n = 0;
    lfo;
    async setup() {
        const { deliver: deliver  } = $906fc1c1c6a5f2b2$export$842c7f1d8282385d;
        this.lfo = await deliver("LowFrequencyOscilator", $906fc1c1c6a5f2b2$export$fb8d7aff166c482, $906fc1c1c6a5f2b2$export$c86e31794080fa42);
        this.enabled = await deliver("effect.tremolo.enabled", $906fc1c1c6a5f2b2$export$a55a9e806096b2f, (0, $495e610db69ccfec$export$f66d476873aa7f00));
    }
    sampleMapper(input) {
        return this.mix(input, this.lfo.at(this.n++));
    }
}
const $906fc1c1c6a5f2b2$export$3e98c3c57367b836 = async (deps)=>{
    const instance = new $906fc1c1c6a5f2b2$export$973d64996e3474e3;
    await instance.setup();
    return instance.effect(deps);
};




const $de7bd2decba60b63$var$volume = ({ ChunkBuffer: ChunkBuffer , level: level  })=>new (0, $8weU6$Transform)({
        transform: (chunk, encoding, callback)=>{
            const array = new ChunkBuffer(chunk.buffer);
            callback(null, new Uint8Array(array.map((sample)=>sample * level).buffer));
        }
    });
const $de7bd2decba60b63$var$flushCoverage = (0, $8weU6$throttle)((0, $8weU6$takeCoverage), 120);
const $de7bd2decba60b63$var$coverage = (0, $8weU6$env).NODE_V8_COVERAGE ? new (0, $8weU6$Transform)({
    transform: (chunk, _, callback)=>{
        callback(null, chunk);
        $de7bd2decba60b63$var$flushCoverage();
    }
}) : null;
const $de7bd2decba60b63$export$30f9dba7b373edd4 = async (input, format, volumeLevel)=>{
    (0, $5c6fcfd5b50ea5d0$export$825f8f0ad33951e4)({
        format: format
    });
    const ChunkBuffer = (0, $7eabf566f9ac704a$export$822607f76a6b1170)(format);
    const deps = {
        ChunkBuffer: ChunkBuffer
    };
    const sequence = [
        input
    ];
    if ($de7bd2decba60b63$var$coverage) sequence.push($de7bd2decba60b63$var$coverage);
    if (volumeLevel < 1) sequence.push($de7bd2decba60b63$var$volume({
        ...deps,
        level: volumeLevel
    }));
    sequence.push(await (0, $f078c4e85cad0dff$export$d6d05aea2a3e8977)(deps), await (0, $906fc1c1c6a5f2b2$export$3e98c3c57367b836)(deps), new (0, $8weU6$speaker)(format));
    return (0, $8weU6$pipeline)(sequence, ()=>{});
};


var $d7a64e258a00fcba$import_meta = Object.assign(Object.create(null), {
    url: "file://" + filename(import.meta)
});
const $d7a64e258a00fcba$var$volumeLevel = parseInt((0, $8weU6$argv)[3], 10) / 100;
function $d7a64e258a00fcba$var$play(file) {
    const decoder = new (0, $8weU6$suldashiogg).Decoder();
    decoder.on("stream", (stream)=>{
        const vd = new (0, $8weU6$vorbis).Decoder();
        vd.on("format", async (format)=>{
            await (0, $de7bd2decba60b63$export$30f9dba7b373edd4)(vd, format, $d7a64e258a00fcba$var$volumeLevel);
        });
        stream.pipe(vd);
        stream.on("end", ()=>{
            $d7a64e258a00fcba$var$play(file);
        });
    });
    decoder.on("error", (err)=>{
        console.log({
            err: err
        });
    });
    decoder.on("close", ()=>{
        console.log("on close");
    });
    (0, $8weU6$createReadStream)(file).pipe(decoder);
}
const $d7a64e258a00fcba$var$filePath = async (file)=>{
    if (file && file !== "undefined") {
        const fp = (0, $8weU6$path).resolve((0, $8weU6$cwd)(), file);
        const info = await (0, $8weU6$stat)(fp);
        if (info.isFile()) return fp;
    }
    return (0, $8weU6$path).resolve((0, $8weU6$dirname)($d7a64e258a00fcba$import_meta), "../sound/nyan.ogg");
};
$d7a64e258a00fcba$var$play(await $d7a64e258a00fcba$var$filePath((0, $8weU6$argv)[2]));


