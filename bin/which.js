#!/usr/bin/env node
import c from"node:console";import{EOL as x}from"node:os";import w from"node:process";import{parseArgs as b}from"node:util";var p={bugs:"https://github.com/cedx/which.js/issues",description:"Find the instances of an executable in the system path. Like the `which` Linux command.",homepage:"https://docs.belin.io/which.js",license:"MIT",name:"@cedx/which",repository:"cedx/which.js",type:"module",version:"8.1.0",author:{email:"cedric@belin.io",name:"C\xE9dric Belin",url:"https://belin.io"},bin:{which:"./bin/which.js"},devDependencies:{"@types/eslint__js":"^8.42.3","@types/gulp":"^4.0.17","@types/node":"^20.12.2",del:"^7.1.0",esbuild:"^0.20.2",eslint:"^8.57.0",execa:"^8.0.1",gulp:"^5.0.0",typedoc:"^0.25.12",typescript:"^5.4.3","typescript-eslint":"^7.4.0"},engines:{node:">=20.0.0"},exports:{types:"./lib/index.d.ts",import:"./lib/index.js"},files:["lib/","src/"],keywords:["find","path","system","utility","which"],scripts:{prepack:"gulp",start:"gulp build && node bin/which.js --help",test:"gulp build && node --test --test-reporter=spec"}};import{stat as m}from"node:fs/promises";import{delimiter as u,extname as g,resolve as y}from"node:path";import o from"node:process";var r=class s{extensions;paths;constructor(e={}){let{extensions:t=[],paths:n=[]}=e;if(!t.length){let i=o.env.PATHEXT??"";t=i?i.split(";"):[".exe",".cmd",".bat",".com"]}if(!n.length){let i=o.env.PATH??"";n=i?i.split(s.isWindows?";":u):[]}this.extensions=t.map(i=>i.toLowerCase()),this.paths=n.map(i=>i.replace(/^"|"$/g,"")).filter(i=>i.length)}static get isWindows(){return o.platform=="win32"||["cygwin","msys"].includes(o.env.OSTYPE??"")}async*find(e){for(let t of this.paths)yield*this.#i(t,e)}async isExecutable(e){try{let t=await m(e);return t.isFile()&&(s.isWindows?this.#e(e):this.#t(t))}catch{return!1}}#e(e){return this.extensions.includes(g(e).toLowerCase())}#t(e){let t=e.mode;if(t&1)return!0;let n=typeof o.getgid=="function"?o.getgid():-1;if(t&8)return n==e.gid;let i=typeof o.getuid=="function"?o.getuid():-1;return t&64?i==e.uid:t&72?i==0:!1}async*#i(e,t){for(let n of["",...s.isWindows?this.extensions:[]]){let i=y(e,`${t}${n}`);await this.isExecutable(i)&&(yield i)}}};import{delimiter as d}from"node:path";var a=class{#e;#t;constructor(e,t){this.#e=e,this.#t=t}async all(){let e=[];for await(let t of this.stream())e.includes(t)||e.push(t);if(e.length)return e;throw Error(`No "${this.#e}" in (${this.#t.paths.join(r.isWindows?";":d)}).`)}async first(){let{value:e}=await this.stream().next();if(e)return e;throw Error(`No "${this.#e}" in (${this.#t.paths.join(r.isWindows?";":d)}).`)}stream(){return this.#t.find(this.#e)}};function l(s,e={}){return new a(s,new r(e))}var h=!1,v=`
Find the instances of an executable in the system path.

Usage:
  npx @cedx/which [options] <command>

Arguments:
  command        The name of the executable to find.

Options:
  -a, --all      List all executable instances found (instead of just the first one).
  -s, --silent   Silence the output, just return the exit code (0 if any executable is found, otherwise 1).
  -h, --help     Display this help.
  -v, --version  Output the version number.
`;async function j(){let{positionals:s,values:e}=b({allowPositionals:!0,options:{all:{short:"a",type:"boolean",default:!1},help:{short:"h",type:"boolean",default:!1},silent:{short:"s",type:"boolean",default:!1},version:{short:"v",type:"boolean",default:!1}}});if(e.help||e.version)return c.log(e.version?p.version:v.trim());if(!s.length)throw Error("You must provide the name of a command to find.");h=e.silent??!1;let t=l(s[0]),n=await(e.all?t.all():t.first());h||c.log(Array.isArray(n)?n.join(x):n)}j().catch(s=>{h||c.error(s instanceof Error?s.message:s),w.exitCode=1});
