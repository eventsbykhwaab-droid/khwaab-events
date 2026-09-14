(() => {
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeButton = document.querySelector('.menu-close');
  const dropdownButton = document.querySelector('.nav-dropdown button');

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }

  if (menuButton) menuButton.addEventListener('click', () => setMenu(true));
  if (closeButton) closeButton.addEventListener('click', () => setMenu(false));
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

  if (dropdownButton) {
    dropdownButton.addEventListener('click', event => {
      event.stopPropagation();
      const expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
      dropdownButton.setAttribute('aria-expanded', String(!expanded));
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.nav-dropdown')) dropdownButton.setAttribute('aria-expanded', 'false');
    });
  }

  const dividerHoverImages = [
    '/images/nikkah/divider-classic-hover.svg',
    '/images/nikkah/divider-elegant-white-hover.svg',
    '/images/nikkah/divider-signature-hover.svg',
    '/images/nikkah/divider-luxe-hover.svg'
  ];
  const dividerCards = document.querySelectorAll('.divider-hover-card .divider-hover-preview img');
  dividerCards.forEach((image, index) => {
    if (dividerHoverImages[index]) image.src = dividerHoverImages[index];
  });

  if (dividerCards.length && !document.querySelector('link[data-nikkah-hover-fix]')) {
    const hoverFix = document.createElement('link');
    hoverFix.rel = 'stylesheet';
    hoverFix.href = '/css/nikkah-hover-fix.css?v=1';
    hoverFix.setAttribute('data-nikkah-hover-fix', '');
    document.head.appendChild(hoverFix);
  }

  if (!document.querySelector('.whatsapp-float')) {
    const whatsapp = document.createElement('a');
    whatsapp.className = 'whatsapp-float';
    whatsapp.href = 'https://wa.me/16474002224?text=Hi%20Khwaab%20Events!%20I%27d%20like%20a%20quote%20for%20my%20event.';
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener';
    whatsapp.setAttribute('aria-label', 'Message Khwaab Events on WhatsApp');
    whatsapp.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.11 17.31c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM16.04 3C8.85 3 3 8.77 3 15.87c0 2.52.75 4.98 2.17 7.07L3 29l6.29-2.04a13.15 13.15 0 0 0 6.75 1.87h.01C23.24 28.83 29 23.05 29 15.95 29 8.84 23.23 3 16.04 3zm0 23.66h-.01a10.95 10.95 0 0 1-5.57-1.52l-.4-.24-3.73 1.21 1.22-3.61-.26-.41a10.7 10.7 0 0 1-1.69-5.8C5.6 10.2 10.28 5.18 16.05 5.18c5.76 0 10.44 5.02 10.44 10.77 0 5.92-4.68 10.71-10.45 10.71z"/></svg>';
    document.body.appendChild(whatsapp);
  }
})();
