import React, { useState, useRef } from 'react';
import '../css/AlbumForm.css';

import { db } from "../firebase-init";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';

const AlbumForm = (props) => {

  // Ref to access the album name input field directly
  const inputRef = useRef();

  // Function to add a new album to Firestore when the form is submitted
  const addAlbum = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    // Add the album to Firestore with the input value
    const docRef = await addDoc(collection(db, "albums"), { name: inputRef.current.value });
    inputRef.current.value = ""; // Clear the input field after adding

    // Show a toast notification for successful album creation
    toast("Album Added Successfully!");
  };

  // Function to clear the input field when 'Clear' button is clicked
  const clearAlbum = (e) => {
    e.preventDefault(); // Prevents default button behavior in a form
    inputRef.current.value = ""; // Clears the input field
  };

  return (
    // Form container for creating an album
    <form className="album-form-container" onSubmit={addAlbum}>
      <h2>Create an album</h2>

      <div className="album-form">
        {/* Input field for album name with a ref to access it directly */}
        <input
          type="text"
          placeholder="Album Name"
          ref={inputRef}
          required // Required attribute ensures the field cannot be empty
        />

        {/* Button to clear the input field */}
        <button className="clear-button" onClick={clearAlbum}>
          Clear
        </button>

        {/* Submit button to create the album */}
        <button className="create-button">
          Create
        </button>
      </div>
    </form>
  );
};

export default AlbumForm;
