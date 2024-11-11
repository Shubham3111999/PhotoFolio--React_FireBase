import { useState, useRef, useEffect } from 'react';
import '../css/AlbumList.css';
import { FaRegImages } from 'react-icons/fa';
import AlbumForm from './AlbumForm';
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase-init";
import Spinner from 'react-spinner-material';

const AlbumList = (props) => {

    // State to control the visibility of the AlbumForm component
    const [showAlbumForm, setShowAlbumForm] = useState(false);

    // State to store the list of albums fetched from Firestore
    const [albums, setAlbum] = useState([]);

    // Loading state to manage spinner visibility while data is being fetched
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to fetch albums from Firestore when component mounts
        (() => {
            onSnapshot(collection(db, "albums"), (snapShot) => {
                // Map Firestore snapshot to array of album objects
                let dbAlbums = snapShot.docs.map((doc) => {
                    return {
                        id: doc.id,  // Firestore document ID
                        ...doc.data() // Album data (e.g., name)
                    }
                });

                // Update albums state with fetched data
                setAlbum([...dbAlbums]);
                
                // Stop loading after data is fetched
                setLoading(false);
            });
        })();
    }, []); // Empty dependency array means this only runs once, on mount

    return (
        <>
            {/* Show AlbumForm if showAlbumForm is true */}
            {showAlbumForm && <AlbumForm setAlbum={setAlbum} />}

            <div className="album-list-container">
                {/* Header with title and button to toggle album form */}
                <div className="headerContent">
                    <h2>Your Albums</h2>

                    <button className={showAlbumForm ? "add-album-button-cancel" : "add-album-button"} 
                        onClick={() => setShowAlbumForm(!showAlbumForm)}>
                        {showAlbumForm ? "Cancel" : "Add Album"}
                    </button>
                </div>

                {/* Show spinner while loading, or album grid when data is available */}
                {loading ? 
                    <div className="spinner-container">
                        {/* Spinner component with custom size, color, and visibility */}
                        <Spinner radius={50} color={"#333"} stroke={2} visible={true} />
                    </div>
                    :
                    <div className="albums-grid">
                        {/* Map each album to a card with icon and name */}
                        {albums.map((album, index) => (
                            <div className="album-card" key={index} onClick={() => props.setSelectAlbum(album)}>
                                <FaRegImages className="album-icon" />
                                <p className="album-name">{album.name}</p>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </>
    );
};

export default AlbumList;
