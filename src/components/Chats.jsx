import { onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'
import { doc } from 'firebase/firestore'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
    const [chats, setChats] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        // <div className='chat'>
        //     {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (


        //         <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>

        //             <img src={chat[1].userInfo.photoURL} alt="" />
        //             <div className="userChatInfo">

        //                 <span>{chat[1].userInfo.displayName}</span>
        //                 <p>{chat[1].userInfo.lastMessage?.text}</p>
        //             </div>
        //         </div>
        //     ))
        //     }
        // </div >
        <div className="chats">
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div
                    className="userChat"
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1].userInfo)}
                >
                    <img src={chat[1].userInfo.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats