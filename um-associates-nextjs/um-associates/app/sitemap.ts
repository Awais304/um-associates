import type {MetadataRoute} from 'next';
import {divisions,industries,slug,servicePath,settings,jobs} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{return ['','/about','/divisions','/services','/industries','/products','/products/nexxus-grc','/portfolio','/insights','/careers','/contact','/privacy','/terms','/cookies',...divisions.map(d=>'/divisions/'+d.id),...divisions.flatMap(d=>d.services.map(s=>servicePath(d.id,s))),...industries.map(i=>'/industries/'+slug(i)),...jobs.map(j=>'/careers/'+slug(j.title))].map(p=>({url:settings.url+p}))}
