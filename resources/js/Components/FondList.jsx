import Fond from "@/Components/Fond.jsx";
import React, { useState, useEffect } from "react";


export function FondList({ fonds, activeFundId = null }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Détecter si on est sur mobile
    useEffect(() => {
        const checkIfMobile = () => {
            const newIsMobile = window.innerWidth < 768;
            if (newIsMobile !== isMobile) {
                setIsMobile(newIsMobile);
                // Réinitialiser le slide actuel quand on change de mode (mobile/desktop)
                setCurrentSlide(0);
            }
        };

        // Vérifier au chargement
        checkIfMobile();

        // Mettre à jour lors du redimensionnement
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, [isMobile]);

    const hasSlider = fonds.length > 3;
    const itemsPerSlide = isMobile ? 1 : 3;
    const totalSlides = hasSlider ? Math.ceil(fonds.length / itemsPerSlide) : 1;

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            // Avancer d'un seul slide à la fois
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            // Reculer d'un seul slide à la fois
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Réinitialiser le slide actuel quand le nombre de slides change
    useEffect(() => {
        // S'assurer que le slide actuel est valide
        if (currentSlide >= totalSlides) {
            setCurrentSlide(Math.max(0, totalSlides - 1));
        }
    }, [totalSlides, currentSlide]);

    const getCurrentFonds = () => {
        if (!hasSlider) return fonds;

        // Calcul précis de l'index de début et de fin en fonction du mode
        const start = currentSlide * itemsPerSlide;
        const end = Math.min(start + itemsPerSlide, fonds.length);

        // S'assurer que nous ne dépassons pas les limites du tableau
        return fonds.slice(start, end);
    };

    useEffect(() => {
        if (hasSlider && activeFundId) {
            const activeFundIndex = fonds.findIndex(fond => fond.id === activeFundId);
            if (activeFundIndex !== -1) {
                const targetSlide = Math.floor(activeFundIndex / itemsPerSlide);
                setCurrentSlide(targetSlide);
            }
        }
    }, [activeFundId, itemsPerSlide, hasSlider]);

    return (
        <>
            <section className="mt-4 w-full">
                <h3 className="sr-only">Fonds</h3>

                {hasSlider ? (
                    <div>
                        {/* Container des fonds */}
                        <div className="flex flex-col lg:flex-row w-full justify-between">
                            {getCurrentFonds().map((fond, index, array) => (
                                <Fond
                                    key={fond.id}
                                    foundName={fond.name}
                                    foundAmount={fond.amount}
                                    fond={fond}
                                    isActive={activeFundId === fond.id}
                                    isLast={index === array.length - 1}
                                />
                            ))}
                        </div>

                        {/* Navigation avec flèches et dots */}
                        <div className="flex justify-center items-center lg:mt-4 space-x-4">
                            {/* Bouton précédent */}
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className={`p-2 rounded-full ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Indicateurs de slide */}
                            <div className="flex space-x-2">
                                {Array.from({ length: totalSlides }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Bouton suivant */}
                            <button
                                onClick={nextSlide}
                                disabled={currentSlide === totalSlides - 1}
                                className={`p-2 rounded-full ${currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Affichage normal pour 3 fonds ou moins */
                    <div className="flex flex-col lg:flex-row w-full justify-between">
                        {fonds.map((fond, index, array) => (
                            <Fond
                                key={fond.id}
                                foundName={fond.name}
                                foundAmount={fond.amount}
                                fond={fond}
                                isActive={activeFundId === fond.id}
                                isLast={index === array.length - 1}
                            />
                        ))}
                    </div>
                )}
            </section>
            <span className="block h-0.5 bg-gray-300 lg:mt-4"></span>
        </>
    );
}
