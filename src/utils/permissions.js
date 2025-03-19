export const canEditDelete = () => {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'Faculty' || userRole === 'Admin';
}; 