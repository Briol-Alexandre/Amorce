import { useState } from "react";
import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { RemoveIcon } from "@/Components/icons/RemoveIcon.jsx";
import { TransferIcon } from "@/Components/icons/TransferIcon.jsx";
import { EditIcon } from "@/Components/icons/EditIcon.jsx";

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
        base: "text-white bg-red-400 border border-transparent",
        hover: "hover:text-red-400 hover:bg-white hover:border-red-400",
    },
    green: {
        base: "text-white bg-green-400 border border-transparent",
        hover: "hover:text-green-400 hover:bg-white hover:border-green-400",
    },
    orange: {
        base: "text-white bg-orange-500 border border-transparent",
        hover: "hover:text-orange-500 hover:bg-white hover:border-orange-500",
    },
};

// Configuration des icônes par couleur
const getIcon = (color, isHovered) => {
    const iconColor = isHovered ? color : "white";

    const iconMap = {
        blue: <AddIcon color={iconColor} small={true} />,
        red: <RemoveIcon color={iconColor} />,
        green: <TransferIcon color={iconColor} />,
        orange: <EditIcon color={iconColor} />,
    };

    return iconMap[color] || null;
};

export default function ActionButton({ name, color, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    // Récupération du thème de couleur
    const theme = COLOR_THEMES[color] || {
        base: "text-gray-200",
        hover: "hover:text-gray-200",
    };

    // Construction des classes CSS pour le bouton avec largeurs fixes
    const buttonClasses = [
        "group relative overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "h-10 rounded-full",
        "flex items-center justify-center",
        "ml-2 mr-2 last:mr-0 first:ml-0",
        theme.base,
        theme.hover,
    ].join(" ");

    // Style inline pour la largeur avec transition CSS
    const buttonStyle = {
        width: isHovered ? '200px' : '40px',
        minWidth: '40px',
        paddingLeft: isHovered ? '16px' : '8px',
        paddingRight: isHovered ? '16px' : '8px',
        transition: 'all 200ms ease-in-out',
    };

    // Classes CSS pour le texte avec animation
    const textClasses = [
        "whitespace-nowrap text-sm font-medium",
        "overflow-hidden",
    ].join(" ");

    // Style inline pour le texte avec transition
    const textStyle = {
        opacity: isHovered ? 1 : 0,
        marginLeft: isHovered ? '8px' : '0px',
        transition: 'all 300ms ease-in-out',
    };

    const icon = getIcon(color, isHovered);

    return (
        <button
            className={buttonClasses}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            title={name} // Tooltip pour l'accessibilité
        >
            <span className="flex-shrink-0">
                {icon}
            </span>
            <span className={textClasses} style={textStyle}>
                {name}
            </span>
        </button>
    );
}
