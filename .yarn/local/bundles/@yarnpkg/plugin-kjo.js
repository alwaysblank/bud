/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-kjo",
factory: function (require) {
var plugin=(()=>{var C=Object.create,m=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var K=Object.getOwnPropertyNames;var P=Object.getPrototypeOf,R=Object.prototype.hasOwnProperty;var S=e=>m(e,"__esModule",{value:!0});var s=e=>{if(typeof require!="undefined")return require(e);throw new Error('Dynamic require of "'+e+'" is not supported')};var A=(e,t)=>{for(var a in t)m(e,a,{get:t[a],enumerable:!0})},F=(e,t,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of K(t))!R.call(e,r)&&r!=="default"&&m(e,r,{get:()=>t[r],enumerable:!(a=O(t,r))||a.enumerable});return e},o=e=>F(S(m(e!=null?C(P(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var _={};A(_,{default:()=>W});var g=o(s("@yarnpkg/cli")),w=o(s("@yarnpkg/core")),$=o(s("@yarnpkg/shell")),n;(function(a){a[a.ERROR=1]="ERROR",a[a.OK=0]="OK"})(n||(n={}));var i=class extends g.BaseCommand{async getManifest(){return await w.Manifest.tryFind(this.context.cwd)}async $(t){let a;return console.log(`[kjo] ${t}`),a=await this.runTask(t),this.taskFailed(a)&&process.exit(1),Promise.resolve(0)}runTask(t){let[a,...r]=t.split(" ");return(0,$.execute)(a,r)}taskFailed(t){return Array.isArray(t)?t.filter(a=>a!==0).length>0:t!==0}async promiseOK(){return 0}};i.usage={category:"kjo"};var l=o(s("clipanion")),h=class extends i{constructor(){super(...arguments);this.cjs=l.Option.Boolean("-c,--cjs",!1);this.esm=l.Option.Boolean("-e,--esm",!1);this.clean=l.Option.Boolean("--clean",!1);this.force=l.Option.Boolean("--force",!1);this.verbose=l.Option.Boolean("--verbose",!0)}async execute(){let t=!this.cjs&&!this.esm;this.clean&&this.force&&console.error("--clean and --force are mutually exclusive"),this.clean&&(this.verbose=!1),(this.cjs||t)&&await this.$(`yarn tsc -b tsconfig.json${this.verbose?" --verbose":""}${this.clean?" --clean":""}${this.force?" --force":""}`),(this.esm||t)&&await this.$(`yarn tsc -b tsconfig.esm.json${this.verbose?" --verbose":""}${this.clean?" --clean":""}${this.force?" --force":""}`),!this.clean&&(await this.$("yarn kjo compile @roots/bud-dashboard"),await this.$("yarn kjo compile @roots/bud-support"))}};h.paths=[["kjo","build"]];var j=o(s("clipanion")),u=class extends i{constructor(){super(...arguments);this.dfx=j.Option.Boolean("-d,--dfx",!1)}async execute(){if(this.dfx){await this.$("git clean -dfx"),await this.$("yarn cache clean");return}await this.$("yarn rimraf packages/**/.budfiles"),await this.$("yarn rimraf examples/*/node_modules"),await this.$("yarn rimraf packages/@roots/*/lib"),await this.$("yarn rimraf packages/@roots/*/node_modules"),await this.$("yarn rimraf node_modules"),await this.$("yarn cache clean")}};u.paths=[["kjo","clean"]];var v=o(s("clipanion")),f=class extends i{constructor(){super(...arguments);this.package=v.Option.String()}async execute(){await this.$(`yarn ts-node ./dev/tasks/compile/cjs ${this.package}`),await this.$(`yarn ts-node ./dev/tasks/compile/esm ${this.package}`)}};f.paths=[["kjo","compile"]];var c=o(s("clipanion")),d=class extends i{constructor(){super(...arguments);this.all=c.Option.Boolean("-a,--all",!1);this.prettier=c.Option.Boolean("-p,--prettier",!1);this.types=c.Option.Boolean("-t,--types",!1);this.eslint=c.Option.Boolean("-e,--eslint",!1);this.skypack=c.Option.Boolean("-s,--skypack",!1)}async execute(){let t=!this.prettier&&!this.skypack&&!this.eslint&&!this.types||this.all;(this.eslint||t)&&(await this.$("yarn eslint packages/**/src/**/*.{js,jsx,ts,tsx} --fix"),await this.$("yarn eslint dev/**/*.{js,jsx,ts,tsx} --fix")),(this.prettier||t)&&(await this.$("yarn prettier packages/**/src/**/*.{ts,js,tsx,jsx} --write --ignore-unknown --loglevel silent --no-error-on-unmatched-pattern"),await this.$("yarn prettier dev/**/*.{ts,js,tsx,jsx} --write --ignore-unknown --loglevel silent --no-error-on-unmatched-pattern"),await this.$("yarn prettier site/**/*.{ts,js,tsx,jsx,md,mdx} --write --ignore-unknown --loglevel silent --no-error-on-unmatched-pattern")),(this.skypack||t)&&await this.$("yarn workspaces foreach --no-private --exclude @roots/bud-typings -p -v run pkg")}};d.paths=[["kjo","lint"]];var p=o(s("clipanion")),k=class extends i{constructor(){super(...arguments);this.all=p.Option.Boolean("-a,--all",!1);this.workers=p.Option.String("-w,--workers","50%");this.update=p.Option.Boolean("--update",!1);this.unit=p.Option.Boolean("-u,--unit",!1);this.integration=p.Option.Boolean("-i,--integration",!1)}async execute(){!this.unit&&!this.integration&&(this.all=!0),(this.all||this.unit)&&await this.$(`yarn jest unit --verbose --maxWorkers=${this.workers} ${this.update?"--updateSnapshot":"--coverage"}`),(this.all||this.integration)&&await this.$(`yarn jest integration --verbose --maxWorkers=${this.workers} ${this.update?"--updateSnapshot":""}`)}};k.paths=[["kjo","test"]];var B=o(s("clipanion")),y=class extends i{constructor(){super(...arguments);this.dfx=B.Option.Boolean("-d,--dfx",!1)}async execute(){await this.$("yarn install --immutable"),await this.$("yarn kjo build"),await this.$("yarn kjo lint --eslint --skypack"),await this.$("yarn kjo test --unit"),await this.$("yarn kjo test --integration")}};y.paths=[["kjo","make"]];var b=o(s("clipanion")),x=class extends i{constructor(){super(...arguments);this.site=b.Option.Boolean("-s,--site",!1);this.readme=b.Option.Boolean("-r,--readme",!1)}async execute(){let t=!this.site&&!this.readme;(this.site||t)&&await this.$("yarn workspace @roots/bud-docs run docusaurus build"),(this.readme||t)&&await this.$("yarn ts-node ./dev/readme")}};x.paths=[["kjo","md"]];var M={hooks:{afterAllInstalled:()=>{console.log("What a great install, am I right?")}},commands:[h,u,f,d,y,x,k]},W=M;return _;})();
return plugin;
}
};
