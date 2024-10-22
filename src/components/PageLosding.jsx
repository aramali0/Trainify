import React, { useEffect } from 'react';

const PageLoading = () => {
    useEffect(() => {
        const handleLoad = () => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.transition = 'opacity 0.5s ease-out';
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }
        };

        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    return (
        <div id="preloader">
            <div className="row loader">
                <div className="loader-icon"></div>
            </div>
        </div>
    );
};

export default PageLoading;

