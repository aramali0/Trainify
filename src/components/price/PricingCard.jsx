import React from 'react';
import PropTypes from 'prop-types';
import Checkout from '../../pages/Checkout';

const PricingCard = ({ plan, price, per, features, popular }) => (
    <div className={`col-md-6 col-lg-4 mt-1-9 ${popular ? 'border border-width-2 border-color-primary' : ''}`}>
        <div className="card card-style4 p-1-9 p-xl-5">
            <div className="border-bottom pb-1-9 mb-1-9">
                <h6 className="mb-4 text-uppercase letter-spacing-2 text-primary">{plan}</h6>
                <h4 className="text-dark display-5 display-xxl-4 mb-0 lh-1">
                    {price} <span className='display-29' >MAD</span><span className="display-29">/{per}</span>
                </h4>
            </div>
            <ul className="list-unstyled mb-2-9">
                {features.map((feature, index) => (
                    <li key={index} className="mb-3">
                        <i className={`ti-${feature.includes('300+') ? 'close' : 'check'} text-primary me-3`}></i>
                        {feature}
                    </li>
                ))}
            </ul>
            <div>
                <Checkout plan={plan} price={parseFloat(price.replace('$', ''))} />  {/* Pass props to Checkout */}
            </div>
        </div>
    </div>
);

PricingCard.propTypes = {
    plan: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    per: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    popular: PropTypes.bool,
};

export default PricingCard;
