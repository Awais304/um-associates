import {NextRequest} from 'next/server';
import {submission} from '@/lib/submission';
export const runtime='nodejs';
export const POST=(req:NextRequest)=>submission(req,true);
