/* =========================================
   NexusDigital - Homepage Animations & Interactions
   ========================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Active Nav Link on Scroll
       ========================================= */
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const matchingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (matchingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                    matchingLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', setActiveLink);


    /* =========================================
       2. Scroll Reveal Animations (Restored Critical Viewport Fix)
       ========================================= */
    const scrollElements = document.querySelectorAll('[data-scroll]');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));


    /* =========================================
       3. Animated Counters
       ========================================= */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => animateCounter(counter));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) counterObserver.observe(statsContainer);


    /* =========================================
       4. Animated Progress Bars
       ========================================= */
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 200);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const progressWrapper = document.querySelector('.progress-wrapper');
    if (progressWrapper) progressObserver.observe(progressWrapper);


    /* =========================================
       5. Testimonials Slider
       ========================================= */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoSlideInterval;

    if (dotsContainer && slides.length > 0) {
        // Clear previous dots if any
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        const dots = document.querySelectorAll('.dot');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startAutoSlide() {
        if (slides.length > 0) {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    if (slides.length > 0) {
        startAutoSlide();
        const sliderWrapper = document.querySelector('.testimonial-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
            sliderWrapper.addEventListener('mouseleave', startAutoSlide);
        }
    }


    /* =========================================
       6. Chart Bar Animation (Why Us section)
       ========================================= */
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.bar-col');
                bars.forEach((bar, i) => {
                    const height = bar.style.height;
                    bar.style.height = '0';
                    setTimeout(() => {
                        bar.style.transition = 'height 0.8s ease';
                        bar.style.height = height;
                    }, i * 150);
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const chartCard = document.querySelector('.chart-card');
    if (chartCard) chartObserver.observe(chartCard);


    /* =========================================
       7. Video Modal (Play Button)
       ========================================= */
    const playBtn = document.querySelector('.play-btn');

    if (playBtn) {
        const modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.style.cssText = `
            display:none; position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.85); z-index:9999; justify-content:center;
            align-items:center; backdrop-filter:blur(5px);
        `;
        modal.innerHTML = `
            <div style="position:relative; width:90%; max-width:800px; aspect-ratio:16/9; border-radius:16px; overflow:hidden; background:#000;">
                <button id="close-modal" style="position:absolute; top:10px; right:10px; background:#00e1ff; border:none;
                    color:#000; width:35px; height:35px; border-radius:50%; cursor:pointer; font-size:1rem; z-index:10;">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; color:#94a3b8; font-size:1.2rem;">
                    <div style="text-align:center;">
                        <i class="fa-solid fa-play" style="font-size:4rem; color:#00e1ff; margin-bottom:20px; display:block;"></i>
                        <p style="font-family:'Outfit',sans-serif;">Agency Showreel — Coming Soon</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }


    /* =========================================
       8. Floating Shapes (Decorative)
       ========================================= */
    function createFloatingShapes() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const shapes = [
            { size: 60, top: '20%', left: '5%', delay: '0s', opacity: 0.08 },
            { size: 40, top: '60%', left: '8%', delay: '2s', opacity: 0.05 },
            { size: 80, top: '30%', right: '5%', delay: '1s', opacity: 0.06 },
        ];

        shapes.forEach(shape => {
            const el = document.createElement('div');
            el.style.cssText = `
                position: absolute;
                width: ${shape.size}px;
                height: ${shape.size}px;
                top: ${shape.top || 'auto'};
                left: ${shape.left || 'auto'};
                right: ${shape.right || 'auto'};
                border: 2px solid rgba(0, 225, 255, ${shape.opacity});
                border-radius: 50%;
                pointer-events: none;
                animation: float 8s ease-in-out infinite ${shape.delay};
            `;
            hero.appendChild(el);
        });
    }

    createFloatingShapes();


    /* =========================================
       9. Newsletter Form
       ========================================= */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                    btn.style.background = '';
                    newsletterForm.reset();
                }, 3000);
            }
        });
    }

});
