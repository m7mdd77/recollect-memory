export const DAY=86400000;
export const SCOPES={cedar:'Cedar Studio',personal:'Personal'};
export const SUBJECTS={maya:'Maya',arun:'Arun'};
export const KEYS={entrance:'Delivery entrance',delivery_window:'Delivery window',contact_channel:'Contact preference'};
const norm=value=>value.normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('en');
const allowed=(map,key)=>typeof key==='string'&&Object.hasOwn(map,key);
function text(value,max){if(typeof value!=='string'||!value.trim()||value.length>max)throw Error('A bounded, nonempty value is required.');return value.trim();}
function id(){return crypto.randomUUID();}
function group(c,q){return c.scope===q.scope&&c.subject===q.subject&&c.key===q.key;}
function query(q){if(!allowed(SCOPES,q.scope)||!allowed(SUBJECTS,q.subject)||!allowed(KEYS,q.key))throw Error('Choose a valid scope, person and memory field.');}
function audit(v,type,ids){v.audit.push({id:id(),type,ids,at:v.now,revision:v.revision+1});if(v.audit.length>400)v.audit.shift();v.revision++;}
export function createVault(now=Date.now()){if(!Number.isSafeInteger(now)||now<0)throw Error('Invalid clock.');return{schemaVersion:1,revision:0,now,claims:[],audit:[]};}
export function remember(v,input){
 query(input);if(v.claims.length>=100)throw Error('This notebook is full. Start a new notebook to continue.');
 const value=text(input.value,180),source=text(input.source,120),quote=text(input.quote??input.value,400);
 if(!Number.isFinite(input.confidence)||input.confidence<0||input.confidence>1||!Number.isSafeInteger(input.ttlDays)||input.ttlDays<1||input.ttlDays>365)throw Error('Invalid confidence or retention period.');
 const claim={id:id(),scope:input.scope,subject:input.subject,key:input.key,value,source,quote,confidence:input.confidence,observedAt:v.now,freshUntil:v.now+input.ttlDays*DAY,status:'active'};
 v.claims.push(claim);audit(v,'remembered',[claim.id]);return claim;
}
export function confidenceAt(c,now){const span=c.freshUntil-c.observedAt;return Math.max(0,c.confidence*(1-.35*Math.min(1,Math.max(0,(now-c.observedAt)/span))));}
export function retrieve(v,q){
 query(q);const active=v.claims.filter(c=>c.status==='active'&&group(c,q));const fresh=active.filter(c=>c.observedAt<=v.now&&v.now<c.freshUntil);const distinct=new Set(fresh.map(c=>norm(c.value)));
 let status=distinct.size>1?'conflict':!fresh.length?(active.length?'stale':'missing'):Math.max(...fresh.map(c=>confidenceAt(c,v.now)))<.65?'uncertain':'ready';
 const evidence=(fresh.length?fresh:active).map(c=>({...structuredClone(c),effectiveConfidence:confidenceAt(c,v.now)}));
 return{...q,status,vaultRevision:v.revision,asOf:v.now,evidence,excluded:v.claims.filter(c=>c.status!=='active'&&group(c,q)).length};
}
export function answerFor(r){
 const label=KEYS[r.key].toLowerCase();if(r.status==='conflict')return{decision:'clarify',headline:'I might be wrong about this.',text:`Two current sources disagree about the ${label}. Please confirm which one is right.`,citedIds:[]};
 if(r.status==='stale')return{decision:'abstain',headline:'This memory needs a fresh check.',text:`The ${label} is out of date. I will not use it until you confirm it again.`,citedIds:[]};
 if(r.status==='uncertain')return{decision:'clarify',headline:'I am not sure enough to rely on this.',text:`The evidence for the ${label} is weak. Please confirm it before I use it.`,citedIds:[]};
 if(r.status==='missing')return{decision:'abstain',headline:'I do not have that memory.',text:`There is no usable ${label} for this person in this workspace.`,citedIds:[]};
 const best=[...r.evidence].sort((a,b)=>b.effectiveConfidence-a.effectiveConfidence)[0];return{decision:'answer',headline:best.value,text:`Based on ${best.source}.`,citedIds:r.evidence.filter(c=>norm(c.value)===norm(best.value)).map(c=>c.id),value:best.value};
}
export function confirm(v,claimId,q){query(q);const c=v.claims.find(c=>c.id===claimId&&c.status==='active'&&group(c,q));if(!c)throw Error('This memory is not available in the selected workspace.');const ttl=c.freshUntil-c.observedAt;const peers=v.claims.filter(other=>other.id!==c.id&&other.status==='active'&&group(other,c));for(const other of peers)other.status='superseded';c.observedAt=v.now;c.freshUntil=v.now+ttl;c.confidence=1;c.confirmedByUser=true;audit(v,'confirmed',[c.id,...peers.map(p=>p.id)]);return c;}
export function forget(v,claimId,q){query(q);const at=v.claims.findIndex(c=>c.id===claimId&&c.scope===q.scope&&c.subject===q.subject);if(at<0||v.claims[at].status==='revoked')throw Error('Memory is already forgotten or outside this workspace.');v.claims[at]={id:claimId,status:'revoked',revokedAt:v.now};audit(v,'forgotten',[claimId]);}
export function forgetScope(v,scope){if(!allowed(SCOPES,scope))throw Error('Unknown workspace.');const ids=[];v.claims=v.claims.map(c=>{if(c.scope!==scope)return c;ids.push(c.id);return{id:c.id,status:'revoked',revokedAt:v.now};});audit(v,'workspace-forgotten',ids);return ids.length;}
export function advanceClock(v,days){if(!Number.isSafeInteger(days)||days<1||days>365)throw Error('Invalid time advance.');v.now+=days*DAY;audit(v,'clock-advanced',[]);}
export function modelContext(r){const a=answerFor(r);return{scope:r.scope,subject:r.subject,field:r.key,asOf:r.asOf,revision:r.vaultRevision,state:r.status,requiredDecision:a.decision,evidence:r.status==='ready'?r.evidence.map(c=>({id:c.id,value:c.value,source:c.source,quote:c.quote,reportedConfidence:c.confidence,effectiveConfidence:c.effectiveConfidence,observedAt:c.observedAt,freshUntil:c.freshUntil})):[],blockedCount:r.status==='ready'?0:r.evidence.length};}
export function validateModel(r,proposal){if(!proposal||typeof proposal!=='object'||Array.isArray(proposal)||Object.keys(proposal).some(k=>!['decision','value','citedIds','rationale'].includes(k)))throw Error('Invalid model contract.');const expected=answerFor(r);if(proposal.decision!==expected.decision||!Array.isArray(proposal.citedIds)||proposal.citedIds.length>10||new Set(proposal.citedIds).size!==proposal.citedIds.length||typeof proposal.rationale!=='string'||proposal.rationale.length>500)throw Error('The model ignored the retrieval policy.');if(expected.decision==='answer'){if(typeof proposal.value!=='string'||norm(proposal.value)!==norm(expected.value)||!proposal.citedIds.length||proposal.citedIds.some(id=>!expected.citedIds.includes(id)))throw Error('The model used unsupported evidence.');}else if(proposal.value!==null||proposal.citedIds.length)throw Error('The model answered from blocked memory.');return structuredClone(proposal);}
export function sampleVault(now=Date.now()){const v=createVault(now);for(const [scope,subject,key,value,source,confidence,ttlDays] of [['cedar','maya','entrance','North entrance','Client brief',.95,7],['cedar','maya','delivery_window','Before noon','Client brief',.9,7],['personal','maya','contact_channel','Email','Personal preference',.9,30],['cedar','arun','entrance','Loading bay','Arun’s onboarding note',.9,7]])remember(v,{scope,subject,key,value,source,confidence,ttlDays});return v;}
export function contradict(v){return remember(v,{scope:'cedar',subject:'maya',key:'entrance',value:'Courtyard entrance',source:'Site coordinator',quote:'Cedar Studio deliveries for Maya should use the courtyard entrance.',confidence:.95,ttlDays:7});}
