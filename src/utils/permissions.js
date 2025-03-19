export const canEditDelete = () => {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'Faculty' || userRole === 'Admin';
};

export const canView = () => {
    const userRole = localStorage.getItem('userRole');
    return ['Faculty', 'HOD', 'Dean', 'Admin'].includes(userRole);
};

export const isHODorDean = () => {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'HOD' || userRole === 'Dean';
}; 