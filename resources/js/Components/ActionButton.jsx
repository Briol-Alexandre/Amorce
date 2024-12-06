import {AddIcon} from "@/Components/icons/AddIcon.jsx";
import {RemoveIcon} from "@/Components/icons/RemoveIcon.jsx";
import {TransferIcon} from "@/Components/icons/TransferIcon.jsx";

export default function ActionButton({name, color}) {
    const className = `border border-gray-300 p-2 rounded text-${color}-400 flex gap-3 items-center hover:color-${color}`;

    const iconMap = {
        blue: <AddIcon color='blue' small='true' />,
        red: <RemoveIcon />,
        green: <TransferIcon />
    };

    const iconButton = iconMap[color] || null;


    return (
        <button className={className}>
            {name}
            {iconButton}
        </button>
    );
}
