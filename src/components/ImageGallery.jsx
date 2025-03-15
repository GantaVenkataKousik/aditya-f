import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ImageGallery = ({ sectionType, sectionId, itemIndex = -1, refreshTrigger }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, [sectionType, sectionId, itemIndex, refreshTrigger]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let url = `https://aditya-b.onrender.com/images/section?sectionType=${sectionType}`;
            if (sectionId) url += `&sectionId=${sectionId}`;
            if (itemIndex !== -1) url += `&itemIndex=${itemIndex}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setImages(data.images);
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
                // Remove from local state
                setImages(images.filter(img => img._id !== id));
            } else {
                toast.error(data.message || 'Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Error deleting image');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading images...</div>;
    }

    if (images.length === 0) {
        return <div className="text-center py-4 text-gray-500">No images uploaded</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
            {images.map((image) => (
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
    );
};

export default ImageGallery; 