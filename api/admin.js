import { sbJson } from './_supabase.js';
function json(res,status,body){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));}
function authorized(req){
  const expectedUser=process.env.ADMIN_USER, expectedPass=process.env.ADMIN_PASSWORD;
  const [scheme,encoded]=String(req.headers.authorization||'').split(' ');
  if(!expectedUser||!expectedPass||scheme!=='Basic'||!encoded)return false;
  try{const decoded=Buffer.from(encoded,'base64').toString('utf8');const i=decoded.indexOf(':');return i>0&&decoded.slice(0,i)===expectedUser&&decoded.slice(i+1)===expectedPass;}catch{return false;}
}
export default async function handler(req,res){
  if(!authorized(req))return json(res,401,{error:'Unauthorized'});
  const action=String(req.query?.action||'stats');
  try{
    if(req.method==='GET'&&action==='users'){
      const q=String(req.query?.q||'').trim();
      const filter=q?`&or=(email.ilike.*${encodeURIComponent(q)}*,username.ilike.*${encodeURIComponent(q)}*,name.ilike.*${encodeURIComponent(q)}*)`:'';
      const users=await sbJson(`users?select=id,email,name,username,plan,pro_until,created_at,last_seen_at,blocked&order=created_at.desc&limit=200${filter}`);
      return json(res,200,{users});
    }
    if(req.method==='GET'&&action==='stats'){
      const users=await sbJson('users?select=id,plan,blocked,created_at,last_seen_at&limit=10000');
      const activeSince=Date.now()-30*864e5;
      const active=users.filter(u=>u.last_seen_at&&Date.parse(u.last_seen_at)>=activeSince&&!u.blocked).length;
      const pro=users.filter(u=>u.plan==='pro'&&(!u.pro_until||Date.parse(u.pro_until)>Date.now())&&!u.blocked).length;
      return json(res,200,{total:users.length,active,pro,free:users.filter(u=>u.plan!=='pro').length});
    }
    if(req.method==='PATCH'&&action==='user'){
      const id=String(req.query?.id||''); if(!id)return json(res,400,{error:'User id required'});
      const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); const patch={};
      if(body.plan==='free'||body.plan==='pro')patch.plan=body.plan;
      if(body.pro_until===null||body.pro_until)patch.pro_until=body.pro_until;
      if(typeof body.blocked==='boolean')patch.blocked=body.blocked;
      if(!Object.keys(patch).length)return json(res,400,{error:'Nothing to update'});
      await sbJson(`users?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(patch)});
      return json(res,200,{ok:true});
    }
    return json(res,405,{error:'Method not allowed'});
  }catch(e){console.error('Admin API:',e);return json(res,500,{error:e.message||'Admin API failed'});}
}
