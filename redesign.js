(() => {
  'use strict';
  const nav=document.getElementById('site-nav');
  const menu=document.getElementById('menu-toggle');
  const language=document.getElementById('language');
  const pageLanguage=document.body.dataset.pageLanguage;
  const alternate=document.body.dataset.languageAlternate;
  let lang=pageLanguage || document.documentElement.lang || 'en';
  function closeMenu(){if(!nav||!menu)return;nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
  function applyLanguage(next){
    lang=next==='ar'?'ar':'en';
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    if(!pageLanguage)document.querySelectorAll('[data-en][data-ar]').forEach(el=>{el.textContent=el.dataset[lang];});
    if(language){language.textContent=lang==='ar'?'AR / EN':'EN / AR';language.setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل للعربية');}
    try{localStorage.setItem('aiseoa_lang',lang);}catch(error){}
  }
  if(menu&&nav){
    menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  }
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelectorAll('.nav-dropdown[open]').forEach(d=>d.open=false);if(menu)menu.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown[open]').forEach(d=>d.open=false);});
  window.matchMedia('(min-width: 921px)').addEventListener('change',closeMenu);
  if(language)language.addEventListener('click',()=>{
    if(alternate){window.location.assign(alternate);return;}
    applyLanguage(lang==='en'?'ar':'en');
  });
  // Each language URL has complete static content and a matching canonical.
  // An explicit URL takes precedence over a stored visual preference.
  applyLanguage(lang);
  const form=document.getElementById('audit-form');
  if(form){
    const params=new URLSearchParams(window.location.search);
    const market=params.get('market');
    const country=form.querySelector('[name="country"]');
    if(country&&['Australia','Ireland','Canada'].includes(market)){country.value=market;country.defaultValue=market;}
    const article=params.get('source');
    const validSources=['au-audit','au-geo','au-hotels','ie-roofing','ie-redesign','ie-enquiries','ca-ontario','ca-wordpress','ca-pricing','ca-aeo'];
    if(validSources.includes(article)){
      const source=document.createElement('input');source.type='hidden';source.name='article_source';source.value=article;form.append(source);
      const requested=params.get('service');
      if(requested&&requested.length<=90){
        const field=document.createElement('input');field.type='hidden';field.name='requested_service';field.value=requested;form.append(field);
        const value=/GEO|AEO/i.test(requested)?'GEO & AEO':/redesign|development/i.test(requested)?'New website':'SEO';
        const option=Array.from(form.querySelectorAll('[name="service"]')).find(input=>input.value===value);
        if(option){form.querySelectorAll('[name="service"]').forEach(input=>{input.checked=input===option;input.defaultChecked=input===option;});}
      }
    }
  }
  function syncContact(){
    if(!form)return;
    const whatsapp=form.querySelector('[name="preferred_contact"]:checked')?.value==='WhatsApp';
    [['whatsapp',whatsapp],['email',!whatsapp]].forEach(([method,active])=>{
      const group=form.querySelector('[data-contact-field="'+method+'"]');if(!group)return;
      group.hidden=!active;const input=group.querySelector('input');input.disabled=!active;input.required=active;input.setCustomValidity('');
    });
  }
  function syncWebsite(){
    if(!form)return;
    const website=form.querySelector('[name="website"]');
    if(!website)return;
    const optional=form.querySelector('[name="service"]:checked')?.value==='New website';
    website.required=!optional;
    const mark=form.querySelector('#website-required');if(mark)mark.hidden=optional;
    const help=form.querySelector('#website-help');
    if(help)help.textContent=lang==='ar'?(optional?'اختياري للموقع الجديد. يمكنك إضافة رابط إن كان متاحًا.':'أضف رابط موقعك الحالي حتى أتمكن من مراجعته.'):(optional?'Optional for a new website. Add a URL if you already have one.':'Add your existing website URL so I can review it.');
  }
  if(form){
    form.querySelectorAll('[name="preferred_contact"]').forEach(r=>r.addEventListener('change',syncContact));
    const phone=form.querySelector('[name="whatsapp"]');
    if(phone)phone.addEventListener('input',()=>{phone.setCustomValidity('');});
    syncContact();syncWebsite();
    form.querySelectorAll('[name="service"]').forEach(r=>r.addEventListener('change',syncWebsite));
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    document.querySelectorAll('.case-card[data-cat]').forEach(card=>{card.hidden=category!=='all'&&card.dataset.cat!==category;});
  }));
  const faqSearch=document.getElementById('faqSearchInput');
  if(faqSearch)faqSearch.addEventListener('input',()=>{
    const q=faqSearch.value.trim().toLocaleLowerCase();
    document.querySelectorAll('.legacy-faq').forEach(item=>{item.hidden=!item.textContent.toLocaleLowerCase().includes(q);});
  });
  if(form)form.addEventListener('submit',async e=>{
    e.preventDefault();
    const phone=form.querySelector('[name="whatsapp"]');
    if(phone&&!phone.disabled){
      const raw=phone.value.trim();let digits=raw.replace(/\D/g,'');if(raw.startsWith('00'))digits=digits.slice(2);
      phone.setCustomValidity(!/^(\+|00)/.test(raw)||digits.length<7||digits.length>15||(digits[0]==='0')?(lang==='ar'?'اكتب رقم واتساب صحيحًا بمفتاح الدولة مثل +20…':'Enter a valid WhatsApp number with country code, e.g. +20…'):'');
      if(!phone.validationMessage)phone.value='+'+digits;
    }
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type=submit]');const status=document.getElementById('form-status');
    button.disabled=true;form.setAttribute('aria-busy','true');status.classList.remove('error');
    status.textContent=lang==='ar'?'جاري إرسال استفسارك…':'Sending your enquiry…';
    try{
      const response=await fetch(form.action,{method:'POST',body:(()=>{const data=new FormData(form);if(phone&&!phone.disabled)data.set('whatsapp_link','https://wa.me/'+phone.value.replace(/\D/g,''));return data;})(),headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error('Submission failed');
      status.textContent=lang==='ar'?'تم إرسال استفسارك بنجاح. شكرًا لتواصلك.':'Your enquiry has been sent. Thank you for getting in touch.';form.reset();syncContact();syncWebsite();
    }catch(error){status.classList.add('error');status.textContent=lang==='ar'?'لم يتم تأكيد الإرسال. حاول مجددًا أوتواصل عبر البريد أوواتساب.':'Your enquiry could not be confirmed. Please retry or use email or WhatsApp.';}
    finally{button.disabled=false;form.removeAttribute('aria-busy');}
  });
})();
