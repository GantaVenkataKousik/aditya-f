import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ImageUploader = ({ sectionType, sectionId, itemIndex = -1, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', file);
            formData.append('sectionType', sectionType);
            formData.append('sectionId', sectionId);
            formData.append('itemIndex', itemIndex);
            formData.append('caption', caption);

            const response = await fetch('http://localhost:5000/images/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Image uploaded successfully');
                setFile(null);
                setCaption('');

                // Call the callback if provided
                if (onUploadSuccess) {
                    onUploadSuccess(data.image);
                }
            } else {
                toast.error(data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-4 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
            <form onSubmit={handleUpload}>
                <div className="mb-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Caption (optional)"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={!file || loading}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default ImageUploader; 