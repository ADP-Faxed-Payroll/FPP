import axios from 'axios';
import React, { useState } from 'react';
import './app.css';
import landingImage from './adp_logo1.png';
import TableRow from './TableRow';

export default function FileUploader() {
   const [file, setFile] = useState();
   //  [fileSubmitted, setFileSubmitted] = useState(false);
   const [htrData, setHTRData] = useState({	WordList: [],
                            				WordConfidence: [],
                            				DocText: '',
                            				Matrix: [],
                            				Footers: {},
                                            }); // JSON state object
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
                            Footers: response.data.Footers,
                            });
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
                            <span class="h"><strong>Salary Amount</strong></span>
                            <span class="h"><strong>Overtime Hours</strong></span>
                            <span class="h"><strong>Vacation Hours</strong></span>
                            <span class="h"><strong>Sick Hours</strong></span>
                            <span class="h"><strong>Personal Hours</strong></span>
                            <span class="h"><strong>Holiday Hours</strong></span>
                            <span class="h"><strong>Bonus Amounts</strong></span>
                            <span class="h"><strong>Misc Amounts</strong></span>
                            <span class="h"><strong>Standby Hours</strong></span>
                            <span class="h"><strong>Notes</strong></span>

                            <span contenteditable='true'>{htrData.Matrix[0][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[0][11]}</span>
                            
                           
                            <span contenteditable='true'>{htrData.Matrix[1][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[1][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[2][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[2][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[3][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[3][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[4][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[4][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[5][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[5][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[6][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[6][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[7][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[7][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[8][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[8][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[9][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[9][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[10][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[10][11]}</span>
                            
                            <span contenteditable='true'>{htrData.Matrix[11][0]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][1]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][2]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][3]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][4]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][5]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][6]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][7]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][8]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][9]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][10]}</span>
                            <span contenteditable='true'>{htrData.Matrix[11][11]}</span>
                            
                            
                            <span class="h"><strong>Company</strong></span> 
                            <span contenteditable='true' class="two">{htrData.Footers['company']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="dp"><strong>Date Printed</strong></span> 
                            <span contenteditable='true' class="date-printed">{htrData.Footers['date_printed']}</span>
                            
                            <span class="h"><strong>Frequency</strong></span> 
                            <span contenteditable='true' class="two">{htrData.Footers['frequency']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h"><strong>Check Date</strong></span> 
                            <span contenteditable='true' class="two">{htrData.Footers['check_date']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h"><strong>Pay Period</strong></span> 
                            <span contenteditable='true' class="two">{htrData.Footers['pay_period']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
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