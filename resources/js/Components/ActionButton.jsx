import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { RemoveIcon } from "@/Components/icons/RemoveIcon.jsx";
import { TransferIcon } from "@/Components/icons/TransferIcon.jsx";
import { useState } from "react";

export default function ActionButton({ name, color }) {
    const [hover, setHover] = useState(false);  // État pour gérer le survol

    // Colormap associant chaque couleur à des classes CSS
    const colorMap = {
        blue: {
            text: "text-blue-500",
            hoverBg: "hover:bg-blue-500",
            hoverText: "hover:text-white",
        },
        red: {
            text: "text-red-500",
            hoverBg: "hover:bg-red-500",
            hoverText: "hover:text-white",
        },
        green: {
            text: "text-green-500",
            hoverBg: "hover:bg-green-500",
            hoverText: "hover:text-white",
        },
    };
    const { text, hoverBg, hoverText } = colorMap[color] || {};

    const className = `group transition duration-200 hover:scale-110 hover:border-none border border-gray-300 p-2 rounded flex gap-3 items-center
                       ${text || "text-gray-500"}
                       ${hoverBg || "hover:bg-gray-500"}
                       ${hoverText || "hover:text-white"}`;

    const iconMap = {
        blue: <AddIcon color={hover ? "white" : 'blue'} small={true} />,
        red: <RemoveIcon color={hover ? "white" : 'red'} />,
        green: <TransferIcon color={hover ? "white" : 'green'} />,
    };

    const iconButton = iconMap[color] || null;

    return (
        <button
            className={className}
            onMouseEnter={() => setHover(true)} // Survol
            onMouseLeave={() => setHover(false)} // Fin du survol
        >
            {name}
            {iconButton}
        </button>
    );
}
