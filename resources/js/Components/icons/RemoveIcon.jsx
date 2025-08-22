export function RemoveIcon({ color, animate = false }) {
    const iconColor = color;
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={`${animate ? 'animate-remove-icon' : ''} w-[20px] h-[20px]`}
        >
            <style type="text/css">
                {`
                @keyframes remove-animation {
                    0% { transform: translateY(0); }
                    25% { transform: translateY(-2px); }
                    50% { transform: translateY(0); }
                    75% { transform: translateY(2px); }
                    100% { transform: translateY(0); }
                }
                .animate-remove-icon {
                    animation: remove-animation 0.4s ease-in-out;
                }
                `}
            </style>
            <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"
                fill={iconColor} />
            <path
                d="M10 11h2v6h-2zm2 0h2v6h-2z"
                fill={iconColor} />
        </svg>
    )
}
