import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Standard fade up animation for sections
export const fadeUp = (element, delay = 0) => {
    if (!element) return;
    return gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: delay,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        }
    );
};

// Staggered reveal for grids (products, features)
export const staggerContainer = (elements, staggerTime = 0.1) => {
    return gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: staggerTime,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: elements[0], // Trigger based on the first element
                start: 'top 90%',
            },
        }
    );
};

// Smooth page transition overlay
export const pageTransition = () => {
    const tl = gsap.timeline();
    tl.to('.page-transition-overlay', {
        scaleY: 1,
        transformOrigin: 'bottom',
        duration: 0.5,
        ease: 'power4.inOut',
    }).to('.page-transition-overlay', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.5,
        ease: 'power4.inOut',
        delay: 0.1,
    });
    return tl;
};

// Hover effect for buttons
export const magneticHover = (element) => {
    const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3" });

    element.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = element.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        xTo(x * 0.3);
        yTo(y * 0.3);
    });

    element.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
    });
};
