import Fond from "@/Components/Fond.jsx";
import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import React, { useState, useRef, useEffect } from "react";
import Modal from "@/Components/Modal.jsx";
import NewFund from "@/Components/NewFund.jsx";

export function FondList({ fonds, activeFundId = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    const hasSlider = fonds.length > 3;
    const itemsPerSlide = 3;
    const totalSlides = hasSlider ? Math.ceil(fonds.length / itemsPerSlide) : 1;

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const getCurrentFonds = () => {
        if (!hasSlider) return fonds;
        const start = currentSlide * itemsPerSlide;
        const end = start + itemsPerSlide;
        return fonds.slice(start, end);
    };

    // Positionner automatiquement le slider sur la slide contenant le fond actif
    useEffect(() => {
        if (hasSlider && activeFundId) {
            const activeFundIndex = fonds.findIndex(fond => fond.id === activeFundId);
            if (activeFundIndex !== -1) {
                const targetSlide = Math.floor(activeFundIndex / itemsPerSlide);
                setCurrentSlide(targetSlide);
            }
        }
    }, [activeFundId, hasSlider, fonds, itemsPerSlide]);

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
                        <div className="flex justify-center items-center mt-4 space-x-4">
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
            <span className="block h-0.5 bg-gray-300 mt-4"></span>
        </>
    );
}
