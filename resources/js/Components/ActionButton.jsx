import { AddIcon } from "@/Components/icons/AddIcon.jsx";
import { RemoveIcon } from "@/Components/icons/RemoveIcon.jsx";
import { TransferIcon } from "@/Components/icons/TransferIcon.jsx";
import { useState } from "react";

export default function ActionButton({ name, color, onClick }) {
    const [hover, setHover] = useState(false);
    const colorMap = {
        blue: {
            text: "text-blue-400",
            hoverBg: "hover:bg-blue-400",
            hoverText: "hover:text-white",
        },
        red: {
            text: "text-red-400",
            hoverBg: "hover:bg-red-400",
            hoverText: "hover:text-white",
        },
        green: {
            text: "text-green-400",
            hoverBg: "hover:bg-green-400",
            hoverText: "hover:text-white",
        },
    };
    const { text, hoverBg, hoverText } = colorMap[color] || {};

    const className = `group transition duration-200 border border-gray-300 p-2 rounded flex gap-3 items-center
                       ${text || "text-gray-200"}
                       ${hoverBg || "hover:bg-gray-200"}
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
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
        >
            {name}
            {iconButton}
        </button>
    );
}
