(() => {
 'use strict';
 const hero=document.querySelector('.hero-editorial');if(!hero)return;
 const images=[...hero.querySelectorAll('.editorial-photo')];
 const selectors=[...hero.querySelectorAll('[data-hero-slide]')];
 const controls=hero.querySelector('.editorial-controls'),pause=hero.querySelector('[data-hero-pause]'),counter=hero.querySelector('.editorial-counter');
 if(images.length!==3||selectors.length!==3||!controls||!pause||!counter)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,paused=false,hover=false,inView=true,timer=0,version=0;
 const ar=()=>document.documentElement.lang.startsWith('ar');
 function sync(){
  clearTimeout(timer);timer=0;
  pause.setAttribute('aria-pressed',String(paused||reduced.matches));
  pause.setAttribute('aria-label',paused||reduced.matches?(ar()?'تشغيل عرض الصور':'Play slideshow'):(ar()?'إيقاف عرض الصور':'Pause slideshow'));
  if(!paused&&!hover&&!reduced.matches&&!document.hidden&&inView)timer=setTimeout(()=>show((current+1)%3),7000);
 }
 async function load(i){
  const image=images[i];
  if(!image.getAttribute('src')){if(image.dataset.srcset)image.srcset=image.dataset.srcset;image.src=image.dataset.src;}
  try{await image.decode();return image.naturalWidth>0;}catch{return false;}
 }
 async function show(i,manual=false){
  const ticket=++version;clearTimeout(timer);if(manual)paused=true;
  if(i===current){sync();return;}
  if(!await load(i)){if(ticket===version)sync();return;}
  if(ticket!==version)return;
  current=i;
  images.forEach((e,n)=>{e.classList.toggle('is-active',n===i);e.setAttribute('aria-hidden',String(n!==i));});
  selectors.forEach((e,n)=>e.setAttribute('aria-current',String(n===i)));
  counter.textContent=`0${i+1} / 03`;sync();
 }
 selectors.forEach((e,i)=>e.addEventListener('click',()=>show(i,true)));
 hero.querySelector('[data-hero-prev]')?.addEventListener('click',()=>show((current+2)%3,true));
 hero.querySelector('[data-hero-next]')?.addEventListener('click',()=>show((current+1)%3,true));
 pause.addEventListener('click',()=>{paused=!paused;version++;sync();});
 controls.addEventListener('keydown',event=>{
  if(!event.target.matches('[data-hero-slide]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const i=event.key==='Home'?0:event.key==='End'?2:(current+(event.key==='ArrowRight'?1:-1)*(ar()?-1:1)+3)%3;
  selectors[i].focus();show(i,true);
 });
 controls.addEventListener('focusin',event=>{if(event.target!==pause){paused=true;version++;sync();}});
 controls.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;sync();}});
 controls.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){hover=false;sync();}});
 document.addEventListener('visibilitychange',()=>{version++;sync();});
 reduced.addEventListener('change',()=>{version++;sync();});
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)version++;sync();},{threshold:.1}).observe(hero);
 controls.hidden=false;sync();
 function warm(){setTimeout(()=>{if(!reduced.matches&&!navigator.connection?.saveData&&!document.hidden)load((current+1)%3);},2500);}
 if(document.readyState==='complete')warm();else addEventListener('load',warm,{once:true});
})();
