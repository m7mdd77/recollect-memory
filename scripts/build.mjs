import{mkdirSync,cpSync,copyFileSync,readFileSync,writeFileSync}from'node:fs';
mkdirSync('outputs/local',{recursive:true});cpSync('web','outputs/local',{recursive:true});for(const name of['memory','inference'])copyFileSync('src/'+name+'.js','outputs/local/'+name+'.js');
mkdirSync('site/public',{recursive:true});mkdirSync('site/lib',{recursive:true});for(const name of['app.js','style.css','storage.js'])copyFileSync('web/'+name,'site/public/'+name);for(const name of['memory','inference']){copyFileSync('src/'+name+'.js','site/public/'+name+'.js');writeFileSync('site/lib/'+name+'.js',readFileSync('src/'+name+'.js','utf8'));}
writeFileSync('site/lib/api.js',readFileSync('hosted/api.js','utf8').replace("'../src/inference.js'","'./inference.js'"));
const html=readFileSync('web/index.html','utf8'),body=html.match(/<body>([\s\S]*)<\/body>/)[1];writeFileSync('site/app/page.tsx','export default function Page(){return <div style={{display:"contents"}} dangerouslySetInnerHTML={{__html:'+JSON.stringify(body)+'}}/>;}\n');
writeFileSync('site/app/layout.tsx',`import type{ReactNode}from'react';
export const metadata={title:'Recollect — Memory with receipts',description:'Live AI memory with reviewable quotes, scoped citations and explicit forgetting.'};
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><head><link rel="stylesheet" href="/style.css"/><script type="module" src="/app.js"/></head><body>{children}</body></html>;}
`);
const manifest=JSON.parse(readFileSync('site/.openai/hosting.json','utf8'));delete manifest.static;manifest.d1='DB';manifest.r2=null;writeFileSync('site/.openai/hosting.json',JSON.stringify(manifest,null,2)+'\n');console.log('Local and hosted source prepared.');
