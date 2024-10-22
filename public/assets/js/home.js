//
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
window.Swiper = Swiper;

function courses_swiper() {
    new Swiper(".courses_swiper", {
        module:[ Navigation ],
        spaceBetween: 12,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
    
            768: {
                slidesPerView: 2,
    
            },
            1300: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
    });
}
courses_swiper();

function testimonial() {
    new Swiper(".testimonial-swiper", {
        spaceBetween: 12,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}
testimonial();

function popular_course() {
    new Swiper(".popular_course", {
        spaceBetween: 12,
        freeMode: true,
        pagination: {
            el: ".popular-course-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        breakpoints: {
            320: {
                slidesPerView: 1,
            },
    
            600: {
                slidesPerView: 2,
                spaceBetween: 30,
    
            },
            1400: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });
}
popular_course();

function swiper_instructor() {
    new Swiper(".swiper-instructor", {
        modules: [Navigation],
        spaceBetween: 12,
        navigation: {
            prevEl: ".swiper-button-next",
            nextEl: ".swiper-button-prev",
        },
    });
}
swiper_instructor();