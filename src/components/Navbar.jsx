import React, { useContext, useState } from 'react'; // Import useState
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import ana from "../img/sentiment-analysis.png";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [isChatFetcherVisible, setIsChatFetcherVisible] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleClick = () => {
    // Toggle the state
    setIsChatFetcherVisible(!isChatFetcherVisible);
    // Navigate to "/selfAnalization" route when clicked
    navigate("/selfAnalization");
  };

  return (
    <div className='navbar'>
      <div className="user">
        <div className="loggedUser">
          <img src={currentUser.photoURL} alt="Profile" />
          <span>{currentUser.displayName}</span>
          <img src={ana} alt="Sentiment Analysis" className='logo' onClick={handleClick} />
        </div>
        {/* Logout Button */}
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
