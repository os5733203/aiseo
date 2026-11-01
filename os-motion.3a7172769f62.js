(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const targets=[...document.querySelectorAll('.section-heading,.illustrated-card,.work-card,.trust-grid>div,.process-grid>li,.insight-card,.answer-summary,.catalog-card,.case-card,.footer-invitation')];
 let observer;
 function stopMotion(){if(observer)observer.disconnect();targets.forEach(e=>{e.classList.remove('os-reveal');e.style.removeProperty('--os-delay');});}
 function startMotion(){
  stopMotion();
  if(reduced.matches||!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;target.style.setProperty('--os-delay',`${targets.indexOf(target)%3*55}ms`);target.classList.add('os-reveal');observer.unobserve(target);});},{threshold:.08});
  targets.forEach(e=>{if(e.getBoundingClientRect().top>innerHeight)observer.observe(e);});
 }
 startMotion();reduced.addEventListener('change',startMotion);
 const header=document.querySelector('.site-header'),progress=document.querySelector('.reading-progress');
 let queued=false;
 function update(){queued=false;const range=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--page-progress',range>0?String(Math.min(1,scrollY/range)):'0');header?.classList.toggle('os-scrolled',scrollY>25);}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
 addEventListener('resize',update,{passive:true});update();
 // Put project type before URL, keeping the original native form controls.
 const form=document.getElementById('audit-form');
 if(form){const website=form.querySelector('[name=website]');const service=form.querySelector('[name=service]')?.closest('fieldset');if(service&&website&&service.parentElement===website.closest('.field')?.parentElement)website.closest('.field').before(service);}
 const nav=document.getElementById('site-nav'),toggle=document.getElementById('menu-toggle');
 if(nav&&toggle){
  document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target)){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
  nav.addEventListener('keydown',e=>{if(e.key!=='Tab'||!nav.classList.contains('open'))return;const items=[...nav.querySelectorAll('a,button,summary')].filter(x=>x.getClientRects().length);if(!items.length)return;if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();toggle.focus();}});
  toggle.addEventListener('keydown',e=>{if(e.key==='Tab'&&e.shiftKey&&nav.classList.contains('open')){const items=[...nav.querySelectorAll('a,button,summary')].filter(x=>x.getClientRects().length);if(items.length){e.preventDefault();items.at(-1).focus();}}});
 }
})();
