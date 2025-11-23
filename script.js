document.addEventListener("DOMContentLoaded", function() {
    // Remove loader when page is loaded
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 500);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active section highlighting in navbar
    const sections = document.querySelectorAll('section');
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            
            themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Project filtering
    // ===== Show only matched & center them (fixed-size grouped view) =====
(function () {
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const projectGrid = document.querySelector('.project-grid');
  if (!projectGrid || !filterButtons.length) return;

  function getProjects() {
    return Array.from(projectGrid.querySelectorAll('.project'));
  }

  // Show only matched projects, hide others; return matched array
  function showOnlyMatched(filterValue) {
    const norm = (filterValue || 'all').trim();
    const projects = getProjects();
    const matched = [];

    projects.forEach(p => {
      const cats = (p.getAttribute('data-category') || '').split(',').map(s => s.trim());
      const isMatch = (norm === 'all') || cats.includes(norm);

      p.classList.remove('focused');
      if (isMatch) {
        p.classList.remove('hidden');
        matched.push(p);
      } else {
        p.classList.add('hidden');
      }

      // remove inline height/display overrides if any
      p.style.height = '';
      p.style.display = '';
    });

    return matched;
  }

  // enable group-view (fixed column width) when filtering (except 'all')
  function setGroupView(enabled) {
    if (enabled) projectGrid.classList.add('group-view');
    else projectGrid.classList.remove('group-view');
  }

  // Center group horizontally inside grid and vertically in viewport
  function centerMatchedGroup(matched) {
    if (!matched.length) return;
    const first = matched[0];
    const last = matched[matched.length - 1];

    // Horizontal center based on offsetLeft (position inside the grid)
    const leftMost = first.offsetLeft;
    const rightMost = last.offsetLeft + last.offsetWidth;
    const centerX = (leftMost + rightMost) / 2;

    // target scrollLeft so centerX is centered in grid viewport
    const targetScrollLeft = Math.max(0, Math.round(centerX - (projectGrid.clientWidth / 2)));
    projectGrid.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });

    // Vertical centering: use group top/bottom bounds
    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    const groupTopDoc = window.scrollY + Math.min(firstRect.top, lastRect.top);
    const groupBottomDoc = window.scrollY + Math.max(firstRect.bottom, lastRect.bottom);
    const centerYDoc = (groupTopDoc + groupBottomDoc) / 2;

    const headerOffset = 80; // adjust if your header height differs
    const targetScrollTop = Math.max(0, Math.round(centerYDoc - (window.innerHeight / 2) + headerOffset));
    window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });

    // subtle focused lift (no scaling)
    matched.forEach(m => m.classList.add('focused'));
    setTimeout(() => matched.forEach(m => m.classList.remove('focused')), 1200);
  }

  // full handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const value = btn.getAttribute('data-filter') || 'all';

      // Show/hide matched projects
      const matched = showOnlyMatched(value);

      // Toggle group-view: only when not 'all'
      setGroupView(value !== 'all');

      // center after a short delay to let layout settle
      setTimeout(() => {
        if (value === 'all') {
          // Scroll page to projects section top (optional)
          document.querySelector('#projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          centerMatchedGroup(matched);
        }
      }, 140);
    });
  });

  // initial cleanup on load
  window.addEventListener('load', () => {
    getProjects().forEach(p => { p.classList.remove('hidden', 'focused'); p.style.display = ''; p.style.height = ''; });
    projectGrid.classList.remove('group-view');
  });

  // clear inline sizes on resize
  let rto;
  window.addEventListener('resize', () => {
    clearTimeout(rto);
    rto = setTimeout(() => {
      getProjects().forEach(p => { p.style.height = ''; p.style.display = ''; });
    }, 180);
  });
})();


    // Animate skill bars on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    
    function animateSkills() {
        skillItems.forEach(item => {
            const percent = item.getAttribute('data-percent');
            const progressBar = item.querySelector('.skill-progress');
            
            if (isElementInViewport(item)) {
                progressBar.style.width = `${percent}%`;
            }
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);

    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Simulate form submission
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                this.reset();
                
                setTimeout(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // Hover effects on skills
    document.querySelectorAll('.skills-container li').forEach(skill => {
        skill.addEventListener('mouseover', () => {
            skill.style.transform = 'scale(1.1)';
            skill.style.transition = 'transform 0.3s ease';
        });
        skill.addEventListener('mouseout', () => {
            skill.style.transform = 'scale(1)';
        });
    });

    // Alert when clicking contact links (external)
    document.querySelectorAll('#contact a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm(`You are about to visit: ${this.href}\nContinue?`)) {
                e.preventDefault();
            }
        });
    });

    // Intersection Observer for scroll animations
    const animateOnScroll = (elements, className) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Animate sections when they come into view
    const sectionsToAnimate = document.querySelectorAll('section');
    animateOnScroll(sectionsToAnimate, 'animate-section');

    // Animate project cards
    const projectsToAnimate = document.querySelectorAll('.project');
    animateOnScroll(projectsToAnimate, 'animate-project');
});

