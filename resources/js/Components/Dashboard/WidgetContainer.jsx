import { usePage } from '@inertiajs/react';

export default function WidgetContainer({ children, requiredPermission }) {
    const { user } = usePage().props;

    const hasPermission = (permission) => {
        if (!user || !user.permissions) return false;
        return user.permissions.some(p => p.slug === permission);
    };

    if (!requiredPermission) {
        return children;
    }

    if (Array.isArray(requiredPermission)) {
        const hasAllPermissions = requiredPermission.every(permission => hasPermission(permission));
        return hasAllPermissions ? children : null;
    }

    return hasPermission(requiredPermission) ? children : null;
}
