export function AddIcon({ color, animate = false }) {
    const iconColor = color;
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${animate ? 'animate-add-icon' : ''} w-[20px] h-[20px]`}
        >
            <style type="text/css">
                {`
                @keyframes add-animation {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(90deg); }
                    50% { transform: rotate(90deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-add-icon {
                    animation: add-animation 0.6s ease-in-out;
                    transform-origin: center;
                }
                `}
            </style>
            <path
                d="M11.5 1.91663C6.20711 1.91663 1.9165 6.20723 1.9165 11.5C1.9165 16.7927 6.20711 21.0833 11.5 21.0833C16.7927 21.0833 21.0833 16.7927 21.0833 11.5C21.0833 6.20723 16.7927 1.91663 11.5 1.91663ZM15.3333 12.25H12.25V15.3333H10.75V12.25H7.6665V10.75H10.75V7.66663H12.25V10.75H15.3333V12.25Z"
                fill={iconColor}
            />
        </svg>
    )
}
