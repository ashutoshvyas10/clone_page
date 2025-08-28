// Navigation functionality
class NavigationManager {
  constructor() {
    this.currentPage = 'home';
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.pages = document.querySelectorAll('.page');
    
    this.init();
  }

  init() {
    // Set up event listeners
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupScrollEffect();
    this.setupFooterNavigation();
    
    // Initialize contact form
    this.setupContactForm();
  }

  setupNavigation() {
    // Handle navigation clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
        }
      });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || 'home';
      this.navigateTo(page, false);
    });

    // Set initial page based on URL hash
    const initialPage = window.location.hash.slice(1) || 'home';
    this.navigateTo(initialPage, false);
  }

  setupMobileMenu() {
    this.navToggle.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
      this.navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
      }
    });
  }

  setupScrollEffect() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow on scroll
      if (currentScrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  }

  setupFooterNavigation() {
    // Handle footer navigation links
    const footerLinks = document.querySelectorAll('footer a[data-page]');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
        }
      });
    });
  }

  navigateTo(page, updateHistory = true) {
    // Update current page
    this.currentPage = page;

    // Update active nav link
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === page) {
        link.classList.add('active');
      }
    });

    // Show/hide pages
    this.pages.forEach(pageElement => {
      pageElement.classList.remove('active');
      if (pageElement.id === `${page}-page`) {
        pageElement.classList.add('active');
      }
    });

    // Update URL and browser history
    if (updateHistory) {
      const url = page === 'home' ? '/' : `/#${page}`;
      window.history.pushState({ page }, '', url);
    }

    // Update page title
    this.updatePageTitle(page);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePageTitle(page) {
    const titles = {
      'home': 'Vishvena - AI Solutions',
      'about': 'About Us - Vishvena',
      'contact': 'Contact Us - Vishvena'
    };
    document.title = titles[page] || 'Vishvena';
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleContactForm.bind(this));
    }
  }

  handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission (in real app, this would send to backend)
    this.simulateFormSubmission(data);
  }

  simulateFormSubmission(data) {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // Show success message
      this.showSuccessMessage();
      
      // Reset form
      form.reset();
      
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      console.log('Form submitted:', data);
    }, 1500);
  }

  showSuccessMessage() {
    // Create success message element
    let successMessage = document.querySelector('.form-success');
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Thank you for your message! We'll get back to you within 24 hours.
      `;
      
      const form = document.getElementById('contact-form');
      form.insertBefore(successMessage, form.firstChild);
    }
    
    // Show and hide success message
    successMessage.classList.add('show');
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);
  }
}

// Animation utilities
class AnimationManager {
  constructor() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
      '.service-card, .industry-card, .team-member, .stat'
    );
    
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }

  setupHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', this.createRipple.bind(this));
    });
  }

  createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Smooth scrolling for anchor links
class SmoothScroll {
  constructor() {
    this.setupSmoothScroll();
  }

  setupSmoothScroll() {
    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target && target.getAttribute('href').length > 1) {
        e.preventDefault();
        const targetId = target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }
}

// Performance optimizations
class PerformanceOptimizer {
  constructor() {
    this.setupLazyLoading();
    this.setupImageOptimization();
  }

  setupLazyLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  setupImageOptimization() {
    // Add loading states to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  new NavigationManager();
  new AnimationManager();
  new SmoothScroll();
  new PerformanceOptimizer();

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-in {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    /* Initially hide elements that will be animated */
    .service-card,
    .industry-card,
    .team-member,
    .stat {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease-out;
    }
    
    .service-card.animate-in,
    .industry-card.animate-in,
    .team-member.animate-in,
    .stat.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  console.log('Vishvena AI Solutions website loaded successfully!');
});

// Export for potential testing
window.VishvenaApp = {
  NavigationManager,
  AnimationManager,
  SmoothScroll,
  PerformanceOptimizer
};