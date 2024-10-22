import React, { useState } from 'react';
import axiosInstance from '../helper/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUserResponsablePage from './AddUserResponsablePage';
import AddResonsablePage from './AddResponsable';
import AddEntrepriseRes from './AddEntrepriseRes';
import i18next from 'i18next';

const AddResponsableAndEntreprisePage = () => {
    const [showResponsableForm, setShowResponsableForm] = useState(true);
    const [showEntreprisesForm, setShowEntreprisesForm] = useState(false);
    const [entreprise, setEntreprise] = useState({
        nomCommercial: '',
        numeroRC: '',
        numeroCNSS: '',
        numeroIF: '',
        numeroTP: '',
        nombreSalaries: '',
        hierarchicalUnitIds: [],
        responsableFormationIds: [],
    });

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            {showResponsableForm && (
            <AddResonsablePage setEntreprise={setEntreprise} setShowEntreprisesForm={setShowEntreprisesForm} setShowResponsableForm={setShowResponsableForm}/>
            )}

            {showEntreprisesForm && (
            <>
                <AddEntrepriseRes entreprise={entreprise} setEntreprise={setEntreprise} />
            </>
            )}
        </div>
    );
};

export default AddResponsableAndEntreprisePage;
