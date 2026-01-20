<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<script // Navlinks
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                // Remove active from all links
                navLinks.forEach(l => l.classList.remove('active'));

                // Add active to the clicked link
                this.classList.add('active');
            });
        });

        // Hero section
        const articles = document.querySelectorAll('.hero-article');
        let current = 0;

        function showNextArticle() {
            articles[current].classList.remove('active');
            current = (current + 1) % articles.length;
            articles[current].classList.add('active');

            // For mobile: set background image
            if (window.innerWidth <= 991) {
                articles[current].querySelector('.hero-content').style.backgroundImage = articles[current].dataset.bg;
                articles.forEach((article, index) => {
                    if (index !== current) article.querySelector('.hero-content').style.backgroundImage = '';
                });
            } else {
                articles[current].querySelector('.hero-content').style.backgroundImage = '';
            }
        }

        setInterval(showNextArticle, 5000); // every 5 seconds

        // Services section
        const links = document.querySelectorAll('.sidebar-link');
        const sections = document.querySelectorAll('.content-section');

        links.forEach(link => {
            link.addEventListener('click', () => {

                // Remove active from all links
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Hide all content sections
                sections.forEach(sec => sec.classList.remove('active'));

                // Show targeted section
                const target = link.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });

        // Projects Carousel 
        const track = document.querySelector('.slider-track');
        const slides = document.querySelectorAll('.slide');
        const dotsContainer = document.querySelector('.slider-dots');

        let currentIndex = 0;

        function getVisibleSlides() {
            return parseInt(
                getComputedStyle(document.querySelector('.slider-container'))
                    .getPropertyValue('--slides-visible')
            );
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            const visible = getVisibleSlides();
            const total = slides.length;

            for (let i = 0; i <= total - visible; i++) {
                const dot = document.createElement('span');
                if (i === currentIndex) dot.classList.add('active');
                dot.onclick = () => {
                    currentIndex = i;
                    updateSlider();
                };
                dotsContainer.appendChild(dot);
            }
        }

        function updateSlider() {
            const slideWidth = slides[0].offsetWidth + 20;
            track.style.transform = translateX(-${ currentIndex * slideWidth}px);

            document.querySelectorAll('.slider-dots span').forEach(d => d.classList.remove('active'));
            if (dotsContainer.children[currentIndex])
                dotsContainer.children[currentIndex].classList.add('active');
        }

        setInterval(() => {
            const visible = getVisibleSlides();
            const max = slides.length - visible;

            currentIndex = currentIndex >= max ? 0 : currentIndex + 1;
            updateSlider();
        }, 3000);

        window.addEventListener('resize', () => {
            currentIndex = 0;
            createDots();
            updateSlider();
        });

        createDots();
        updateSlider();

        // Testimonials Cards Carousel
        document.addEventListener('DOMContentLoaded', () => {

            const track = document.querySelector('.testimonials-wrapper');
            const dotsContainer = document.querySelector('.testimony-dots');
            const originalSlides = Array.from(document.querySelectorAll('.testimonial-cards'));

            let slides = [];
            let index = 0;
            let interval;
            const gap = 20;

            /* Swipe vars */
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            const swipeThreshold = 50;

            /* Helpers */

            function getVisibleSlides() {
                return parseInt(
                    getComputedStyle(track).getPropertyValue('--slides-available')
                );
            }

            function debounce(fn, delay = 300) {
                let timer;
                return () => {
                    clearTimeout(timer);
                    timer = setTimeout(fn, delay);
                };
            }

            /* Init Slider */

            function initSlider() {
                clearInterval(interval);

                // reset track
                track.innerHTML = '';
                originalSlides.forEach(slide => track.appendChild(slide));

                const visible = getVisibleSlides();

                // clone slides
                const firstClones = originalSlides.slice(0, visible).map(s => s.cloneNode(true));
                const lastClones = originalSlides.slice(-visible).map(s => s.cloneNode(true));

                lastClones.forEach(c => track.insertBefore(c, track.firstChild));
                firstClones.forEach(c => track.appendChild(c));

                slides = Array.from(track.children);

                index = visible;
                createDots();
                moveSlider(true);
                startAuto();
            }

            /* Dots */

            function createDots() {
                dotsContainer.innerHTML = '';

                originalSlides.forEach((_, i) => {
                    const dot = document.createElement('span');
                    if (i === 0) dot.classList.add('active');

                    dot.addEventListener('click', () => {
                        index = i + getVisibleSlides();
                        moveSlider();
                    });

                    dotsContainer.appendChild(dot);
                });
            }

            /* Move Slider */

            function moveSlider(noAnim = false) {
                track.style.transition = noAnim ? 'none' : 'transform 0.5s ease';

                const slideWidth = slides[0].offsetWidth + gap;
                track.style.transform = translateX(-${ index * slideWidth}px);

                const visible = getVisibleSlides();
                const realIndex =
                    (index - visible + originalSlides.length) % originalSlides.length;

                [...dotsContainer.children].forEach(d => d.classList.remove('active'));
                if (dotsContainer.children[realIndex]) {
                    dotsContainer.children[realIndex].classList.add('active');
                }
            }

            /* Auto Slide */

            function startAuto() {
                interval = setInterval(() => {
                    index++;
                    moveSlider();

                    const visible = getVisibleSlides();

                    if (index >= originalSlides.length + visible) {
                        setTimeout(() => {
                            index = visible;
                            moveSlider(true);
                        }, 500);
                    }
                }, 3500);
            }

            /* Swipe / Drag Support */

            function dragStart(x) {
                isDragging = true;
                startX = x;
                clearInterval(interval);
            }

            function dragMove(x) {
                if (!isDragging) return;
                currentX = x;
            }

            function dragEnd() {
                if (!isDragging) return;

                const diff = currentX - startX;

                if (Math.abs(diff) > swipeThreshold) {
                    diff < 0 ? index++ : index--;
                    moveSlider();
                }

                isDragging = false;
                startAuto();
            }

            /* TOUCH */
            track.addEventListener('touchstart', e => dragStart(e.touches[0].clientX));
            track.addEventListener('touchmove', e => dragMove(e.touches[0].clientX));
            track.addEventListener('touchend', dragEnd);

            /* MOUSE */
            track.addEventListener('mousedown', e => {
                e.preventDefault();
                dragStart(e.clientX);
            });
            track.addEventListener('mousemove', e => dragMove(e.clientX));
            track.addEventListener('mouseup', dragEnd);
            track.addEventListener('mouseleave', dragEnd);

            /* Resize */

            window.addEventListener(
                'resize',
                debounce(() => initSlider(), 300)
            );

            /* Start */

            initSlider();

        });</script>
</body>

</html>