/* OS SEO: homepage-only, once-per-session cinema intro. Default site is always usable. */
(function(){
  'use strict';
  var source='/videos/os-seo-intro.mp4';
  var key='osseo-home-cinema-seen-v1';
  var media=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasSeen=false;
  try{hasSeen=window.sessionStorage.getItem(key)==='1';}catch(e){}
  if(hasSeen || (media && media.matches)) return;
  var intro=document.createElement('div');
  intro.className='os-cinematic-intro';
  intro.setAttribute('aria-label','OS SEO cinematic introduction');
  var video=document.createElement('video');
  video.className='os-cinematic-intro__video';
  video.muted=true;
  video.autoplay=true;
  video.playsInline=true;
  video.loop=false;
  video.preload='metadata';
  video.setAttribute('muted','');
  video.setAttribute('playsinline','');
  video.setAttribute('aria-hidden','true');
  video.src=source;
  var skip=document.createElement('button');
  skip.className='os-cinematic-intro__skip';
  skip.type='button';
  skip.textContent='Skip intro';
  skip.setAttribute('aria-label','Skip cinematic introduction');
  intro.appendChild(video);intro.appendChild(skip);
  document.body.appendChild(intro);
  var finished=false,watchdog,removal;
  function finish(){
    if(finished)return;
    finished=true;
    clearTimeout(watchdog);
    document.body.classList.remove('os-cinematic-intro-active');
    intro.classList.remove('is-playing');
    intro.classList.add('is-leaving');
    try{window.sessionStorage.setItem(key,'1');}catch(e){}
    removal=setTimeout(function(){video.pause();video.removeAttribute('src');video.load();intro.remove();},850);
  }
  function start(){
    if(finished)return;
    document.body.classList.add('os-cinematic-intro-active');
    intro.classList.add('is-playing');
    watchdog=setTimeout(finish,20000);
  }
  skip.addEventListener('click',finish);
  video.addEventListener('ended',finish);
  video.addEventListener('error',finish);
  if(media && media.addEventListener)media.addEventListener('change',function(e){if(e.matches)finish();});
  // Only overlay the normal homepage after the video actually starts playing.
  video.addEventListener('playing',start,{once:true});
  var attempt=video.play();
  if(attempt && attempt.catch) attempt.catch(finish);
  // On slow / unavailable connections do not hide the homepage indefinitely.
  setTimeout(function(){if(!intro.classList.contains('is-playing'))finish();},6000);
})();
