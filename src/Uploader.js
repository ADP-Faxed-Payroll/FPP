import axios from 'axios';
import React, { useState } from 'react';
import './app.css';
import { Form, Button } from "react-bootstrap";
import DocText from './DocText';
import landingImage from './adp_logo1.png';

export default function FileUploader() {
   const [file, setFile] = useState();
   //  [fileSubmitted, setFileSubmitted] = useState(false);
   const [htrData, setHTRData] = useState({	WordList: [],
                            				SymbolList: [],
                            				WordConfidence: [],
                            				SymbolConfidence: [],
                            				DocText: ''}); // JSON state object
    const[htrDataRecieved, setHTRDataRecieved] = useState(false);
    const [RotateDoc, setRotateDoc] = useState(0);
   
   
    let rotation = 0;
    function rotateImg() {
        if (
      document.getElementById("doc")){
          rotation={RotateDoc}
            setRotateDoc(RotateDoc+90); // add 90 degrees, you can change this as you want
            if (rotation === 360) { 
            // 360 means rotate back to 0
                setRotateDoc(0);
            }
        console.log(RotateDoc)  
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
        }else{
            alert("Select file to upload!")
        }
    }
    if(!htrDataRecieved){
        return (
            <body>
                <div class="upload-body">
                    <header>
                        <img class="adp-img" src={landingImage} alt="ADP Logo" />
                    </header>
                    <input type="file" name="file" onChange={onFileChange} />
                    <button onClick={onFileUpload}>
                        Upload!
                    </button>
                </div>
                <div>
                    <footer class="footer-text">
                        <p>Made By: Kyle Partyka</p>
                        <a href="https://github.com/kwp5/">
                            <img
                                src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                width="75"
                                height="75"
                                alt="Github logo"
                            ></img>
                        </a>
                    </footer>
                </div>
            </body>
          );
    }else{
        return (
            <div>
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
                        <tr>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[90000]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                        </tr>
                        <tr>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                        </tr>
                        <tr>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                        </tr>
                        <tr>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                        </tr>
                        <tr>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                            <td contenteditable='true'>{htrData.WordList[1]}</td>
                            <td contenteditable='true'>Dolor</td>
                            <td contenteditable='true'>Ipsum</td>
                            <td contenteditable='true'>Lorem</td>
                        </tr>
                        <tr>
                            <td><form><input type = "submit"></input></form></td>
                        </tr>
                    </tbody>
                </table>
                
    </div>
                
                <div>
                    <img className="FileImage" src={file? URL.createObjectURL(file) : null} alt={file? file.name : null} />
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