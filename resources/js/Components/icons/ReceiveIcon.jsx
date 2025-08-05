export function ReceiveIcon({ color = "white" }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Flèche pointant vers le bas (recevoir) */}
            <path
                d="M12 4V20M12 20L6 14M12 20L18 14"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Ligne de base pour représenter la réception */}
            <path
                d="M4 20H20"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
