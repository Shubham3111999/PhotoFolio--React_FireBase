import Navbar from "./component/Navbar";
import AlbumList from "./component/Albumlist";
import ImageList from "./component/ImageList";

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // State to track the selected album; if an album is selected, ImageList will render
  const [selectAlbum, setSelectAlbum] = useState(null);

  return (
    <div className="App">
      {/* Navbar component, passing setSelectAlbum to allow album selection reset */}
      <Navbar setSelectAlbum={setSelectAlbum} />
      
      {/* Conditionally render either ImageList or AlbumList based on selectAlbum state */}
      {selectAlbum ? (
        <ImageList selectAlbum={selectAlbum} setSelectAlbum={setSelectAlbum} />
      ) : (
        <AlbumList setSelectAlbum={setSelectAlbum} />
      )}
      
      {/* Toast container for displaying notifications throughout the app */}
      <ToastContainer />
    </div>
  );
}

export default App;
