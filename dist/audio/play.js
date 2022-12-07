import {createReadStream as $8weU6$createReadStream} from "fs";
import {stat as $8weU6$stat} from "fs/promises";
import $8weU6$path from "path";
import {argv as $8weU6$argv, cwd as $8weU6$cwd, env as $8weU6$env} from "process";
import $8weU6$suldashiogg from "@suldashi/ogg";
import {dirname as $8weU6$dirname} from "dirname-filename-esm";
import $8weU6$vorbis from "vorbis";
import {Transform as $8weU6$Transform, pipeline as $8weU6$pipeline, PassThrough as $8weU6$PassThrough} from "stream";
import {takeCoverage as $8weU6$takeCoverage} from "v8";
import {throttle as $8weU6$throttle} from "debouncing";
import $8weU6$speaker from "speaker";

import { filename } from 'dirname-filename-esm'



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


const $da0ad21a5678331e$export$173bbe91bb23610 = ({ sampling: sampling , frequency: frequency , number: number  })=>2 * number * frequency * Math.PI / sampling;
class $da0ad21a5678331e$export$230d30512a20bd9b {
    #sampling = 44100;
    #frequency = 20;
    constructor({ sampling: sampling , frequency: frequency  }){
        this.#sampling = sampling;
        this.#frequency = frequency;
    }
    at(n) {
        return Math.sin($da0ad21a5678331e$export$173bbe91bb23610({
            sampling: this.#sampling,
            frequency: this.#frequency,
            number: n
        }));
    }
}




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




const $bdcd130d94b197f2$var$config = {
    observer: (0, $ca37bfd0324037b5$export$f416f9931619449a),
    process: process
};
class $bdcd130d94b197f2$export$973d64996e3474e3 {
    #n = 0;
    #observer;
    #process;
    get observerState() {
        return this.#observer;
    }
    constructor(cfg = $bdcd130d94b197f2$var$config){
        this.#observer = cfg.observer;
        this.#process = cfg.process;
        this.#process.on("message", ({ kind: kind , value: value  })=>{
            switch(kind){
                case "tap-stream-observer-state":
                    this.#observer = JSON.parse(value);
                    break;
                default:
                    break;
            }
        });
    }
    effect({ ChunkBuffer: ChunkBuffer , lfo: lfo  }) {
        return new (0, $8weU6$Transform)({
            transform: (chunk, encoding, callback)=>{
                if (this.#observer.isValid) {
                    callback(null, chunk);
                    return;
                }
                const array = new ChunkBuffer(chunk.buffer);
                callback(null, new Uint8Array(array.map((sample)=>sample * lfo.at(this.#n++)).buffer));
            }
        });
    }
}
const $bdcd130d94b197f2$export$3e98c3c57367b836 = (deps)=>{
    const instance = new $bdcd130d94b197f2$export$973d64996e3474e3;
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
const $de7bd2decba60b63$export$30f9dba7b373edd4 = (input, format, volumeLevel)=>{
    const ChunkBuffer = (0, $7eabf566f9ac704a$export$822607f76a6b1170)(format);
    const lfo = new (0, $da0ad21a5678331e$export$230d30512a20bd9b)({
        sampling: format.sampleRate,
        frequency: 3
    });
    const sequence = [
        input
    ];
    if ($de7bd2decba60b63$var$coverage) sequence.push($de7bd2decba60b63$var$coverage);
    if (volumeLevel < 1) sequence.push($de7bd2decba60b63$var$volume({
        ChunkBuffer: ChunkBuffer,
        level: volumeLevel
    }));
    sequence.push((0, $bdcd130d94b197f2$export$3e98c3c57367b836)({
        ChunkBuffer: ChunkBuffer,
        lfo: lfo
    }), new (0, $8weU6$speaker)(format));
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
        vd.on("format", (format)=>{
            (0, $de7bd2decba60b63$export$30f9dba7b373edd4)(vd, format, $d7a64e258a00fcba$var$volumeLevel);
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


