import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import images
import iconChemistry from '../assets/img/icons/icon-09.png';
import iconPhysics from '../assets/img/icons/icon-10.png';
import iconLanguage from '../assets/img/icons/icon-11.png';
import iconBusiness from '../assets/img/icons/icon-12.png';
import iconPhotography from '../assets/img/icons/icon-08.png';
import iconRocketScience from '../assets/img/icons/icon-07.png';
import iconMath from '../assets/img/icons/icon-06.png';
import iconFoodRecipe from '../assets/img/icons/icon-05.png';
import selfDevelopment from '../assets/self-development.png'
import developpementLogiciel from '../assets/developpement-de-logiciels.png'
import hygiene from '../assets/hygiene.png'
import ideation from '../assets/ideation.png'
import background from '../assets/images/home/brainstorm-meeting.jpg';

const TrendingCategories = () => {
    const { t } = useTranslation(['home/trendingCategories']);

    const categories = [
        { img: selfDevelopment, name: t('physics') },
        { img: ideation, name: t('Systéme d’Information') },
        { img: developpementLogiciel, name: t('Business Intelligence') },
        { img: ideation, name: t('language') },
        { img: developpementLogiciel, name: t('business') },
        { img: hygiene, name: t('Santé et sécurité') },
        { img: selfDevelopment, name: t('Coaching et développement ...') },
        { img: developpementLogiciel, name: t('Informatique') },
        { img: hygiene, name: t('Gestion des risques') },
        { img: ideation, name: t('chemistry') },
    ];

    return (
        <section
            className="cover-background dark-overlay"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}
        >
            <div className="overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="section-heading text-center">
                            <span className="sub-title">{t('instructors')}</span>
                            <h2 className="h1 mb-0">{t('popularCategories')}</h2>
                        </div>
                    </div>
                </div>
                <div className="row mt-n1-9 justify-center flex flex-wrap">
                {categories.map((category, index) => (
                    <div
                    className="col-sm-6 col-lg-4 col-xl-3 mt-6 h-40 flex"
                    key={index}
                    >
                    <Link
                        to="/courses-list"
                        className="category-item-01 flex flex-col items-center justify-center text-center bg-white/60 rounded-lg p-4 w-full h-full"
                    >
                        <div className="category-img">
                        <img src={category.img} alt={category.name} className="w-12 h-12" />
                        </div>
                        <div className="mt-3">
                        <h3 className="text-lg font-semibold text-black w-full truncate">
                            {category.name}
                        </h3>
                        </div>
                    </Link>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingCategories;
