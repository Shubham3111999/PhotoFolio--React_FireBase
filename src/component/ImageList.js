import React, { useState, useEffect } from 'react';
import '../css/ImageList.css';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import { FaEdit, FaTrash } from 'react-icons/fa';
import ImageForm from "./ImageForm";
import Carousel from './Carousel';

import { doc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-init";

import { toast } from 'react-toastify';
import Spinner from 'react-spinner-material';

const ImageList = (props) => {
    // State to manage images fetched from the database
    const [images, setImages] = useState([]);
    // State to keep track of the currently selected image for the carousel
    const [imageSelected, setImageSelected] = useState(null);
    // State to toggle the visibility of the ImageForm component
    const [showImageForm, setShowImageForm] = useState(false);
    // State to carry the image data when editing
    const [updateImage, setUpdateImage] = useState(null);
    // State to toggle the visibility of the search input field
    const [showSearchText, setShowSearchText] = useState(false);
    // Temporary storage for images for handling search functionality
    const [tempImagesHolder, setTempImagesHolder] = useState([]);
    // State to manage the loading spinner while data is being fetched
    const [loading, setLoading] = useState(true);

    // Function to handle image deletion
    const handleDelete = async (image) => {
        await deleteDoc(doc(db, "images", image.id));
        setUpdateImage(null);  // Reset update state if an image was being edited
        toast("Image Deleted Successfully!");  // Show deletion success notification
    };

    // Function to handle image edit - sets update state and opens the form
    const handleEdit = (image) => {
        setUpdateImage(image);
        setShowImageForm(true);  // Display the form for editing
    };

    // Function to cancel the form and reset edit state
    const handleCancel = () => {
        setShowImageForm(!showImageForm);  // Toggle form visibility
        setUpdateImage(null);  // Reset update state
    };

    // Function to show or hide search input field
    const handleSearchClick = () => {
        setShowSearchText(!showSearchText);
    };

    // Function to handle cancel of search and restore all images
    const handleCancelClick = () => {
        setShowSearchText(!showSearchText);
        setImages(tempImagesHolder);  // Reset images to full list
    };

    // Function to filter images based on search input
    const searchHandlerInput = (e) => {
        let searchedResult = tempImagesHolder.filter((img) => img.title.includes(e.target.value));
        setImages(searchedResult);
    };

    // useEffect to fetch images from Firestore and filter based on the selected album
    useEffect(() => {
        (() => {
            onSnapshot(collection(db, "images"), (snapShot) => {
                let dbImages = snapShot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                });

                // Filter images based on the selected album
                const filterImagesAsPerAlbum = dbImages.filter(image => image.album === props.selectAlbum.name);
                setImages([...filterImagesAsPerAlbum]);
                setTempImagesHolder([...filterImagesAsPerAlbum]);  // Store images for search functionality

                setLoading(false);  // Stop loading spinner after data is fetched
            });
        })();
    }, []);

    return (
        <>
            {console.log(images)}
            {/* Button to go back to album view */}
            <button className="back-button" onClick={() => props.setSelectAlbum(null)}>
                <FaArrowLeft size={50} />
            </button>

            {/* Conditional rendering of ImageForm component */}
            {showImageForm && (
                <ImageForm
                    selectAlbum={props.selectAlbum}
                    setImages={setImages}
                    updateImage={updateImage}
                    setShowImageForm={setShowImageForm}
                    setUpdateImage={setUpdateImage}
                />
            )}

            <div className="image-list-container">
                <div className="header">
                    <h2>Images in {props.selectAlbum.name}</h2>

                    <div className="header-right">
                        {/* Show search input if search is active */}
                        {showSearchText && (
                            <input
                                className="search-text"
                                placeholder="Search..."
                                onChange={searchHandlerInput}
                            />
                        )}

                        <button className="search-button">
                            {/* Toggle between search and cancel icons */}
                            {showSearchText ? (
                                <MdCancel size={22} onClick={handleCancelClick} />
                            ) : (
                                <FaSearch size={22} onClick={handleSearchClick} />
                            )}
                        </button>

                        {/* Toggle Add/Cancel Image Form button */}
                        <button
                            className={showImageForm ? "add-image-button-cancel" : "add-image-button"}
                            onClick={handleCancel}
                        >
                            {showImageForm ? "Cancel" : "Add image"}
                        </button>
                    </div>
                </div>

                {/* Show loading spinner while data is being fetched */}
                {loading ? (
                    <div className="spinner-container">
                        <Spinner radius={50} color={"#333"} stroke={2} visible={true} />
                    </div>
                ) : (
                    <div className="images">
                        {/* Map through images and display each in a card */}
                        {images.map((image, index) => (
                            <div key={index} className="image-card">
                                <img src={image.url} alt={image.title} onClick={() => setImageSelected(image)} />
                                <div className="image-name" onClick={() => setImageSelected(image)}>
                                    {image.title}
                                </div>

                                {/* Edit and Delete buttons for each image */}
                                <div className="image-actions">
                                    <button className="edit-button" onClick={() => handleEdit(image)}>
                                        <FaEdit />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(image)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Display Carousel component if an image is selected */}
            {imageSelected && (
                <Carousel
                    imageSelected={imageSelected}
                    setImageSelected={setImageSelected}
                    onClose={() => setImageSelected(null)}
                    images={images}
                />
            )}
        </>
    );
};

export default ImageList;
