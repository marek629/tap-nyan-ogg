import {createReadStream as $8weU6$createReadStream} from "fs";
import {stat as $8weU6$stat} from "fs/promises";
import {Transform as $8weU6$Transform, PassThrough as $8weU6$PassThrough} from "stream";
import $8weU6$path from "path";
import {cwd as $8weU6$cwd, argv as $8weU6$argv} from "process";
import $8weU6$suldashiogg from "@suldashi/ogg";
import {dirname as $8weU6$dirname} from "dirname-filename-esm";
import $8weU6$speaker from "speaker";
import $8weU6$vorbis from "vorbis";

import { filename } from 'dirname-filename-esm'



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


var $d7a64e258a00fcba$import_meta = Object.assign(Object.create(null), {
    url: "file://" + filename(import.meta)
});
const $d7a64e258a00fcba$var$config = {
    observer: (0, $ca37bfd0324037b5$export$f416f9931619449a)
};
process.on("message", ({ kind: kind , value: value  })=>{
    switch(kind){
        case "tap-stream-observer-state":
            $d7a64e258a00fcba$var$config.observer = JSON.parse(value);
            break;
        default:
            break;
    }
});
let $d7a64e258a00fcba$var$n = 0;
const $d7a64e258a00fcba$var$tremolo = ({ ChunkBuffer: ChunkBuffer , lfo: lfo  })=>new (0, $8weU6$Transform)({
        transform: (chunk, encoding, callback)=>{
            const { observer: observer  } = $d7a64e258a00fcba$var$config;
            if (observer.isValid) {
                callback(null, chunk);
                return;
            }
            const array = new ChunkBuffer(chunk.buffer);
            callback(null, new Uint8Array(array.map((sample)=>sample * lfo.at($d7a64e258a00fcba$var$n++)).buffer));
        }
    });
function $d7a64e258a00fcba$var$play(file) {
    const decoder = new (0, $8weU6$suldashiogg).Decoder();
    decoder.on("stream", (stream)=>{
        const vd = new (0, $8weU6$vorbis).Decoder();
        vd.on("format", (format)=>{
            const ChunkBuffer = (0, $7eabf566f9ac704a$export$822607f76a6b1170)(format);
            const lfo = new (0, $da0ad21a5678331e$export$230d30512a20bd9b)({
                sampling: format.sampleRate,
                frequency: 3
            });
            vd.pipe($d7a64e258a00fcba$var$tremolo({
                ChunkBuffer: ChunkBuffer,
                lfo: lfo
            })).pipe(new (0, $8weU6$speaker)(format));
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


