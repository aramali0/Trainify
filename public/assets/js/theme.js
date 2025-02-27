/*
Template Name: Prompt - Tailwind Study Client & Admin Manage HTML Template
Version: 1.0
Author: coderthemes
Email: support@coderthemes.com
*/


import { createIcons, icons } from "lucide";
import SimpleBar from "simplebar";
window.SimpleBar = SimpleBar;
import "preline";

function init() {
    createIcons({ icons });

    // Topbar Sticky
    function initStickyNav() {
        function windowScroll() {
            const navbar = document.getElementById("navbar");
            if (navbar) {
                if (
                    document.body.scrollTop >= 75 ||
                    document.documentElement.scrollTop >= 75
                ) {
                    navbar.classList.add("nav-sticky");
                } else {
                    navbar.classList.remove("nav-sticky");
                }
            }
        }

        window.addEventListener("scroll", (ev) => {
            ev.preventDefault();
            windowScroll();
        });
    }

    // Topnav Active Menu
    function initNavLinkActive() {
        // Menu Active
        const pageUrl = window.location.href.split(/[?#]/)[0];
        const navbarLinks = Array.from(document.querySelectorAll(".menu a"));

        navbarLinks.forEach((link) => {
            if (link.href === pageUrl) {
                link.classList.add("active");

                const parentMenu = link.parentElement.parentElement.parentElement;
                if (parentMenu?.classList.contains("menu-item")) {
                    const dropdownElement = parentMenu.querySelector(
                        ".hs-dropdown-toggle"
                    );
                    dropdownElement?.classList.add("active");
                }

                const parentParentMenu =
                    link.parentElement.parentElement.parentElement.parentElement
                        .parentElement;
                if (parentParentMenu?.classList.contains("menu-item")) {
                    const dropdownElement = parentParentMenu.querySelector(
                        ".hs-dropdown-toggle"
                    );
                    dropdownElement?.classList.add("active");
                }
            }
        });
    }

    function initAdminLinkActive() {
        var self = this;
        var pageUrl = window.location.href.split(/[?#]/)[0];
        document
            .querySelectorAll("ul.admin-menu .menu-item a")
            .forEach((element) => {
                if (element.href === pageUrl) {
                    element.classList.add("active");

                    let parentMenu =
                        element.parentElement.parentElement.parentElement.parentElement;
                    if (parentMenu && parentMenu.classList.contains("menu-item")) {
                        const collapseElement =
                            parentMenu.querySelector("[data-hs-collapse]");

                        if (collapseElement) {
                            collapseElement.classList.add("active");
                            collapseElement.classList.add("open");
                            const nextE = collapseElement.nextElementSibling;
                            // console.info(nextE)
                            if (nextE) {
                                nextE.classList.remove("hidden");
                                // console.info((new HSCollapse(nextE)).show())
                                // console.info(HSCollapse.getInstance(nextE, true))
                                // HSCollapse.show(nextE)
                            }
                        }
                    }
                }
            });

        // Hide other collapse when click on collapse
        const allCollapse = document.querySelectorAll("ul.admin-menu .hs-collapse");
        allCollapse.forEach((element) => {
            element.addEventListener("open.hs.collapse", (evt) => {
                allCollapse.forEach((sElement) => {
                    if (sElement !== evt.target) {
                        // HSCollapse.hide(sElement);
                    }
                });
            });
        });

        setTimeout(function () {
            var activatedItem = document.querySelector("ul.admin-menu .active");
            if (activatedItem != null) {
                var simplebarContent = document.querySelector(
                    "#application-sidebar .simplebar-content-wrapper"
                );
                var offset = activatedItem.offsetTop - 300;
                if (simplebarContent && offset > 100) {
                    scrollTo(simplebarContent, offset, 600);
                }
            }
        }, 200);

        // scrollTo (Sidenav Active Menu)
        function easeInOutQuad(t, b, c, d) {
            return (
                (t /= d / 2),
                t < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b
            );
        }

        function scrollTo(element, to, duration) {
            var start = element.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;
            var animateScroll = function () {
                currentTime += increment;
                var val = easeInOutQuad(currentTime, start, change, duration);
                element.scrollTop = val;
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            animateScroll();
        }
    }

    // Back To Top
    function initBacktoTop() {
        const mybutton = document.querySelector('[data-toggle="back-to-top"]');

        window.addEventListener("scroll", function () {
            if (mybutton) {
                if (window.pageYOffset > 72) {
                    mybutton.classList.remove("opacity-0");
                    mybutton.classList.add("h-8");
                    mybutton.classList.remove("h-0");
                    mybutton.classList.remove("translate-y-5");
                } else {
                    mybutton.classList.add("opacity-0");
                    mybutton.classList.remove("h-8");
                    mybutton.classList.add("h-0");
                    mybutton.classList.add("translate-y-5");
                }
            }
        });

        if (mybutton) {
            mybutton.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    }

    function initPassword() {
        document.querySelectorAll("[data-x-password]").forEach((element) => {
            const password = element.querySelector(".form-password");
            const passwordEyeOn = element.querySelector(".password-eye-on");
            const passwordEyeOff = element.querySelector(".password-eye-off");

            if (password && passwordEyeOn && passwordEyeOff) {
                passwordEyeOff.classList.add("hidden");
                passwordEyeOn.addEventListener("click", (ev) => {
                    passwordEyeOn.classList.add("hidden");
                    passwordEyeOff.classList.remove("hidden");
                    password.type = "text";
                });
                passwordEyeOff.addEventListener("click", (ev) => {
                    passwordEyeOff.classList.add("hidden");
                    passwordEyeOn.classList.remove("hidden");
                    password.type = "password";
                });
            }
        });
    }

    function initfullScreenListener() {
        var self = this;
        var fullScreenBtn = document.querySelector('[data-toggle="fullscreen"]');

        if (fullScreenBtn) {
            fullScreenBtn.addEventListener("click", function (e) {
                e.preventDefault();
                document.body.classList.toggle("open");
                if (
                    !document.fullscreenElement &&
                    !document.mozFullScreenElement &&
                    !document.webkitFullscreenElement
                ) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(
                            Element.ALLOW_KEYBOARD_INPUT
                        );
                    }
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            });
        }
    }


    initStickyNav();
    initNavLinkActive();
    initAdminLinkActive();
    initBacktoTop();
    initPassword();
    initfullScreenListener()
}

init();
