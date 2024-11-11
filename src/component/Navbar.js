import React from 'react';
import "../css/Navbar.css"

// Navbar component to display the header and navigation
function Navbar({ setSelectAlbum }) {
  return (
    <nav className="navbar">
      {/* Navbar brand/logo. On click, sets selectAlbum to false to navigate to album list */}
      <h1 className="navbar-brand" onClick={() => setSelectAlbum(false)}>
        PhotoFolio
      </h1>
    </nav>
  );
}

export default Navbar;

