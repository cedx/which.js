#!/usr/bin/env node
import l from"node:console";import{readFileSync as y}from"node:fs";import{EOL as x}from"node:os";import f from"node:process";import{parseArgs as w}from"node:util";import{stat as m}from"node:fs/promises";import{delimiter as d,extname as u,resolve as g}from"node:path";import n from"node:process";var r=class i{extensions;paths;constructor(t={}){let{extensions:e=[],paths:o=[]}=t;if(!e.length){let s=n.env.PATHEXT??"";e=s?s.split(";"):[".exe",".cmd",".bat",".com"]}if(!o.length){let s=n.env.PATH??"";o=s?s.split(i.isWindows?";":d):[]}this.extensions=e.map(s=>s.toLowerCase()),this.paths=o.map(s=>s.replace(/^"|"$/g,"")).filter(s=>s.length)}static get isWindows(){return n.platform=="win32"||["cygwin","msys"].includes(n.env.OSTYPE??"")}async*find(t){for(let e of this.paths)yield*this.#s(e,t)}async isExecutable(t){try{let e=await m(t);return e.isFile()&&(i.isWindows?this.#t(t):this.#e(e))}catch{return!1}}#t(t){return this.extensions.includes(u(t).toLowerCase())}#e(t){let e=t.mode;if(e&1)return!0;let o=typeof n.getgid=="function"?n.getgid():-1;if(e&8)return o==t.gid;let s=typeof n.getuid=="function"?n.getuid():-1;return e&64?s==t.uid:e&72?s==0:!1}async*#s(t,e){for(let o of["",...i.isWindows?this.extensions:[]]){let s=g(t,`${e}${o}`);await this.isExecutable(s)&&(yield s)}}};import{delimiter as p}from"node:path";var a=class{#t;#e;constructor(t,e){this.#t=t,this.#e=e}async all(){let t=[];for await(let e of this.stream())t.includes(e)||t.push(e);if(t.length)return t;throw Error(`No "${this.#t}" in (${this.#e.paths.join(r.isWindows?";":p)}).`)}async first(){let{value:t}=await this.stream().next();if(t)return t;throw Error(`No "${this.#t}" in (${this.#e.paths.join(r.isWindows?";":p)}).`)}stream(){return this.#e.find(this.#t)}};function c(i,t={}){return new a(i,new r(t))}var b=`
Find the instances of an executable in the system path.

Usage:
  which [options] <command>

Arguments:
  command        The name of the executable to find.

Options:
  -a, --all      List all executable instances found (instead of just the first one).
  -s, --silent   Silence the output, just return the exit code (0 if any executable is found, otherwise 1).
  -h, --help     Display this help.
  -v, --version  Output the version number.
`,h=!1;try{let{positionals:i,values:t}=w({allowPositionals:!0,options:{all:{short:"a",type:"boolean",default:!1},help:{short:"h",type:"boolean",default:!1},silent:{short:"s",type:"boolean",default:!1},version:{short:"v",type:"boolean",default:!1}}});if(h=t.silent??!1,t.help||t.version){let{version:s}=JSON.parse(y(new URL("../package.json",import.meta.url),"utf8"));l.log(t.version?s:b.trim()),f.exit(0)}i.length||(l.error("You must provide the name of a command to find."),f.exit(1));let e=c(i[0]),o=await(t.all?e.all():e.first());h||l.log(Array.isArray(o)?o.join(x):o)}catch(i){h||l.error(i instanceof Error?i.message:i),f.exitCode=1}
