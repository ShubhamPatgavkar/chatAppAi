import React, { useContext, useState } from 'react';
import emotional from "../img/emotional.png";
import Messages from './Messages';
import Input from "./Input";
import { ChatContext } from '../context/ChatContext';
import ChatFetcher from './ChatFetcher';
import { Navigate } from 'react-router-dom';

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [isChatFetcherVisible, setIsChatFetcherVisible] = useState(false);

  const handleCamClick = () => {
    setIsChatFetcherVisible(!isChatFetcherVisible);
  };

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName || "No Active Chat"}</span>
       
       {data.user?.displayName ? <div className="chatIcons">
          <img
          src={data.user?.displayName ? emotional : null}
          alt=""
          onClick={handleCamClick}
          style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
        />

        </div> : null}
        
      </div>
      {isChatFetcherVisible ? (
        <Navigate to="/chatfetcher" />
      ) : (
        <>
          <Messages />
          {data.user?.displayName  && <Input />} {/* Conditionally render Input based on the presence of data.user */}
        </>
      )}
    </div>
  );
};

export default Chat;
