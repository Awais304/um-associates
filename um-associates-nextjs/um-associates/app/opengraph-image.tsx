import {ImageResponse} from 'next/og';
export const alt='UM Associates — Business. Digital. Security.';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:80,background:'#081B33',color:'white',width:'100%',height:'100%'}}><div style={{fontSize:25,color:'#21B8D6',marginBottom:40}}>UM ASSOCIATES / CONNECTED EXPERTISE</div><div style={{fontSize:64,fontWeight:700}}>One Group.</div><div style={{fontSize:64,fontWeight:700}}>Multiple Specializations.</div><div style={{fontSize:58,color:'#21B8D6'}}>Unlimited Possibilities.</div><div style={{fontSize:24,marginTop:45}}>BUSINESS. DIGITAL. SECURITY.</div></div>,size)}
