export function TransferIcon({ color, animate = false }) {
    return (
        <svg
            fill={color}
            height="20"
            width="20"
            version="1.1"
            id="Icons"
            viewBox="0 0 32 32"
            className={animate ? 'animate-send-icon' : ''}
        >
            <style type="text/css">
                {`
                @keyframes send-animation {
                    0% { 
                        transform: translate(0, 0); 
                        opacity: 1;
                    }
                    25% { 
                        transform: translate(5px, -5px); 
                        opacity: 0.7;
                    }
                    50% { 
                        transform: translate(10px, -10px); 
                        opacity: 0;
                    }
                    50.1% { 
                        transform: translate(-10px, 10px); 
                        opacity: 0;
                    }
                    75% { 
                        transform: translate(-5px, 5px); 
                        opacity: 0.7;
                    }
                    100% { 
                        transform: translate(0, 0); 
                        opacity: 1;
                    }
                }
                .animate-send-icon {
                    animation: send-animation 0.5s ease-in-out;
                }
                `}
            </style>
            <path d="M29.3,2.6c-0.3-0.2-0.7-0.3-1-0.2L3,11.7c-0.4,0.1-0.7,0.5-0.7,0.9c0,0.4,0.3,0.8,0.7,0.9l10.2,3.8l10-10
	c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-9.8,9.8l6.6,10.6c0.2,0.3,0.5,0.5,0.8,0.5c0.1,0,0.1,0,0.2,0c0.4-0.1,0.7-0.4,0.8-0.7l6.2-25.2
	C29.7,3.3,29.6,2.9,29.3,2.6z"/>
        </svg>
    )
}
