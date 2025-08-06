import React, { useState, useRef, useEffect } from "react";
import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { RemoveIcon } from "@/Components/icons/RemoveIcon.jsx";
import { TransferIcon } from "@/Components/icons/TransferIcon.jsx";
import { EditIcon } from "@/Components/icons/EditIcon.jsx";
import { ReceiveIcon } from "@/Components/icons/ReceiveIcon.jsx";

// Configuration des couleurs et styles
const COLOR_THEMES = {
    black: {
        base: "text-white bg-black border border-transparent",
        hover: "hover:text-black hover:bg-white hover:border-black",
    },
    blue: {
        base: "text-white bg-blue-400 border border-transparent",
        hover: "hover:text-blue-400 hover:bg-white hover:border-blue-400",
    },
    red: {
        base: "text-white bg-red-600 border border-transparent",
        hover: "hover:text-red-600 hover:bg-white hover:border-red-600",
    },
    green: {
        base: "text-white bg-green-600 border border-transparent",
        hover: "hover:text-green-600 hover:bg-white hover:border-green-600",
    },
    orange: {
        base: "text-white bg-orange-600 border border-transparent",
        hover: "hover:text-orange-600 hover:bg-white hover:border-orange-600",
    },
    purple: {
        base: "text-black bg-purple-600 border border-transparent",
        hover: "hover:text-purple-600 hover:bg-white hover:border-purple-600",
    },
};

// Configuration des icônes par couleur
const getIcon = (color, isHovered) => {
    const iconColor = isHovered ? color : "white";

    const iconMap = {
        blue: <AddIcon color={iconColor} animate={isHovered} small={true} />,
        red: <RemoveIcon color={iconColor} animate={isHovered} />,
        green: <TransferIcon color={iconColor} animate={isHovered} />,
        orange: <EditIcon color={iconColor} animate={isHovered} />,
        purple: <ReceiveIcon color={iconColor} animate={isHovered} />,
    };

    return iconMap[color] || null;
};

export default function ActionButton({ name, color, onClick }) {
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState('center'); // 'left', 'center', 'right'
    const buttonRef = useRef(null);

    // Récupération du thème de couleur
    const theme = COLOR_THEMES[color] || {
        base: "text-gray-200",
        hover: "hover:text-gray-200",
    };

    // Construction des classes CSS pour le bouton
    const buttonClasses = [
        "group relative",
        "transition-all duration-200 ease-in-out",
        "h-10 w-10 rounded-full",
        "flex items-center justify-center",
        "ml-2 mr-2 last:mr-0 first:ml-0",
        theme.base,
        theme.hover,
    ].join(" ");

    // Fonction pour calculer la position du tooltip
    const calculateTooltipPosition = () => {
        if (!buttonRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const viewportWidth = window.innerWidth;

        // Estimer la largeur du tooltip (approximativement 150px + la longueur du texte * 8px)
        const estimatedTooltipWidth = Math.min(150 + name.length * 8, 300);

        // Vérifier si le tooltip déborde à gauche ou à droite
        if (buttonCenterX - estimatedTooltipWidth / 2 < 0) {
            setTooltipPosition('left');
        } else if (buttonCenterX + estimatedTooltipWidth / 2 > viewportWidth) {
            setTooltipPosition('right');
        } else {
            setTooltipPosition('center');
        }
    };

    // Effet pour recalculer la position du tooltip lors du survol
    useEffect(() => {
        if (isHovered) {
            calculateTooltipPosition();
        }
    }, [isHovered]);

    // Déterminer la couleur de fond du tooltip en fonction de la couleur du bouton
    const getTooltipBgColor = () => {
        // Extraire la couleur de base du thème
        const colorName = color || 'black';

        // Mapping des couleurs pour les tooltips
        const bgColorMap = {
            'black': 'bg-black',
            'blue': 'bg-blue-400',
            'red': 'bg-red-600',
            'green': 'bg-green-600',
            'orange': 'bg-orange-600',
            'purple': 'bg-purple-600',
        };

        return bgColorMap[colorName] || 'bg-gray-800';
    };

    // Classes pour le tooltip qui utilise group-hover pour l'affichage
    const tooltipClasses = [
        "absolute bottom-full mb-2", // Positionné au-dessus
        tooltipPosition === 'left' ? "left-0" :
            tooltipPosition === 'right' ? "right-0" :
                "left-1/2 transform -translate-x-1/2", // Ajustement horizontal selon la position
        getTooltipBgColor(), // Couleur de fond dynamique selon le bouton
        "text-white text-sm font-bold rounded py-1 px-3", // Style du tooltip
        "whitespace-nowrap pointer-events-none", // Éviter les interactions avec le tooltip
        "opacity-0 scale-95", // Caché par défaut
        "group-hover:opacity-100 group-hover:scale-100", // Visible au survol du groupe
        "transition-all duration-200 ease-in-out",
        "shadow-lg z-50", // Ombre et z-index élevé
    ].join(" ");

    // Classes pour la flèche du tooltip avec couleur correspondante
    const getTooltipArrowColor = () => {
        // Mapping des couleurs pour les flèches des tooltips
        const borderColorMap = {
            'black': 'border-t-black',
            'blue': 'border-t-blue-500',
            'red': 'border-t-red-500',
            'green': 'border-t-green-500',
            'orange': 'border-t-orange-500',
            'purple': 'border-t-purple-500',
        };

        return borderColorMap[color] || 'border-t-gray-800';
    };

    // Classes pour la flèche du tooltip
    const tooltipArrowClasses = [
        "absolute -bottom-2",
        tooltipPosition === 'left' ? "left-4" :
            tooltipPosition === 'right' ? "right-4" :
                "left-1/2 transform -translate-x-1/2",
        "h-0 w-0",
        "border-x-4 border-t-4 border-b-0",
        "border-x-transparent",
        getTooltipArrowColor(), // Couleur de flèche dynamique
    ].join(" ");

    // Utiliser l'état de survol pour changer la couleur de l'icône
    const icon = getIcon(color, isHovered);

    return (
        <button
            ref={buttonRef}
            className={buttonClasses}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={name}
        >
            {/* Tooltip qui s'affiche au survol grâce à group-hover */}
            <div className={tooltipClasses}>
                {name}
                <div className={tooltipArrowClasses}></div>
            </div>
            <span className="flex-shrink-0">
                {icon}
            </span>
        </button>
    );
}
