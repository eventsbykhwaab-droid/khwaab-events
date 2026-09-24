(() => {
  const API_URL = 'https://admin.khwaab.ca/api/portfolio';
  const dynamicSection = document.getElementById('portfolioDynamic');
  const eventGrid = document.getElementById('portfolioEventGrid');
  const fallback = document.getElementById('portfolioFallback');
  const filterRoot = document.getElementById('galleryFilters');
  const heroImage = document.querySelector('.portfolio-hero-image img');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-stage img');
  const lightboxTitle = lightbox.querySelector('.lightbox-caption h2');
  const lightboxKicker = lightbox.querySelector('.lightbox-kicker');
  const lightboxMeta = lightbox.querySelector('.lightbox-meta');
  const status = lightbox.querySelector('.lightbox-status');
  let allEvents = [];
  let activeEvent = null;
  let activeImages = [];
  let imageIndex = 0;

  const keyFor = (value) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sortedImages = (event) => [...(event.portfolio_images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const aspect = (photo) => photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1;

  // Cloudinary gallery images should never load at their original upload size.
  // Use automatic format/quality and cap display width for faster page loads.
  const optimizedImageUrl = (url, width = 1200) => {
    if (!url || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto:eco,c_limit,w_${width}/`);
  };

  const lightboxImageUrl = (url) => optimizedImageUrl(url, 1800);
  const photoRows = (images) => {
    const rows = [];
    for (let index = 0; index < images.length;) {
      const row = [];
      let totalAspect = 0;
      while (index < images.length && (row.length < 2 || (row.length < 4 && totalAspect < 3.3))) {
        row.push({ photo: images[index], index, ratio: aspect(images[index]) });
        totalAspect += aspect(images[index]);
        index += 1;
      }
      rows.push(row);
    }
    return rows;
  };
  const coverFor = (event) => {
    const images = sortedImages(event);
    return images.find((image) => image.is_cover) || images[0];
  };

  function createFilters(events) {
    const categories = [...new Set(events.map((event) => event.event_type))];
    filterRoot.replaceChildren();
    ['All', ...categories].forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `gallery-filter${index === 0 ? ' active' : ''}`;
      button.dataset.filter = index === 0 ? 'all' : keyFor(label);
      button.textContent = label;
      filterRoot.appendChild(button);
    });
    filterRoot.querySelectorAll('.gallery-filter').forEach((button) => button.addEventListener('click', () => {
      filterRoot.querySelectorAll('.gallery-filter').forEach((item) => item.classList.toggle('active', item === button));
      renderEvents(button.dataset.filter);
    }));
  }

  function renderEvents(filter = 'all') {
    const visible = allEvents.filter((event) => filter === 'all' || keyFor(event.event_type) === filter);
    eventGrid.replaceChildren();
    visible.forEach((event, index) => {
      const images = sortedImages(event);
      if (!images.length) return;
      const section = document.createElement('section');
      section.className = 'portfolio-story';
      const heading = document.createElement('div');
      heading.className = 'portfolio-story-heading';
      const details = document.createElement('div');
      const type = document.createElement('span');
      type.className = 'portfolio-story-type';
      type.textContent = event.event_type;
      const title = document.createElement('h2');
      title.textContent = event.title;
      details.append(type, title);
      heading.appendChild(details);
      if (event.location) {
        const location = document.createElement('span');
        location.className = 'portfolio-story-location';
        location.textContent = event.location;
        heading.appendChild(location);
      }
      section.appendChild(heading);

      const gallery = document.createElement('div');
      gallery.className = 'portfolio-natural-gallery';
      photoRows(images).forEach((photos) => {
        const row = document.createElement('div');
        row.className = `portfolio-natural-row${photos.length === 1 ? ' portfolio-natural-row--single' : ''}`;
        photos.forEach(({ photo, index: photoIndex, ratio }) => {
          const tile = document.createElement('button');
          tile.className = 'portfolio-photo-tile';
          tile.type = 'button';
          tile.style.flex = `${ratio} 1 0%`;
          tile.setAttribute('aria-label', `View photo ${photoIndex + 1} of ${images.length} from ${event.title}`);
          const img = document.createElement('img');
          img.src = optimizedImageUrl(photo.secure_url, 1200);
          img.alt = photo.alt_text || `${event.title} event decor`;
          img.loading = index === 0 && photoIndex === 0 ? 'eager' : 'lazy';
          img.decoding = 'async';
          if (photo.width && photo.height) { img.width = photo.width; img.height = photo.height; }
          tile.appendChild(img);
          tile.addEventListener('click', () => openEvent(event, photoIndex));
          row.appendChild(tile);
        });
        gallery.appendChild(row);
      });
      section.appendChild(gallery);
      eventGrid.appendChild(section);

      if ((index + 1) % 3 === 0 && index < visible.length - 1) {
        const cta = document.createElement('a');
        cta.className = 'portfolio-inline-cta';
        cta.href = '/contact.html';
        cta.innerHTML = '<span>Have a vision in mind?</span><strong>Let’s create something personal to you.</strong><em>Start your inquiry →</em>';
        eventGrid.appendChild(cta);
      }
    });
  }

  function openEvent(event, startIndex = 0) {
    activeEvent = event;
    activeImages = sortedImages(event);
    imageIndex = startIndex;
    showImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function showImage() {
    if (!activeImages.length) return;
    imageIndex = (imageIndex + activeImages.length) % activeImages.length;
    const image = activeImages[imageIndex];
    lightboxImage.src = lightboxImageUrl(image.secure_url);
    lightboxImage.alt = image.alt_text || activeEvent.title;
    lightboxKicker.textContent = activeEvent.event_type;
    lightboxTitle.textContent = activeEvent.title;
    lightboxMeta.textContent = [activeEvent.location, activeEvent.event_date ? new Date(`${activeEvent.event_date}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' }) : ''].filter(Boolean).join(' · ');
    status.textContent = `${imageIndex + 1} / ${activeImages.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function enableFallback() {
    fallback.classList.add('portfolio-fallback-ready');
    if (heroImage) heroImage.classList.add('portfolio-hero-ready');
    const filters = [...document.querySelectorAll('.gallery-filter')];
    const groups = [...document.querySelectorAll('.portfolio-section')];
    const filterGallery = (category) => {
      filters.forEach((button) => button.classList.toggle('active', button.dataset.filter === category));
      groups.forEach((group) => { group.hidden = category !== 'all' && group.dataset.category !== category; });
    };
    filters.forEach((button) => button.addEventListener('click', () => filterGallery(button.dataset.filter)));
    document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => {
      const images = [...document.querySelectorAll('.gallery-item')].filter((node) => !node.closest('[hidden]')).map((node, index) => ({ id: String(index), secure_url: node.querySelector('img').src, alt_text: node.querySelector('img').alt, sort_order: index }));
      openEvent({ title: 'Khwaab Events', event_type: 'Our work', location: 'Greater Toronto Area', portfolio_images: images });
      imageIndex = [...document.querySelectorAll('.gallery-item')].filter((node) => !node.closest('[hidden]')).indexOf(item);
      showImage();
    }));
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => { imageIndex += 1; showImage(); });
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => { imageIndex -= 1; showImage(); });
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
    if (lightbox.classList.contains('open') && event.key === 'ArrowRight') { imageIndex += 1; showImage(); }
    if (lightbox.classList.contains('open') && event.key === 'ArrowLeft') { imageIndex -= 1; showImage(); }
  });

  fetch(API_URL)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Portfolio is not available yet.')))
    .then(({ events }) => {
      allEvents = (events || []).filter((event) => coverFor(event));
      if (!allEvents.length) throw new Error('No published events yet.');
      createFilters(allEvents);
      renderEvents();
      const firstCover = coverFor(allEvents[0]);
      if (firstCover && heroImage) {
        const preload = new Image();
        preload.onload = () => {
          heroImage.src = optimizedImageUrl(firstCover.secure_url, 1600);
          heroImage.removeAttribute('srcset');
          heroImage.removeAttribute('sizes');
          heroImage.alt = firstCover.alt_text || allEvents[0].title;
          heroImage.classList.add('portfolio-hero-ready');
        };
        preload.onerror = () => heroImage.classList.add('portfolio-hero-ready');
        preload.src = optimizedImageUrl(firstCover.secure_url, 1600);
        document.querySelector('.portfolio-hero-image').addEventListener('click', () => openEvent(allEvents[0], sortedImages(allEvents[0]).findIndex((image) => image.id === firstCover.id)));
      } else if (heroImage) {
        heroImage.classList.add('portfolio-hero-ready');
      }
      fallback.hidden = true;
      dynamicSection.hidden = false;
    })
    .catch(enableFallback);
})();
