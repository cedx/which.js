#!/usr/bin/env node
import l from"node:console";import{EOL as w}from"node:os";import u from"node:process";import{parseArgs as j}from"node:util";var h={bugs:"https://github.com/cedx/which.js/issues",description:"Find the instances of an executable in the system path. Like the `which` Linux command.",homepage:"https://github.com/cedx/which.js",license:"MIT",name:"@cedx/which",repository:"cedx/which.js",type:"module",version:"8.1.0",author:{email:"cedric@belin.io",name:"C\xE9dric Belin",url:"https://belin.io"},bin:{which:"./bin/which.js"},devDependencies:{"@types/node":"^20.11.7","@typescript-eslint/eslint-plugin":"^6.19.1","@typescript-eslint/parser":"^6.19.1",esbuild:"^0.19.12",eslint:"^8.56.0",typedoc:"^0.25.7",typescript:"^5.3.3"},engines:{node:">=20.0.0"},exports:{types:"./lib/index.d.ts",import:"./lib/index.js"},files:["lib/","src/"],imports:{"#which":{types:"./lib/index.d.ts",import:"./lib/index.js"}},keywords:["find","path","system","utility","which"],scripts:{build:"tsc --project src/tsconfig.json && esbuild --allow-overwrite --bundle --format=esm --legal-comments=none --log-level=warning --minify --outfile=bin/which.js --platform=node src/cli/main.ts",clean:"node tool/clean.js",dist:"npm run clean && npm run build && node tool/dist.js && git update-index --chmod=+x bin/which.js",doc:"typedoc --options etc/typedoc.js && node tool/doc.js",lint:"tsc --project tsconfig.json && eslint --config=etc/eslint.cjs example src test tool",postpublish:"node tool/publish.js",prepack:"npm run dist",start:"npm run build && node bin/which.js --help",test:"npm run build && node --test --test-reporter=spec"}};var d=`
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
`;import{stat as g}from"node:fs/promises";import{delimiter as y,extname as b,resolve as x}from"node:path";import o from"node:process";var r=class s{extensions;paths;constructor(t={}){let{extensions:e=[],paths:n=[]}=t;if(!e.length){let i=o.env.PATHEXT??"";e=i?i.split(";"):[".exe",".cmd",".bat",".com"]}if(!n.length){let i=o.env.PATH??"";n=i?i.split(s.isWindows?";":y):[]}this.extensions=e.map(i=>i.toLowerCase()),this.paths=n.map(i=>i.replace(/^"|"$/g,"")).filter(i=>i.length)}static get isWindows(){return o.platform=="win32"||["cygwin","msys"].includes(o.env.OSTYPE??"")}async*find(t){for(let e of this.paths)yield*this.#i(e,t)}async isExecutable(t){try{let e=await g(t);return e.isFile()&&(s.isWindows?this.#t(t):this.#e(e))}catch{return!1}}#t(t){return this.extensions.includes(b(t).toLowerCase())}#e(t){let e=t.mode;if(e&1)return!0;let n=typeof o.getgid=="function"?o.getgid():-1;if(e&8)return n==t.gid;let i=typeof o.getuid=="function"?o.getuid():-1;return e&64?i==t.uid:e&72?i==0:!1}async*#i(t,e){for(let n of["",...s.isWindows?this.extensions:[]]){let i=x(t,`${e}${n}`);await this.isExecutable(i)&&(yield i)}}};import{delimiter as m}from"node:path";var a=class{#t;#e;constructor(t,e){this.#t=t,this.#e=e}async all(){let t=[];for await(let e of this.stream())t.includes(e)||t.push(e);if(t.length)return t;throw Error(`No "${this.#t}" in (${this.#e.paths.join(r.isWindows?";":m)}).`)}async first(){let{value:t}=await this.stream().next();if(t)return t;throw Error(`No "${this.#t}" in (${this.#e.paths.join(r.isWindows?";":m)}).`)}stream(){return this.#e.find(this.#t)}};function c(s,t={}){return new a(s,new r(t))}var p=!1;async function v(){let{positionals:s,values:t}=j({allowPositionals:!0,options:{all:{short:"a",type:"boolean"},help:{short:"h",type:"boolean"},silent:{short:"s",type:"boolean"},version:{short:"v",type:"boolean"}}});if(t.help||t.version)return l.log(t.version?h.version:d.trim()),0;if(!s.length)return l.error("You must provide the name of a command to find."),1;p=t.silent??!1;let e=c(s[0]),n=await(t.all?e.all():e.first());return p||l.log(Array.isArray(n)?n.join(w):n),0}v().then(s=>u.exitCode=s,s=>{p||l.error(s instanceof Error?s.message:s),u.exitCode=1});
