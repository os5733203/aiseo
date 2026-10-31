(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.page-hero h1, .answer-summary, .editorial-section, .catalog-card, .page-hero h1, .answer-summary, .editorial-section, .catalog-card, .section-heading, .illustrated-card, .work-card, .trust-grid > div, .process-grid > li, .insight-card, .faq, .contact-grid > div, .contact-form, .footer-invitation');
  let observer;
  const revealAll = () => {
    if(observer)observer.disconnect();
    targets.forEach(el=>{el.classList.remove('reveal-pending','is-visible');el.style.removeProperty('--reveal-delay');});
  };
  if(!reduced.matches && 'IntersectionObserver' in window){
    try{
      observer = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          const el=entry.target;
          el.classList.add('is-visible');
          observer.unobserve(el);
          window.setTimeout(()=>{el.classList.remove('reveal-pending','is-visible');el.style.removeProperty('--reveal-delay');},1100);
        });
      },{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
      targets.forEach((el,i)=>{
        if(el.getBoundingClientRect().top < window.innerHeight)return;
        el.style.setProperty('--reveal-delay',`${(i%3)*70}ms`);
        el.classList.add('reveal-pending');
        observer.observe(el);
      });
    }catch(error){revealAll();}
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)revealAll();});
  let scheduled=false;
  const updateProgress=()=>{
    const page=document.documentElement;
    const range=page.scrollHeight-window.innerHeight;
    page.style.setProperty('--page-progress',range>0?String(Math.min(1,Math.max(0,window.scrollY/range))):'0');
    scheduled=false;
  };
  window.addEventListener('scroll',()=>{
    if(!scheduled){scheduled=true;window.requestAnimationFrame(updateProgress);}
  },{passive:true});
  window.addEventListener('resize',updateProgress,{passive:true});
  window.addEventListener('load',updateProgress,{once:true});
  updateProgress();
})();
