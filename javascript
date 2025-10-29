// script.js

// ---------- STARFIELD using canvas ----------
(function starfield(){
  const canvas = document.createElement('canvas');
  canvas.id = 'stars-canvas';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.getElementById('starfield').appendChild(canvas);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const ctx = canvas.getContext('2d');

  let w, h, stars;
  function resize(){
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    initStars();
  }
  function initStars(){
    stars = [];
    const count = Math.floor((window.innerWidth + window.innerHeight) / 12);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: (Math.random() * 0.9) + 0.1,
        r: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.75 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    for(const s of stars){
      ctx.beginPath();
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
      g.addColorStop(0, rgba(255,255,255,${s.alpha}));
      g.addColorStop(0.5, rgba(160,190,255,${s.alpha*0.15}));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.arc(s.x, s.y, s.r * 2, 0, Math.PI*2);
      ctx.fill();

      // twinkle
      s.alpha += Math.sin(Date.now() * 0.001 * s.speed) * 0.002;
      // tiny vertical drift
      s.y += s.speed * (s.z * 0.6);
      if(s.y > window.innerHeight + 10) s.y = -10;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


// ---------- LIGHTBOX & CARRUSEL ----------
(function galleryLightbox(){
  const imgs = Array.from(document.querySelectorAll('.grid-item img'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbThumbs = document.getElementById('lbThumbs');

  // Build an array of srcs & alt texts
  const gallery = imgs.map(i => ({src: i.src, alt: i.alt}));

  let current = 0;

  function open(index){
    current = index;
    render();
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function render(){
    const item = gallery[current];
    lbImage.src = item.src;
    lbImage.alt = item.alt;
    lbCaption.textContent = item.alt || Imagen ${current+1};
    // update thumbs highlight
    const thumbImgs = lbThumbs.querySelectorAll('img');
    thumbImgs.forEach((t,i)=>{
      t.classList.toggle('active', i === current);
    });
  }

  function next(){
    current = (current + 1) % gallery.length;
    render();
  }
  function prev(){
    current = (current - 1 + gallery.length) % gallery.length;
    render();
  }

  // attach click on grid items
  document.querySelectorAll('.grid-item').forEach((fig, idx) => {
    fig.addEventListener('click', ()=> open(idx));
    // keyboard accessibility
    fig.setAttribute('tabindex','0');
    fig.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') open(idx);
    });
  });

  // close button
  lbClose.addEventListener('click', close);

  // prev/next
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);

  // thumbs
  gallery.forEach((g, i)=>{
    const t = document.createElement('img');
    t.src = g.src;
    t.alt = g.alt || thumb ${i+1};
    t.addEventListener('click', ()=> {
      current = i; render();
    });
    lbThumbs.appendChild(t);
  });

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(lightbox.classList.contains('show')){
      if(e.key === 'ArrowRight') next();
      if(e.key === 'ArrowLeft') prev();
      if(e.key === 'Escape') close();
    }
  });

  // close when clicking outside the image area
  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox) close();
  });

  // initialize first render (thumbs active)
  render();
})();


// ---------- Small enhancement: lazy prefetch next image for smoother carousel ----------
(function prefetchNext(){
  const imgs = Array.from(document.querySelectorAll('.grid-item img')).map(i=>i.src);
  let idx = 0;
  setInterval(()=>{
    const next = (idx + 1) % imgs.length;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = imgs[next];
    document.head.appendChild(link);
    idx = next;
    // remove old prefetch nodes occasionally
    const nodes = document.querySelectorAll('link[rel="prefetch"]');
    if(nodes.length > 8) nodes[0].remove();
  }, 2000);
})();
