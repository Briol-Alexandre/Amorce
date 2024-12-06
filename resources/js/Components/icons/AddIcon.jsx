export function AddIcon({color, small}) {
    const iconColor = color;
    return (
        <svg width={small ? 23 : 40} height={small ? 23 : 40} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.4998 21.0833C16.7926 21.0833 21.0832 16.7927 21.0832 11.5C21.0832 6.20723 16.7926 1.91663 11.4998 1.91663C6.20711 1.91663 1.9165 6.20723 1.9165 11.5C1.9165 16.7927 6.20711 21.0833 11.4998 21.0833Z"
                stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.5 7.66663V15.3333" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.6665 11.5H15.3332" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>


    )
}
