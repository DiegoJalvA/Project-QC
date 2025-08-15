(function(){
      const hero = document.getElementById('hero');
      const navOriginal = document.getElementById('navbarOriginal');
      const navClone = document.getElementById('navbarClone');

      navClone.innerHTML = navOriginal.innerHTML;

      const menuOriginal = document.getElementById('menuOriginal');
      const menuClone = navClone.querySelector('.menu');
      menuClone.id = 'menuClone';

      const showFixedNavIfNeeded = () => {
        const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
        const scrolled = window.scrollY >= heroBottom - 1;
        navClone.classList.toggle('show', scrolled);
      };
      showFixedNavIfNeeded();
      window.addEventListener('scroll', showFixedNavIfNeeded, {passive:true});
      window.addEventListener('resize', showFixedNavIfNeeded);

      const allLinks = Array.from(document.querySelectorAll('#menuOriginal a, #menuClone a'));
      const uniqueIds = Array.from(new Set(allLinks
        .map(a => a.getAttribute('href'))
        .filter(h => h && h.startsWith('#'))));
      const sections = uniqueIds.map(id => document.querySelector(id)).filter(Boolean);

      function setActive(href){
        allLinks.forEach(a => a.removeAttribute('aria-current'));
        allLinks
          .filter(a => a.getAttribute('href') === href)
          .forEach(a => a.setAttribute('aria-current', 'page'));
      }

      if (sections.length) setActive('#' + sections[0].id);

      let ticking = false;
      function onScrollSpy(){
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const navHVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
          const navH = parseFloat(navHVar) || 60;
          const fromTop = window.scrollY + navH + 16;

          let activeIndex = 0;
          for (let i = 0; i < sections.length; i++){
            if (fromTop >= sections[i].offsetTop) activeIndex = i;
          }
          setActive('#' + sections[activeIndex].id);
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScrollSpy, {passive:true});
      onScrollSpy();
      function centerActiveInMenu(menuEl){
        const active = menuEl.querySelector('a[aria-current="page"]');
        if (!active) return;
        const rect = active.getBoundingClientRect();
        const mrect = menuEl.getBoundingClientRect();
        if (rect.left < mrect.left || rect.right > mrect.right){
          active.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
        }
      }
      const centerAllMenus = () => {
        centerActiveInMenu(menuOriginal);
        centerActiveInMenu(menuClone);
      };
      allLinks.forEach(a => a.addEventListener('click', () => setTimeout(centerAllMenus, 250)));
      window.addEventListener('scroll', () => {
        if (window.matchMedia('(max-width: 900px)').matches) centerAllMenus();
      }, {passive:true});
    })();