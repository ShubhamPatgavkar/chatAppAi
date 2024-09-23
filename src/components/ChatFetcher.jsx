    import React, { useState, useEffect, useContext, useRef } from 'react';
    import { onSnapshot, doc } from 'firebase/firestore';
    import { db } from '../firebase';
    import { AuthContext } from '../context/AuthContext';
    import { ChatContext } from '../context/ChatContext';
    import Sentiment from 'sentiment';
    import SentimentChart from './SentimentChart';
    import '../ChatFetcher.scss'; // Import the SCSS file
    import Back from "../img/back.png";
    import { useNavigate } from 'react-router-dom';
    import file from '../img/file.png'
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';



    const ChatFetcher = () => {
        const [chats, setChats] = useState([]);
        const [sentimentResults, setSentimentResults] = useState([]);
        const { currentUser } = useContext(AuthContext);
        const { data } = useContext(ChatContext);
        const sentiment = new Sentiment();
        const navigate = useNavigate(); // Initialize the useNavigate hook
        const pdfRef = useRef();

        useEffect(() => {
            const fetchChats = () => {
                const chatId =
                    currentUser.uid > data.user.uid
                        ? currentUser.uid + data.user.uid
                        : data.user.uid + currentUser.uid;

                const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
                    if (doc.exists()) {
                        const chatMessages = doc.data().messages;
                        setChats(chatMessages);
                        analyzeSentiments(chatMessages);
                    }
                });

                return () => {
                    unsub();
                };
            };

            if (currentUser && data.user.uid) {
                fetchChats();
            }
        }, [currentUser, data.user.uid]);

        const analyzeSentiments = (messages) => {
            const results = messages.map((message) => {
                const result = sentiment.analyze(message.text);
                return {
                    ...message,
                    sentiment: result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral',
                };
            });
            setSentimentResults(results);
        };

        const handleBack = () => {
            navigate(-1); // Go back to the previous page
        };

      const handleDownload = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better quality
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait', // Can also be 'landscape'
        unit: 'pt',
        format: 'a4', // A4 paper size
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scaling factor to fit content within one page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;

    // Centering the image on the page
    const xOffset = (pdfWidth - imgScaledWidth) / 2;
    const yOffset = (pdfHeight - imgScaledHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);
    pdf.save('Chat_analyzation.pdf');
};



        return (
            <div className='chatsFetched' ref={pdfRef}>
                <img className='backIcon' src={Back} alt="back" onClick={handleBack} />
                <div className="head">
                     <h2>Chat Messages</h2>
                 <img src={file} alt="Sentiment Analysis" className='logo' onClick={handleDownload} />
                </div>
               

                {sentimentResults.length > 0 ? ( 
                    <>
                        <ul>
                            {sentimentResults.map((chat, index) => (
                                <li key={index}>
                                    <strong>{chat.senderId === currentUser.uid ? "You" : data.user.displayName}:</strong> {chat.text}
                                    <span className={`sentimentLabel ${chat.sentiment}`}>
                                        {' '}({chat.sentiment})
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="chartsContainer">
                            <SentimentChart sentimentResults={sentimentResults} />
                        </div>
                    </>
                ) : (
                    <p>No messages found.</p>
                )}
            </div>
        );
    };

    export default ChatFetcher;
