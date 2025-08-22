export function ReceiveIcon({ color = "white", animate = false }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${animate ? 'animate-receive-icon' : ''} w-[20px] h-[20px]`}
        >
            <style type="text/css">
                {`
                @keyframes receive-animation {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                    100% { transform: translateY(0); }
                }
                .animate-receive-icon {
                    animation: receive-animation 0.5s ease-in-out;
                }
                `}
            </style>
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
