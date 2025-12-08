document$.subscribe(() => {
  const hideIfSingle = (selector) => {
    // Only hide sidebars on desktop (min-width: 76.25rem = 1220px)
    if (window.innerWidth < 1220) return;

    const sidebar = document.querySelector(selector);
    if (!sidebar) return;

    const list = sidebar.querySelector('nav > ul.md-nav__list');
    if (!list) return;

    const links = Array.from(list.querySelectorAll('li.md-nav__item > a.md-nav__link')).filter(
      (link) => link.offsetParent !== null
    );

    if (links.length <= 1) {
      sidebar.classList.add('is-hidden-single');
    } else {
      sidebar.classList.remove('is-hidden-single');
    }
  };

  hideIfSingle('.md-sidebar--primary');
  hideIfSingle('.md-sidebar--secondary');

  // Make repository link and social links open in new tab
  const repoLink = document.querySelector('.md-source');
  if (repoLink) {
    repoLink.setAttribute('target', '_blank');
    repoLink.setAttribute('rel', 'noopener noreferrer');
  }

  // Also apply to social links in footer
  document.querySelectorAll('.md-footer__link, .md-social__link').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
});
