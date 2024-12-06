export function AddIcon({color, small}) {
    const iconColor = color;


    return (
        <svg width={small ? 25 : 50} height={small ? 25 : 50} viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M24.5002 44.9167C35.776 44.9167 44.9168 35.7759 44.9168 24.5C44.9168 13.2242 35.776 4.08337 24.5002 4.08337C13.2243 4.08337 4.0835 13.2242 4.0835 24.5C4.0835 35.7759 13.2243 44.9167 24.5002 44.9167Z"
                stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24.5 16.3334V32.6667" stroke={iconColor} strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M16.3335 24.5H32.6668" stroke={iconColor} strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>

    )
}
