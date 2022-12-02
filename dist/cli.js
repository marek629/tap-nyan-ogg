#!/usr/bin/env node

import {spawn as $7VbkM$spawn, fork as $7VbkM$fork} from "child_process";
import {pipeline as $7VbkM$pipeline, PassThrough as $7VbkM$PassThrough} from "stream";
import {resolve as $7VbkM$resolve} from "path";
import {dirname as $7VbkM$dirname} from "dirname-filename-esm";
import $7VbkM$eventstream from "event-stream";
import $7VbkM$tapmerge from "tap-merge";
import $7VbkM$tapnyan from "tap-nyan";
import $7VbkM$yargs from "yargs";

import { filename } from 'dirname-filename-esm'



const $ca37bfd0324037b5$export$f416f9931619449a = Object.freeze({
    isValid: true
});
class $ca37bfd0324037b5$export$44abddc3fd19288a extends (0, $7VbkM$PassThrough) {
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




const $e1676ca97a562b8b$export$8c2dc7716bef61cc = (obj)=>Object.entries(Object.getOwnPropertyDescriptors(obj.__proto__)).filter(([name, item])=>typeof item.get === "function").map(([name])=>name);


const $ab33a6f8be937191$var$sendObserverState = (observer, audio)=>audio.send({
        kind: "tap-stream-observer-state",
        value: JSON.stringify(observer, (0, $e1676ca97a562b8b$export$8c2dc7716bef61cc)(observer))
    });
const $ab33a6f8be937191$export$7310cf3e5a42929c = (observer, audio)=>{
    $ab33a6f8be937191$var$sendObserverState(observer, audio);
    observer.on("changed", ()=>$ab33a6f8be937191$var$sendObserverState(observer, audio));
};


const $e1ffbe4efacf9784$export$5c069c93d2b7493f = (tasks)=>new Promise((resolve)=>{
        let counter = tasks.length;
        const listener = (...args)=>{
            if (--counter === 0) resolve(tasks);
        };
        tasks.forEach((t)=>{
            t.once("finish", listener);
        });
        // fallback checking tasks
        const intervalId = setInterval(function() {
            if (tasks.every((t)=>t.exitCode !== null)) {
                clearInterval(intervalId);
                resolve(tasks);
            }
        }, 500);
    });


var $f7c04408f351be04$import_meta = Object.assign(Object.create(null), {
    url: "file://" + filename(import.meta)
});
const { argv: $f7c04408f351be04$var$argv  } = (0, $7VbkM$yargs)(process.argv.slice(2)).locale("en").option("producer", {
    alias: "p",
    demandOption: true,
    describe: "Executable of TAP stream producer. Could be used more than one time.",
    string: true,
    array: true
}).option("audio", {
    alias: "a",
    demandOption: false,
    describe: "Sound file path. Default is nyan cat song.",
    string: true,
    nargs: 1
}).option("silence", {
    alias: "s",
    demandOption: false,
    describe: "Do not play any sound.",
    boolean: true,
    nargs: 0
}).option("volume", {
    alias: "v",
    demandOption: false,
    describe: "Set percent value of sound volume in range [0-100]",
    number: true,
    nargs: 1,
    default: 100
}).option("tap", {
    alias: "t",
    demandOption: false,
    describe: "Produce TAP output instead of nyan cat animation.",
    boolean: true,
    nargs: 0
});
const $f7c04408f351be04$var$spawnOptions = {
    stdio: [
        "ignore",
        "pipe",
        "pipe"
    ]
};
const $f7c04408f351be04$var$tasks = $f7c04408f351be04$var$argv.producer.map((cmd)=>cmd.split(" ")).map(([cmd, ...args])=>(0, $7VbkM$spawn)(cmd, args, $f7c04408f351be04$var$spawnOptions));
const $f7c04408f351be04$var$observer = new (0, $ca37bfd0324037b5$export$44abddc3fd19288a);
const $f7c04408f351be04$var$sources = [
    (0, $7VbkM$eventstream).merge($f7c04408f351be04$var$tasks.map((proc)=>proc.stdout)),
    (0, $7VbkM$tapmerge)(),
    $f7c04408f351be04$var$observer
];
if (!$f7c04408f351be04$var$argv.tap) $f7c04408f351be04$var$sources.push((0, $7VbkM$tapnyan)());
(0, $7VbkM$pipeline)([
    ...$f7c04408f351be04$var$sources,
    process.stdout
], ()=>{});
const $f7c04408f351be04$var$volume = parseInt($f7c04408f351be04$var$argv.volume, 10);
if ($f7c04408f351be04$var$volume < 0 || $f7c04408f351be04$var$volume > 100) {
    console.error(`Volume should be in range 0-100. Given value was ${$f7c04408f351be04$var$volume}.`);
    process.exit(2);
}
if (!$f7c04408f351be04$var$argv.silence && $f7c04408f351be04$var$volume > 0) {
    const controller = new AbortController();
    const audio = (0, $7VbkM$fork)((0, $7VbkM$resolve)((0, $7VbkM$dirname)($f7c04408f351be04$import_meta), "audio/play.js"), [
        $f7c04408f351be04$var$argv.audio,
        $f7c04408f351be04$var$volume
    ], {
        signal: controller.signal
    });
    (0, $ab33a6f8be937191$export$7310cf3e5a42929c)($f7c04408f351be04$var$observer, audio);
    audio.on("error", (err)=>{
        if (err.code !== "ABORT_ERR") console.error(err);
    });
    await (0, $e1ffbe4efacf9784$export$5c069c93d2b7493f)($f7c04408f351be04$var$tasks);
    controller.abort();
}


