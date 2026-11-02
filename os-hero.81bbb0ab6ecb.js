(() => {
 'use strict';
 const hero=document.querySelector('.hero-immersive');
 if(!hero)return;
 const photos=[...hero.querySelectorAll('.hero-photograph')];
 const controls=hero.querySelector('.hero-slideshow-controls');
 const buttons=[...hero.querySelectorAll('[data-hero-slide]')];
 const toggle=hero.querySelector('.hero-slideshow-toggle');
 if(photos.length!==3||buttons.length!==3||!controls||!toggle)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,manualPause=false,hovered=false,visible=true,timer=0,request=0;
 const arabic=()=>document.documentElement.lang.startsWith('ar');
 const allowed=()=>!manualPause&&!hovered&&!reduced.matches&&!document.hidden&&visible;
 function sync(){
  clearTimeout(timer);timer=0;
  const running=allowed();
  hero.classList.toggle('is-playing',running);
  hero.classList.toggle('is-motion-paused',!running);
  toggle.setAttribute('aria-pressed',String(manualPause));
  toggle.setAttribute('aria-label',manualPause?(arabic()?'تشغيل عرض الصور':'Play slideshow'):(arabic()?'إيقاف عرض الصور':'Pause slideshow'));
  if(running)timer=setTimeout(()=>show((active+1)%photos.length),7000);
 }
 async function load(index){
  const image=photos[index];
  if(!image.getAttribute('src'))image.src=image.dataset.src;
  try{await image.decode();return image.naturalWidth>0;}catch{return false;}
 }
 async function show(index,manual=false){
  const ticket=++request;
  clearTimeout(timer);
  if(manual)manualPause=true;
  if(index===active){sync();return;}
  const loaded=await load(index);
  if(ticket!==request)return;
  // Never let a failed image replace the currently visible photo.
  if(!loaded){sync();return;}
  active=index;
  photos.forEach((image,i)=>image.classList.toggle('is-active',i===active));
  buttons.forEach((button,i)=>button.setAttribute('aria-current',String(i===active)));
  sync();
 }
 buttons.forEach((button,i)=>button.addEventListener('click',()=>show(i,true)));
 controls.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||!event.target.matches('[data-hero-slide]'))return;
  event.preventDefault();
  let next=event.key==='Home'?0:event.key==='End'?2:(active+(event.key==='ArrowRight'?1:-1)*(arabic()?-1:1)+3)%3;
  buttons[next].focus();show(next,true);
 });
 toggle.addEventListener('click',()=>{manualPause=!manualPause;if(manualPause)request++;sync();});
 // A keyboard user can read and operate the hero without a moving target.
 hero.addEventListener('focusin',event=>{if(event.target===toggle)return;manualPause=true;request++;sync();});
 hero.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;sync();}});
 hero.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){hovered=false;sync();}});
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',()=>{request++;sync();});
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1}).observe(hero);
 controls.hidden=false;
 sync();
 // Load only the next photo, after the critical page resources have finished.
 function warmNext(){setTimeout(()=>{if(allowed()&&!navigator.connection?.saveData)load((active+1)%3);},2500);}
 if(document.readyState==='complete')warmNext();else addEventListener('load',warmNext,{once:true});
})();
