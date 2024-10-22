import React, { useEffect, useState } from 'react';

const FAQAccordion = ({ faqs }) => {
    // State to manage the currently open accordion item
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        console.log("faqs : ", faqs);
    }, [faqs]);
    // Function to handle the accordion toggle
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full">
            {faqs.map((faq, index) => (
                <div key={faq.id} className="mb-4 border border-gray-300 rounded-lg shadow-md overflow-hidden">
                    <div
                        className="flex justify-between items-center p-4 bg-orange-400 cursor-pointer hover:bg-orange-300 transition"
                        onClick={() => toggleAccordion(index)}
                    >
                        <h5 className="font-semibold text-lg text-white">{faq.message}</h5>
                        <span className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"}`}>
                            ▼
                        </span>
                    </div>
                    <div
                        className={`p-4 bg-white transition-max-height duration-500 ease-in-out ${openIndex === index ? "max-h-screen" : "hidden"} overflow-hidden`}
                        style={{ transition: 'max-height 0.5s ease-in-out' }}
                    >
                        <p className="text-gray-700 whitespace-pre-line">{faq.response}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;
