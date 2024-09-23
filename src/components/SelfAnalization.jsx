import React, { useState, useEffect, useContext ,useRef } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import Sentiment from 'sentiment';
import SentimentChart from './SentimentChart';
import Back from "../img/back.png";
import { useNavigate } from 'react-router-dom';
import "../ChatFetcher.scss";
import "../style.scss";
import file from '../img/file.png'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const SelfAnalyzation = () => {

    const [userMessages, setUserMessages] = useState([]);
    const [sentimentResults, setSentimentResults] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const sentiment = new Sentiment();
    const navigate = useNavigate();
    const pdfRef = useRef();
    
useEffect(() => {
    const fetchSelfMessages = () => {
        if (!currentUser) return;

        const selfMessagesRef = doc(db, "selfMessages", currentUser.uid);

        const unsub = onSnapshot(selfMessagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const messages = snapshot.data().messages || [];
                setUserMessages(messages);
                analyzeSentiments(messages);

            } else {
                setUserMessages([]);
                setSentimentResults([]);
            }
        });

        return () => unsub();
    };

    fetchSelfMessages();
}, [currentUser]);

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
    pdf.save('self_analyzation.pdf');
};

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    // if(! sentimentResults.length > 0 ){
    //     SetPresent(false);
    // }

    return (
        <div className='selfAnalyzation chatsFetched' ref={pdfRef}>
            <img className='backIcon' src={Back} alt="back" onClick={handleBack} />
          
             <div className="head">
            <h2>Your Messages</h2>
            <img 
                src={file } 
                alt="" 
                className='logo' 
                onClick={handleDownload} 
            />
             </div>
             
            {sentimentResults.length > 0 ? (
                <>
                    <ul>
                        {sentimentResults.map((message, index) => (
                            <li key={index}>
                                <strong>You: </strong> {message.text}
                                <span className={`sentimentLabel ${message.sentiment}`}>
                                    {' '}({ message.sentiment })
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="chartsContainer">
                        <SentimentChart sentimentResults ={sentimentResults} />
                    </div>
                </>
            ) : (
                
                
                <p>No messages found.</p>
            )}
        </div>
    );
};

export default SelfAnalyzation;
