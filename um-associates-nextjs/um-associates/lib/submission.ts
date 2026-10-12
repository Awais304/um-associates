import {NextRequest,NextResponse} from 'next/server';
import {put,del} from '@vercel/blob';
import {enquirySchema} from './validation';
const json=(message:string,status:number)=>NextResponse.json({message},{status});
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function submission(req:NextRequest,application=false){
 const origin=req.headers.get('origin');if(!origin||origin!==req.nextUrl.origin)return json('Invalid request origin.',403);
 const length=Number(req.headers.get('content-length'));if(length>6*1024*1024)return json('Submission exceeds the 6 MB request limit.',413);
 if(!process.env.RESEND_API_KEY||!process.env.TURNSTILE_SECRET_KEY||!process.env.MAIL_FROM||!process.env.MAIL_TO||(application&&!process.env.BLOB_READ_WRITE_TOKEN))return json('Online submissions are not configured yet. Please email info@umassociates.us. Nothing has been submitted.',503);
 let form:FormData;try{if(!req.body)return json('Empty submission.',400);const reader=req.body.getReader();const chunks:Buffer[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>6*1024*1024){await reader.cancel();return json('Submission exceeds the 6 MB request limit.',413)}chunks.push(Buffer.from(value))}form=await new Response(new Uint8Array(Buffer.concat(chunks)),{headers:{'Content-Type':req.headers.get('content-type')||''}}).formData()}catch{return json('Could not read the submission.',400)}
 const raw=Object.fromEntries(form.entries());const parsed=enquirySchema.safeParse({...raw,consent:raw.consent==='true'});if(!parsed.success)return json('Please check your details, consent, and security verification.',400);
 const d=parsed.data;let uploaded:string|undefined;
 try{
 const verifyBody=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:d.token});
 const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:verifyBody,signal:AbortSignal.timeout(10000)});
 const verified=await verification.json();if(!verified.success||verified.hostname!==req.nextUrl.hostname)return json('Security verification failed. Please retry.',400);
 if(application){const file=form.get('cv');if(!(file instanceof File)||file.size===0||file.size>5*1024*1024||file.type!=='application/pdf')return json('Attach a PDF CV of up to 5 MB.',400);const bytes=new Uint8Array(await file.arrayBuffer());const header=new TextDecoder().decode(bytes.slice(0,5));const sample=new TextDecoder('latin1').decode(bytes);if(header!=='%PDF-'||/\/JavaScript|\/JS\b|\/Launch\b|\/EmbeddedFile\b|\/OpenAction\b/i.test(sample))return json('The CV must be a PDF without active scripts or embedded files.',400);const result=await put(`applications/${Date.now()}-${crypto.randomUUID()}.pdf`,Buffer.from(bytes),{access:'private',addRandomSuffix:true,contentType:'application/pdf'});uploaded=result.url;}
 const rows=Object.entries(d).filter(([key])=>!['token','website','consent'].includes(key)).map(([key,value])=>`<p><strong>${escape(key)}:</strong> ${escape(String(value)).replace(/\n/g,'<br>')}</p>`).join('');
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.MAIL_FROM,to:[process.env.MAIL_TO],reply_to:d.email,subject:application?'UM Associates: general application':'UM Associates: website enquiry',html:rows+(uploaded?`<p>Private CV storage identifier (authorized storage access required): ${escape(uploaded)}</p>`:'')}),signal:AbortSignal.timeout(15000)});
 if(!response.ok){if(uploaded)await del(uploaded);return json('Delivery failed. Your request has not been confirmed. Please retry or email us.',502)}
 return json(application?'Your application has been accepted for delivery. Thank you.':'Your enquiry has been accepted for delivery. Our team will review it.',200);
 }catch{if(uploaded){try{await del(uploaded)}catch{console.error('Application cleanup required; inspect private storage.')}}return json('Submission could not be confirmed. Please contact us by email before retrying.',502)}
}

