import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const sectionNames = {
    feedback: 'Course Feedback',
    proctoring: 'Proctoring Students',
    research: 'Research Contributions',
    workshops: 'Workshops/FDPs/STTP',
    outreach: 'Outreach Activities',
    activities: 'Activities',
    responsibilities: 'Additional Responsibilities',
    contribution: 'Special Contributions',
    awards: 'Awards Received',
    headLogo: 'Logo/Profile Images'
};

const AllImages = () => {
    const [imagesBySection, setImagesBySection] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllImages();
    }, []);

    const fetchAllImages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/images/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setImagesBySection(data.images);
            } else {
                toast.error('Failed to load images');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Error fetching images');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:5000/images/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Image deleted successfully');
                // Update state to remove the deleted image
                fetchAllImages();
            } else {
                toast.error(data.message || 'Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Error deleting image');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading all images...</div>;
    }

    if (Object.keys(imagesBySection).length === 0) {
        return <div className="text-center py-8 text-gray-500">No images uploaded yet</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">All Uploaded Images</h1>

            {Object.keys(imagesBySection).map(sectionType => (
                <div key={sectionType} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        {sectionNames[sectionType] || sectionType}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagesBySection[sectionType].map(image => (
                            <div key={image._id} className="relative group border rounded overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={image.caption || 'Uploaded image'}
                                    className="w-full h-48 object-cover"
                                />

                                {image.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                                        {image.caption}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleDelete(image._id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllImages; 