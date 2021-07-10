import axios from 'axios';
import React, { useState } from 'react';
import './app.css';
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

    function rotateImg() {
        if (document.getElementById("doc")){
            setRotateDoc(RotateDoc+90); // add 90 degrees, you can change this as you want
            if (RotateDoc === 90 || RotateDoc === 270) {
                document.getElementById("upload-contain").style.marginTop = "7vw";
                document.getElementById("upload-contain").style.height = "50%";
            }
            else if (RotateDoc === 360) { 
            // 360 means rotate back to 0
                setRotateDoc(0);
                document.getElementById("upload-contain").style.marginTop = "0";
                document.getElementById("upload-contain").style.height = "100%";
            }
            else {
                document.getElementById("upload-contain").style.marginTop = "0";
                document.getElementById("upload-contain").style.height = "100%";
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
            var contain = document.getElementById("upload-contain");
            var loadDiv = document.createElement("div");
            loadDiv.className = "loader";
            loadDiv.id = "load";
            contain.appendChild(loadDiv)
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
                loadDiv.remove();
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
                        <a href="Landing.js">
                            <img class="adp-img" src={landingImage} alt="ADP Logo" />
                        </a>
                    </header>
                    <div class="u-grid">
                        <div class="prev-img">
                            <h5 class="text-c">Image Preview</h5>
                            <img className="FileImage"  id="doc" src={file? URL.createObjectURL(file) : null} alt={file? file.name : null} />
                        </div>
                        <div id="upload-contain">
                            <div class="uploader n-uploader">
                                <h3 class="text-c mtb">Upload Payroll File</h3>
                                <label for="file">Select File</label>
                                <h5 class="text-c mtb">Accepted file types: .pdf</h5>
                                <button class="up-button" onClick={onFileUpload}>
                                    Upload
                                </button>
                                <input class="file-input" type="file" name="file" id="file" onChange={onFileChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <footer class="footer-text location">
                        <p>Made By: Kyle Partyka, AJ Ong, Giovanni DeRosa</p>
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
            <body>
                <div class="upload-body">
                    <header>
                        <a href="Landing.js">
                            <img class="adp-img" src={landingImage} alt="ADP Logo" />
                        </a>
                    </header>
                    <div class="tgrid">
                        <div>
                            <h5 class="text-c" id="prev-text">Image Preview</h5>
                            <img className="FileImage"  id="doc" src={file? URL.createObjectURL(file) : null} alt={file? file.name : null} />
                            <button class="rotate-button" onClick={rotateImg}>Rotate Image</button>
                        </div>
                        <div class="result-grid">
                            <span class="h"><strong>Employee Information</strong></span>
                            <span class="h"><strong>Regular Hours</strong></span>
                            <span class="h"><strong>salary amount</strong></span>
                            <span class="h"><strong>Overtime Hours</strong></span>
                            <span class="h"><strong>Vacation Hours</strong></span>
                            <span class="h"><strong>Sick Hours</strong></span>
                            <span class="h"><strong>Personal Hours</strong></span>
                            <span class="h"><strong>Holiday Hours</strong></span>
                            <span class="h"><strong>Bonus Amounts</strong></span>
                            <span class="h"><strong>Misc Amounts</strong></span>
                            <span class="h"><strong>stand by hours</strong></span>
                            <span class="h"><strong>Notes</strong></span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
    
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>

                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[1]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                            <span contenteditable='true'>{htrData.WordList[90000]}</span>
                            <span contenteditable='true'>Dolor</span>
                            <span contenteditable='true'>Ipsum</span>
                            <span contenteditable='true'>Lorem</span>
                        </div>
                        <div id="upload-contain" class="n-uploader sizing">
                            <h3 class="text-c mtb">Upload Payroll File</h3>
                            <label for="file">Select File</label>
                            <h5 class="text-c mtb">Accepted file types: .pdf</h5>
                            <button class="up-button" onClick={onFileUpload}>
                                Upload
                            </button>
                            <input class="file-input" type="file" name="file" id="file" onChange={onFileChange} />
                        </div>
                        <div>
                            <form>
                                <label for="sub-button">Submit</label>
                                <input class="file-input o" id="sub-button" type="submit"></input>
                            </form>
                       </div>
                    </div>
                    <div>
                        <footer class="footer-text olocation">
                            <p>Made By: Kyle Partyka, AJ Ong, Giovanni DeRosa</p>
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
                </div>
            </body>
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