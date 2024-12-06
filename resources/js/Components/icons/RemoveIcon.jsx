export function RemoveIcon({color}) {
    const iconColor = color;
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19.6665 5.29163H9.12484L2.4165 12L9.12484 18.7083H19.6665C20.1748 18.7083 20.6623 18.5064 21.0218 18.1469C21.3812 17.7875 21.5832 17.3 21.5832 16.7916V7.20829C21.5832 6.69996 21.3812 6.21245 21.0218 5.853C20.6623 5.49356 20.1748 5.29163 19.6665 5.29163Z"
                stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.75 9.125L12 14.875" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9.125L17.75 14.875" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
