import type{ReactNode}from'react';
export const metadata={title:'Recollect — Memory with receipts',description:'Live AI memory with reviewable quotes, scoped citations and explicit forgetting.'};
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><head><link rel="stylesheet" href="/style.css"/><script type="module" src="/app.js"/></head><body>{children}</body></html>;}