// Helper function for scroll animations
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
// ------------ Make entire project card open its live link (optional) ------------
document.addEventListener('click', function(e) {
    // if click inside a project card but not on a link/button, open the live link (if present)
    const projectCard = e.target.closest && e.target.closest('.project');
    if (!projectCard) return;

    // if the exact element clicked is a link, let default behaviour happen
    if (e.target.closest('a')) return;

    // find a live link inside the card (prefer external link icon or anchor in .project-image)
    const live = projectCard.querySelector('a[target="_blank"][href*="http"]');
    if (live) {
        window.open(live.href, '_blank');
    }
});
/* Timeline filter + alternating sides + expand/collapse */
(function () {
  const filterBtns = Array.from(document.querySelectorAll('.exp-filter-btn'));
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const items = Array.from(timeline.querySelectorAll('.timeline-item'));

  // helper: apply side classes alternating among visible items
  function alternateSides() {
    const visible = items.filter(i => !i.classList.contains('hidden'));
    visible.forEach((it, idx) => {
      it.classList.remove('side-left', 'side-right');
      // even index -> left, odd -> right (0-based)
      if (idx % 2 === 0) it.classList.add('side-left');
      else it.classList.add('side-right');
    });
  }

  // filter handler
  function applyFilter(filter) {
    const norm = (filter || 'all').trim();
    items.forEach(it => {
      const type = (it.getAttribute('data-type') || 'work').trim();
      if (norm === 'all' || type === norm) it.classList.remove('hidden');
      else it.classList.add('hidden');
    });
    alternateSides();
    // scroll first visible into view
    const first = timeline.querySelector('.timeline-item:not(.hidden)');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // attach filter button handlers (if present)
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // initial alternation
  alternateSides();

  // expand/collapse on click + keyboard
  items.forEach(it => {
    // start collapsed on small screens
    if (window.innerWidth < 900) it.classList.add('collapsed');

    it.setAttribute('tabindex', '0');
    it.setAttribute('aria-expanded', it.classList.contains('collapsed') ? 'false' : 'true');

    it.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      toggleItem(it);
    });

    it.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(it);
      }
    });
  });

  function toggleItem(it) {
    const collapsed = it.classList.toggle('collapsed');
    it.classList.toggle('expanded', !collapsed);
    it.setAttribute('aria-expanded', !collapsed);
    // smooth scroll this item into center
    setTimeout(() => it.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }

  // recompute sides on resize (when breakpoint crosses)
  let rto;
  window.addEventListener('resize', () => {
    clearTimeout(rto);
    rto = setTimeout(() => {
      // on small screens keep items full width and no left/right; but maintain classes
      if (window.innerWidth < 900) {
        items.forEach(it => {
          it.classList.remove('side-left', 'side-right');
          it.classList.add('collapsed');
        });
      } else {
        items.forEach(it => it.classList.remove('collapsed'));
        alternateSides();
      }
    }, 180);
  });
})();
/* Skills: animate progress bars when visible */
(function () {
  const skillCards = Array.from(document.querySelectorAll('.skill-card'));
  if (!skillCards.length) return;

  function animateCard(card) {
    const pct = parseInt(card.getAttribute('data-proficiency') || '0', 10);
    const fill = card.querySelector('.skill-fill');
    if (fill) fill.style.width = pct + '%';
  }

  // trigger when section visible
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) {
    // fallback animate all
    skillCards.forEach(animateCard);
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillCards.forEach(animateCard);
        obs.disconnect();
      }
    });
  }, { root: null, threshold: 0.12 });

  io.observe(skillsSection);
})();
