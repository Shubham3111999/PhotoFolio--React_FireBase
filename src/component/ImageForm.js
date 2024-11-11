import "../css/ImageForm.css";
import React, { useState, useRef, useEffect } from 'react';
import { db } from "../firebase-init";
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { toast } from 'react-toastify';

const ImageForm = (props) => {
  // References to input fields for image title and URL
  const imageTitle = useRef();
  const imageUrl = useRef();

  // Function to handle adding a new image or updating an existing one
  const addImage = async (e) => {
    e.preventDefault();

    if (props.updateImage) {  // If updating an image
      console.log('props.updateImage ', props.updateImage);

      // Update the existing image document in Firestore
      await setDoc(doc(db, "images", props.updateImage.id), {
        album: props.updateImage.album,
        title: imageTitle.current.value,
        url: imageUrl.current.value
      });

      props.setUpdateImage(null); // Reset update state after update
      props.setShowImageForm(false); // Close the form after update

      toast("Image Updated Successfully!"); // Display success notification
      return;
    }

    // If adding a new image
    const docRef = await addDoc(collection(db, "images"), {
      title: imageTitle.current.value,
      url: imageUrl.current.value,
      album: props.selectAlbum.name
    });

    clearInput(e); // Clear input fields after adding

    toast("Image Added Successfully!"); // Display success notification
  }

  // Function to clear input fields
  const clearInput = (e) => {
    e.preventDefault();
    imageTitle.current.value = "";
    imageUrl.current.value = "";
  }

  // UseEffect to handle form fields when editing an image
  useEffect(() => {
    if (props.updateImage == null) {  // If no image to update, clear input fields
      imageTitle.current.value = "";
      imageUrl.current.value = "";
      return;
    }

    // Populate input fields with the image data for editing
    imageTitle.current.value = props.updateImage.title;
    imageUrl.current.value = props.updateImage.url;
  }, [props.updateImage]); // Runs when updateImage changes

  return (
    <form className="container" onSubmit={addImage}>
      {/* Form header displays "Update" or "Add" based on the action */}
      <h2>{props.updateImage ? "Update" : "Add"} image to {props.selectAlbum.name}</h2>

      {/* Input for image title */}
      <input
        type="text"
        className="input-field"
        placeholder="Title"
        ref={imageTitle}
        required
      />

      {/* Input for image URL */}
      <input
        type="text"
        className="input-field"
        placeholder="Image URL"
        ref={imageUrl}
        required
      />

      {/* Button group for Clear and Add/Update actions */}
      <div className="button-group">
        <button className="button clear-button" onClick={clearInput}>Clear</button>
        <button className="button add-button">{props.updateImage ? "Update" : "Add"}</button>
      </div>
    </form>
  );
};

export default ImageForm;
