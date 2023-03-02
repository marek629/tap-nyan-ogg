#!/usr/bin/env node

import {spawn as $7VbkM$spawn, fork as $7VbkM$fork} from "child_process";
import {pipeline as $7VbkM$pipeline, PassThrough as $7VbkM$PassThrough} from "stream";
import {resolve as $7VbkM$resolve, dirname as $7VbkM$dirname1} from "path";
import {dirname as $7VbkM$dirname} from "dirname-filename-esm";

import { filename } from 'dirname-filename-esm'




import $7VbkM$eventstream from "event-stream";
import $7VbkM$tapmerge from "tap-merge";
import $7VbkM$tapnyan from "tap-nyan";
import $7VbkM$yargs from "yargs";
import {isDeepStrictEqual as $7VbkM$isDeepStrictEqual} from "util";
import $7VbkM$events from "events";
import $7VbkM$fspromises from "fs/promises";
import {mergeDeepRight as $7VbkM$mergeDeepRight} from "ramda";
import $7VbkM$yaml from "yaml";
import {exit as $7VbkM$exit, env as $7VbkM$env} from "process";
















const $b5f246dd37abe703$export$842c7f1d8282385d = Object.seal({
    exit: $7VbkM$exit,
    readFile: (0, $7VbkM$fspromises).readFile
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
const $b5f246dd37abe703$export$b99b6f6e38298768 = new (0, $7VbkM$events);
const $b5f246dd37abe703$var$watchFile = async ()=>{
    const { configFilePath: configFilePath  } = (0, $7VbkM$env);
    if (!configFilePath) {
        console.error("wrong path from process:", process.argv);
        return;
    }
    for await (const { filename: filename  } of (0, $7VbkM$fspromises).watch((0, $7VbkM$dirname1)(configFilePath)))if (filename === configFilePath) $b5f246dd37abe703$export$b99b6f6e38298768.emit("change");
};
if ((0, $7VbkM$env).isAudioProcess) $b5f246dd37abe703$var$watchFile();
const $b5f246dd37abe703$export$72c04af63de9061a = async ()=>{
    const { configFilePath: configFilePath  } = (0, $7VbkM$env);
    const { exit: exit , readFile: readFile  } = $b5f246dd37abe703$export$842c7f1d8282385d;
    try {
        const code = await readFile(configFilePath, "utf-8");
        if (code.trim() === "") return {};
        return (0, $7VbkM$yaml).parse(code);
    } catch (e) {
        if (e.code !== "ENOENT") {
            console.error(e);
            exit(4);
        }
        return {};
    }
};
const $b5f246dd37abe703$export$f2283db29a78ea0 = async (file, state)=>(0, $7VbkM$mergeDeepRight)((0, $7VbkM$mergeDeepRight)($b5f246dd37abe703$var$defaultSettings, await file()), state());
const $b5f246dd37abe703$export$a91807c918b9332e = ()=>(0, $7VbkM$yaml).stringify($b5f246dd37abe703$var$defaultSettings);


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
    if ($f9dfcc1caef9a121$var$cache.input.has(name) && (0, $7VbkM$isDeepStrictEqual)(data, $f9dfcc1caef9a121$var$cache.input.get(name))) return $f9dfcc1caef9a121$var$cache.result.get(name);
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
const { argv: $f7c04408f351be04$var$argv  } = (0, $7VbkM$yargs)(process.argv.slice(2)).locale("en").option("defaults", {
    alias: "d",
    demandOption: false,
    describe: "Print default configuration values",
    boolean: true,
    nargs: 0
}).option("config", {
    alias: "c",
    demandOption: false,
    describe: "YAML configuration file path",
    string: "true",
    nargs: 1,
    default: "config.yml"
}).option("producer", {
    alias: "p",
    demandOption: false,
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
if ($f7c04408f351be04$var$argv.defaults) {
    console.log((0, $b5f246dd37abe703$export$a91807c918b9332e)());
    process.exit(0);
}
if (!Array.isArray($f7c04408f351be04$var$argv.producer) || $f7c04408f351be04$var$argv.producer.length === 0) {
    console.log("Missing required argument: producer");
    process.exit(6);
}
const $f7c04408f351be04$var$spawnOptions = {
    stdio: [
        "ignore",
        "pipe",
        "pipe"
    ],
    shell: true
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
    // setting enviroment variable in main process
    // configFilePath would be consumed by audio process
    process.env.configFilePath = $f7c04408f351be04$var$argv.config;
    const controller = new AbortController();
    const audio = (0, $7VbkM$fork)((0, $7VbkM$resolve)((0, $7VbkM$dirname)($f7c04408f351be04$import_meta), "audio/play.js"), [
        $f7c04408f351be04$var$argv.audio,
        $f7c04408f351be04$var$volume
    ], {
        env: {
            ...process.env,
            isAudioProcess: true
        },
        signal: controller.signal
    });
    (0, $ab33a6f8be937191$export$7310cf3e5a42929c)($f7c04408f351be04$var$observer, audio);
    audio.on("error", (err)=>{
        if (err.code !== "ABORT_ERR") console.error(err);
    });
    await (0, $e1ffbe4efacf9784$export$5c069c93d2b7493f)($f7c04408f351be04$var$tasks);
    controller.abort();
} else await (0, $e1ffbe4efacf9784$export$5c069c93d2b7493f)($f7c04408f351be04$var$tasks);
process.exit(0);


