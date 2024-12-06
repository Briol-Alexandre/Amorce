export function TransferIcon({color}) {
    const iconColor = color;
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3332 1.66663L9.1665 10.8333" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.3332 1.66663L12.4998 18.3333L9.1665 10.8333L1.6665 7.49996L18.3332 1.66663Z" stroke={iconColor}
                  strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
