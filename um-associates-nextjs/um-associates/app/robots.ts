import type {MetadataRoute} from 'next';
import {settings} from '@/lib/content';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:settings.url+'/sitemap.xml'}}
