import axios from 'axios';
import React, { useState } from 'react';

export default function FileUploader() {
   const [file, setFile] = useState();
   //  [fileSubmitted, setFileSubmitted] = useState(false);
   const [htrData, setHTRData] = useState({	WordList: [],
                            				SymbolList: [],
                            				WordConfidence: [],
                            				SymbolConfidence: [] }); // JSON state object
    const[htrDataRecieved, setHTRDataRecieved] = useState(false);
   
    function onFileChange(e){
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }
    function onFileUpload(){
        console.log(file.name);
        
        const formData = new FormData();
        
        // Update the formData object
        formData.append('file', file);
        formData.append('filename', file.name);

        // Request made to the backend api
        // Send formData object
        axios.post("/upload", formData)
        .then(response => { // Response from backend
            console.log(response.data);
            console.log("WordList: " + response.data.WordList);
            console.log("SymbolList: " + response.data.SymbolList);
            console.log("WordConfidence: " + response.data.WordConfidence);
            console.log("SymbolConfidence: " + response.data.SymbolConfidence);
            setHTRData({WordList: response.data.WordList,
                        SymbolList: response.data.SymbolList,
                        WordConfidence: response.data.WordConfidence,
                        SymbolConfidence: response.data.SymbolConfidence});
            setHTRDataRecieved(true);
        })
        .catch(err => console.log(err));
    }
    if(!htrDataRecieved){
        return (
            <div>
                <input type="file" name="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                    Upload!
                </button>
            </div>
          );
    }else{
        return ( // I formatted this pretty horribly, I will fix soon - AJ 
            <div>
                <input type="file" name="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                    Upload!
                </button>
                <div>
                List of words along with Confidence levels
                {htrData.WordList.map((word, index) => ( // Maybe pass word and word Confidence to a Word Component
                    <body>{word + ': ' +  100*Math.floor(htrData.WordConfidence[index] * 100) / 100 + '%'}</body>
                    ))};
                <p> ---------------------------------------------</p>
                {htrData.SymbolList.map((letter, index) => ( // Maybe pass symbol and symbol Confidence to a Symbol Component
                   <body>{letter + ': ' +  100*Math.floor(htrData.SymbolConfidence[index] * 100) / 100 + '%'}</body>
                   ))};
                </div>
            </div>
          );
    }
}