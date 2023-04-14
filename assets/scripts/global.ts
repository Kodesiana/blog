import 'lazysizes';
import mediumZoom from 'medium-zoom';

import { defaultTheme, attachEvent, applyTheme, Theme } from './utils';

// apply theme
if ((defaultTheme && defaultTheme.endsWith(':only')) || (!localStorage.theme && defaultTheme !== 'system')) {
  applyTheme(defaultTheme.replace(':only', '') as Theme);
} else if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  applyTheme('dark');
} else {
  applyTheme('light');
}

// on load functions
window.onload = function () {
  let lastKnownScrollPosition = window.scrollY;
  let ticking = true;

  // toggle hamburger menu handler
  attachEvent('[data-aw-toggle-menu]', 'click', function (_, elem) {
    elem.classList.toggle('expanded');
    document.body.classList.toggle('overflow-hidden');
    document.getElementById('header')?.classList.toggle('h-screen');
    document.querySelector('#header nav')?.classList.toggle('hidden');
  });

  // toggle theme handler
  attachEvent('[data-aw-toggle-color-scheme]', 'click', function () {
    if (defaultTheme.endsWith(':only')) {
      return;
    }
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  // share button handler
  attachEvent('[data-aw-social-share]', 'click', function (_, elem) {
    const network = elem.getAttribute('data-aw-social-share');
    const url = encodeURIComponent(elem.getAttribute('data-aw-url'));
    const text = encodeURIComponent(elem.getAttribute('data-aw-text'));

    let href;
    switch (network) {
      case 'facebook':
        href = `https://www.facebook.com/sharer.php?u=${url}`;
        break;
      case 'twitter':
        href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
        break;
      case 'whatsapp':
        href = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'mail':
        href = `mailto:?subject=%22${text}%22&body=${text}%20${url}`;
        break;

      default:
        return;
    }

    const newlink = document.createElement('a');
    newlink.target = '_blank';
    newlink.href = href;
    newlink.click();
  });

  // scroll to top handler
  function appyHeaderStylesOnScroll() {
    const header = document.getElementById('header');
    if (lastKnownScrollPosition > 60 && !header.classList.contains('scroll')) {
      document.getElementById('header').classList.add('scroll');
    } else if (lastKnownScrollPosition <= 60 && header.classList.contains('scroll')) {
      document.getElementById('header').classList.remove('scroll');
    }
    ticking = false;
  }
  appyHeaderStylesOnScroll();

  attachEvent([document], 'scroll', function () {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        appyHeaderStylesOnScroll();
      });
      ticking = true;
    }
  });

  // enable medium zoom behavior
  mediumZoom(document.querySelectorAll('.img-zoomable'));
};

// on page show functions
window.onpageshow = function () {
  document.documentElement.classList.add('motion-safe:scroll-smooth');
  const elem = document.querySelector('[data-aw-toggle-menu]');
  if (elem) {
    elem.classList.remove('expanded');
  }

  document.body.classList.remove('overflow-hidden');
  document.getElementById('header')?.classList.remove('h-screen');
  document.querySelector('#header nav')?.classList.add('hidden');
};
