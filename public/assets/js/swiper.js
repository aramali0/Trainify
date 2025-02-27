import Swiper from "swiper";
import { FreeMode, Navigation, Pagination, Autoplay, Scrollbar, Mousewheel, EffectFade, EffectCoverflow, EffectFlip, EffectCreative } from "swiper/modules";

new Swiper(".default-swiper", {
    modules: [Autoplay],
    loop: !0,
    autoplay: { delay: 2500, disableOnInteraction: !1 },
}),
    new Swiper(".navigation-swiper", {
        modules: [Navigation, Pagination, Autoplay],
        loop: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: { clickable: true, el: ".swiper-pagination" },
    }),
    new Swiper(".pagination-dynamic-swiper", {
        modules: [Pagination, Autoplay],
        loop: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { clickable: true, el: ".swiper-pagination", dynamicBullets: !0 },
    }),
    new Swiper(".pagination-fraction-swiper", {
        modules: [Navigation, Pagination, Autoplay],
        loop: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { clickable: true, el: ".swiper-pagination", type: "fraction" },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    }),
    new Swiper(".pagination-custom-swiper", {
        modules: [Pagination, Autoplay],
        loop: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: {
            clickable: true,
            el: ".swiper-pagination",
            renderBullet: function (e, i) {
                return '<span class="' + i + '">' + (e + 1) + "</span>";
            },
        },
    }),
    new Swiper(".pagination-progress-swiper", {
        modules: [Navigation, Pagination, Autoplay],
        loop: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", type: "progressbar" },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    }),
    new Swiper(".pagination-scrollbar-swiper", {
        modules: [Navigation, Autoplay, Scrollbar],
        loop: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        scrollbar: { el: ".swiper-scrollbar", hide: !0 },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    }),
    new Swiper(".vertical-swiper", {
        modules: [Pagination, Autoplay],
        loop: !0,
        direction: "vertical",
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", clickable: true },
    }),
    new Swiper(".mousewheel-control-swiper", {
        modules: [Pagination, Autoplay, Mousewheel],
        loop: !0,
        direction: "vertical",
        mousewheel: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", clickable: true },
    }),
    new Swiper(".effect-fade-swiper", {
        modules: [Pagination, Autoplay, EffectFade],
        loop: !0,
        effect: "fade",
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", clickable: true },
    }),
    new Swiper(".effect-coverflow-swiper", {
        modules: [Pagination, Autoplay, EffectCoverflow],
        loop: !0,
        effect: "coverflow",
        grabCursor: !0,
        centeredSlides: !0,
        slidesPerView: "4",
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: !0,
        },
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: !0 },
    }),
    new Swiper(".effect-flip-swiper", {
        modules: [Pagination, Autoplay, EffectFlip],
        loop: !0,
        effect: "flip",
        grabCursor: !0,
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", clickable: true },
    }),
    new Swiper(".effect-creative-swiper", {
        modules: [Pagination, Autoplay, EffectCreative],
        loop: !0,
        grabCursor: !0,
        effect: "creative",
        creativeEffect: {
            prev: { shadow: !0, translate: [0, 0, -400] },
            next: { translate: ["100%", 0, 0] },
        },
        autoplay: { delay: 2500, disableOnInteraction: !1 },
        pagination: { el: ".swiper-pagination", clickable: true },
    }),
    new Swiper(".responsive-swiper", {
        modules: [Pagination],
        loop: !0,
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 40 },
            1200: { slidesPerView: 4, spaceBetween: 50 },
        },
    });
