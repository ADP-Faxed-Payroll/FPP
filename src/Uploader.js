import axios from 'axios';
import React, { useState } from 'react';
import './app.css';
import DocText from './DocText';

import TableRow from './TableRow';
import Landing from './Landing';

export default function FileUploader() {
   const [file, setFile] = useState();
   //  [fileSubmitted, setFileSubmitted] = useState(false);
   const [htrData, setHTRData] = useState({	WordList: [],
                            				WordConfidence: [],
                            				DocText: '',
                                            Matrix: [],
   }); // JSON state object
    const[htrDataRecieved, setHTRDataRecieved] = useState(false);
    
    const [RotateDoc, setRotateDoc] = useState(0);
    
    const [landingPage, setLandingPage] = useState(false);
    
    function openLandingPage(){
        setLandingPage(true);
    }
   
    let rotation = 0;
    function rotateImg() {
        if (
      document.getElementById("doc")){
          rotation={RotateDoc};
            setRotateDoc(RotateDoc+90); // add 90 degrees, you can change this as you want
            if (rotation === 360) { 
            // 360 means rotate back to 0
                setRotateDoc(0);
            }
        console.log(RotateDoc);
          document.querySelector("#doc").style.transform = `rotate(${RotateDoc}deg)`;
        }  
    }
      
    function onFileChange(e){
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }
    function onFileUpload(){
        if (file!=null){
        
            console.log(file.name);
            
            const formData = new FormData();
            
            // Update the formData object
            formData.append('file', file);
            formData.append('filename', file.name);
    
            // Request made to the backend api
            // Send formData object
            axios.post("/upload", formData)
            .then(response => { // Response from backend
                setHTRData({WordList: response.data.WordList,
                            WordConfidence: response.data.WordConfidence,
                            DocText: response.data.DocText,
                            Matrix: response.data.Matrix,
                });
                setHTRDataRecieved(true);
            })
            .catch(err => console.log(err));
        }else{
            alert("Select file to upload!");
        }
    }
    
    if(landingPage){
        return(
            <Landing/>
            );
    }
    
    if(!htrDataRecieved){
        return (
            <div>
                <button onClick={openLandingPage}>Landing Page</button>
                <input type="file" name="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                    Upload!
                </button>
                <div>
                    <img className="FileImage"  id="doc" src={file? URL.createObjectURL(file) : null} alt={file? file.name : null} />
                </div>
                <button onClick={rotateImg}>Rotate Image</button>
            </div>
          );
    }else{
        return (
            <div>
                <button onClick={openLandingPage}>Landing Page</button>
                <input type="file" name="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                    Upload!
                </button>
                <div>
                    <img className="FileImage"  id="doc" src={file? URL.createObjectURL(file) : null} alt={file? file.name : null} />
                </div>
                    <button onClick={rotateImg}>Rotate Image</button>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee Information</th>
                                <th>Regular Hours</th>
                                <th>salary amount</th>
                                <th>Overtime Hours</th>
                                <th>Vacation Hours</th>
                                <th>Sick Hours</th>
                                <th>Personal Hours</th>
                                <th>Holiday Hours</th>
                                <th>Bonus Amounts</th>
                                <th>Misc Amounts</th>
                                <th>stand by hours</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {htrData.Matrix.map((item, index) => (
                                <TableRow
                                key={index}
                                rowNumber={index}
                                item={item}
                                eI={item[0]}
                                rH={item[1]}
                                sA={item[2]}
                                oH={item[3]}
                                vH={item[4]}
                                siH={item[5]}
                                pH={item[6]}
                                hH={item[7]}
                                bA={item[8]}
                                mA={item[9]}
                                stH={item[10]}
                                n={item[11]}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <DocText htrData={htrData} />

            </div>
          );
    }
}
/*                <div>
                List of words along with Confidence levels
                {htrData.WordList.map((word, index) => ( // Maybe pass word and word Confidence to a Word Component
                    <body>{word + ': ' +  100*Math.floor(htrData.WordConfidence[index] * 100) / 100 + '%'}</body>
                    ))};
                <p> ---------------------------------------------</p>
                {htrData.SymbolList.map((letter, index) => ( // Maybe pass symbol and symbol Confidence to a Symbol Component
                   <body>{letter + ': ' +  100*Math.floor(htrData.SymbolConfidence[index] * 100) / 100 + '%'}</body>
                   ))};
                </div>
                */