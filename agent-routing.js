'use strict';
/* MAIC enrollment agent routing — configured by MAIC owner.
 * Country assignments may be expanded only after MAIC authorization.
 * A fallback is not a separate in-country agent; it is Unity Bridge Services LLC.
 */
const MAIC_ENROLLMENT_AGENTS=[
  {id:'unity-bridge',name:'Unity Bridge Services LLC',country:'US',active:true},
  {id:'asas-360',name:'ASAS 360°',country:'IQ',active:true}
];
const MAIC_DEFAULT_AGENT_ID='unity-bridge';
function maicAssignAgent(countryCode){
  const code=String(countryCode||'').trim().toUpperCase();
  if(!/^[A-Z]{2}$/.test(code))return null;
  const active=MAIC_ENROLLMENT_AGENTS.filter(a=>a.active);
  const local=active.find(a=>a.country===code);
  const agent=local||active.find(a=>a.id===MAIC_DEFAULT_AGENT_ID);
  if(!agent)return null; // Fail closed: never send a learner to an unknown agent.
  return {agent,countryCode:code,isFallback:!local,assignedBy:'MAIC'};
}
