document$.subscribe(() => {
  const hideIfSingle = (selector) => {
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
});
