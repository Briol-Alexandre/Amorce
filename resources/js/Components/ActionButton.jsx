import { useState } from "react";
import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { RemoveIcon } from "@/Components/icons/RemoveIcon.jsx";
import { TransferIcon } from "@/Components/icons/TransferIcon.jsx";

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
};

// Configuration des icônes par couleur
const getIcon = (color, isHovered) => {
    const iconColor = isHovered ? color : "white";

    const iconMap = {
        blue: <AddIcon color={iconColor} small={true} />,
        red: <RemoveIcon color={iconColor} />,
        green: <TransferIcon color={iconColor} />,
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

    // Construction des classes CSS
    const buttonClasses = [
        "group transition duration-200",
        "py-1 px-2 rounded text-sm ml-2 mr-2 last:mr-0 first:ml-0",
        "flex gap-3 justify-center items-center",
        theme.base,
        theme.hover,
    ].join(" ");

    const icon = getIcon(color, isHovered);

    return (
        <button
            className={buttonClasses}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {name}
            {icon}
        </button>
    );
}
