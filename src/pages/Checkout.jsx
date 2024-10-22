import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '../helper/axios';
import { getUser, isAuthenticated } from '../helper/auth';

const stripePromise = loadStripe('pk_test_51Pr6G0FQJoPlDgUgPc5Apt7y0yPx99vj5CtdJnhLrwYZaOTiNOS89eHqNw8zcp7WX0uc0qfhfIHxvOoa6oysHZng00R6xF2J0G'); // Your Stripe public key

const Checkout = ({ plan, price }) => {
    var userId = null;
    if (isAuthenticated()) {
        userId = getUser().userId;
    }
    const handleCheckout = async () => {
        try {
            const response = await axiosInstance.post('/payment/create-checkout-session', {
                userId: Number(userId),
                amount: price * 100,  
                plan: plan,
            });
            const sessionId = response.data.id;

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Error redirecting to checkout:', error);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    return (
        <div>
            <button onClick={handleCheckout} className="butn md">
                Choose Plan
            </button>
        </div>
    );
};

export default Checkout;
