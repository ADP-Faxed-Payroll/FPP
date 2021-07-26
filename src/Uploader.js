import axios from 'axios';
import { useState } from 'react';
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
                            				ColorMatrix:[],
                                            }); // JSON state object
    const[htrDataRecieved, setHTRDataRecieved] = useState(false);
    const [RotateDoc, setRotateDoc] = useState(0);
    const [wrongChar, setWrongChar] = useState('');
    const [rightNum, setRightNum] = useState('');
    const [message, setMessage] = useState('');

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
            var contain = document.getElementById("upload-contain");
            var loadDiv = document.createElement("div");
            loadDiv.className = "loader";
            loadDiv.id = "load";
            contain.appendChild(loadDiv);
            console.log(file.name);
            setMessage('');

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
                            ColorMatrix: response.data.Colors,
                            });
                loadDiv.remove();
                setHTRDataRecieved(true);
            })
            .catch(err => console.log(err));
        }else{
            alert("Select file to upload!");
        }
    }
    
    function inputBadChar() {
        const symbols = htrData["SymbolList"];
        const charData = {newChar: wrongChar, numVal: rightNum};
        for (let i = 0; i < symbols.length; i++) {
            if (wrongChar === symbols[i]){
                // Change value in current symbol set to adjust dataset for user?
                symbols[i] = rightNum;
                axios.post("/updateDictionary", charData)
                .then(response => {
                    if (response.data.Check) {
                        console.log("Value added to the dictionary");
                        //Have a response message show to the user
                        setMessage(response.data.Message);
                    }
                    else {
                        console.log("Value already in the dictionary or failed to be added");
                        //Have a response message show to the user
                        setMessage(response.data.Message);
                    }
                })
                .catch(err => console.log(err));
                break;
            }
            else {
                console.log("Character Not Found In Dataset");
                setMessage("Character Not Found In Dataset");
            }
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
                            <h4 class="text-c">Image Preview</h4>
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
                        <a href="https://github.com/kwp5">
                            <img
                                src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                width="75"
                                height="75"
                                alt="Github logo"
                                title="Kyle's GitHub"
                            ></img>
                        </a>
                        <a href="https://github.com/Aj-Ong">
                            <img
                                src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                width="75"
                                height="75"
                                alt="Github logo"
                                title="AJ's GitHub"
                            ></img>
                        </a>
                        <a href="https://github.com/gioNJIT">
                            <img
                                src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                width="75"
                                height="75"
                                alt="Github logo"
                                title="Giovanni's GitHub"
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

                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][0]}}>{htrData.Matrix[0][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][1]}}>{htrData.Matrix[0][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][2]}}>{htrData.Matrix[0][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][3]}}>{htrData.Matrix[0][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][4]}}>{htrData.Matrix[0][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][5]}}>{htrData.Matrix[0][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][6]}}>{htrData.Matrix[0][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][7]}}>{htrData.Matrix[0][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][8]}}>{htrData.Matrix[0][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][9]}}>{htrData.Matrix[0][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][10]}}>{htrData.Matrix[0][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][11]}}>{htrData.Matrix[0][11]}</span>
                            
                           
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][0]}}>{htrData.Matrix[1][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][1]}}>{htrData.Matrix[1][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][2]}}>{htrData.Matrix[1][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][3]}}>{htrData.Matrix[1][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][4]}}>{htrData.Matrix[1][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][5]}}>{htrData.Matrix[1][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][6]}}>{htrData.Matrix[1][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][7]}}>{htrData.Matrix[1][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][8]}}>{htrData.Matrix[1][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][9]}}>{htrData.Matrix[1][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][10]}}>{htrData.Matrix[1][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][11]}}>{htrData.Matrix[1][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][0]}}>{htrData.Matrix[2][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][1]}}>{htrData.Matrix[2][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][2]}}>{htrData.Matrix[2][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][3]}}>{htrData.Matrix[2][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][4]}}>{htrData.Matrix[2][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][5]}}>{htrData.Matrix[2][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][6]}}>{htrData.Matrix[2][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][7]}}>{htrData.Matrix[2][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][8]}}>{htrData.Matrix[2][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][9]}}>{htrData.Matrix[2][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][10]}}>{htrData.Matrix[2][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][11]}}>{htrData.Matrix[2][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}}>{htrData.Matrix[3][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][0]}}>{htrData.Matrix[4][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][1]}}>{htrData.Matrix[4][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][2]}}>{htrData.Matrix[4][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][3]}}>{htrData.Matrix[4][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][4]}}>{htrData.Matrix[4][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][5]}}>{htrData.Matrix[4][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][6]}}>{htrData.Matrix[4][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][7]}}>{htrData.Matrix[4][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][8]}}>{htrData.Matrix[4][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][9]}}>{htrData.Matrix[4][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][10]}}>{htrData.Matrix[4][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][1]}}>{htrData.Matrix[4][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][0]}}>{htrData.Matrix[5][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][1]}}>{htrData.Matrix[5][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][2]}}>{htrData.Matrix[5][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][3]}}>{htrData.Matrix[5][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][4]}}>{htrData.Matrix[5][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][5]}}>{htrData.Matrix[5][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][6]}}>{htrData.Matrix[5][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][7]}}>{htrData.Matrix[5][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][8]}}>{htrData.Matrix[5][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][9]}}>{htrData.Matrix[5][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][10]}}>{htrData.Matrix[5][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][11]}}>{htrData.Matrix[5][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][0]}}>{htrData.Matrix[6][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][1]}}>{htrData.Matrix[6][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][2]}}>{htrData.Matrix[6][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][3]}}>{htrData.Matrix[6][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][4]}}>{htrData.Matrix[6][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][5]}}>{htrData.Matrix[6][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][6]}}>{htrData.Matrix[6][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][7]}}>{htrData.Matrix[6][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][8]}}>{htrData.Matrix[6][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][9]}}>{htrData.Matrix[6][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][10]}}>{htrData.Matrix[6][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][1]}}>{htrData.Matrix[6][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][0]}}>{htrData.Matrix[7][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][1]}}>{htrData.Matrix[7][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][2]}}>{htrData.Matrix[7][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][3]}}>{htrData.Matrix[7][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][4]}}>{htrData.Matrix[7][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][5]}}>{htrData.Matrix[7][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][6]}}>{htrData.Matrix[7][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][7]}}>{htrData.Matrix[7][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][8]}}>{htrData.Matrix[7][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][9]}}>{htrData.Matrix[7][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][10]}}>{htrData.Matrix[7][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][11]}}>{htrData.Matrix[7][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][0]}}>{htrData.Matrix[8][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][1]}}>{htrData.Matrix[8][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][2]}}>{htrData.Matrix[8][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][3]}}>{htrData.Matrix[8][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][4]}}>{htrData.Matrix[8][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][5]}}>{htrData.Matrix[8][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][6]}}>{htrData.Matrix[8][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][7]}}>{htrData.Matrix[8][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][8]}}>{htrData.Matrix[8][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][9]}}>{htrData.Matrix[8][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][10]}}>{htrData.Matrix[8][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][11]}}>{htrData.Matrix[8][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][0]}}>{htrData.Matrix[9][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][1]}}>{htrData.Matrix[9][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][2]}}>{htrData.Matrix[9][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][3]}}>{htrData.Matrix[9][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][4]}}>{htrData.Matrix[9][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][5]}}>{htrData.Matrix[9][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][6]}}>{htrData.Matrix[9][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][7]}}>{htrData.Matrix[9][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][8]}}>{htrData.Matrix[9][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][9]}}>{htrData.Matrix[9][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][10]}}>{htrData.Matrix[9][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][11]}}>{htrData.Matrix[9][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][0]}}>{htrData.Matrix[10][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][1]}}>{htrData.Matrix[10][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][2]}}>{htrData.Matrix[10][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][3]}}>{htrData.Matrix[10][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][4]}}>{htrData.Matrix[10][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][5]}}>{htrData.Matrix[10][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][6]}}>{htrData.Matrix[10][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][7]}}>{htrData.Matrix[10][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][8]}}>{htrData.Matrix[10][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][9]}}>{htrData.Matrix[10][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][10]}}>{htrData.Matrix[10][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][11]}}>{htrData.Matrix[10][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][0]}}>{htrData.Matrix[11][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][1]}}>{htrData.Matrix[11][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][2]}}>{htrData.Matrix[11][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][3]}}>{htrData.Matrix[11][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][4]}}>{htrData.Matrix[11][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][5]}}>{htrData.Matrix[11][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][6]}}>{htrData.Matrix[11][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][7]}}>{htrData.Matrix[11][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][8]}}>{htrData.Matrix[11][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][9]}}>{htrData.Matrix[11][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][10]}}>{htrData.Matrix[11][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][11]}}>{htrData.Matrix[11][11]}</span>
                            
                            
                            <span class="h"><strong>Company</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][1]}}>{htrData.Footers['company']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="dp"><strong>Date Printed</strong></span> 
                            <span contenteditable='true' class="date-printed" style={{color : htrData.Footers['colors'][0]}}>{htrData.Footers['date_printed']}</span>
                            
                            <span class="h"><strong>Frequency</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][2]}}>{htrData.Footers['frequency']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h"><strong>Check Date</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][3]}}>{htrData.Footers['check_date']}</span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h"><strong>Pay Period</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][4]}}>{htrData.Footers['pay_period']}</span>
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
                            <div class="n-uploader pad">
                                <table>
                                    <tr>
                                        <td class="text-c">
                                            <strong>Incorrect Character</strong>
                                        </td>
                                        <td>
                                        </td>
                                        <td class="text-c">
                                            <strong>Replacement Number</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-c">
                                            <input class="s-input-box" type="text" maxlength="1" placeholder="Non-ASCII" onChange={e => setWrongChar(e.target.value)}></input>
                                        </td>
                                        <td>
                                        <strong>-{">"}</strong>
                                        </td>
                                        <td class="text-c">
                                            <input class="s-input-box" type="number" maxlength="1" placeholder="Number" onChange={e => setRightNum(e.target.value)}></input>
                                        </td>
                                    </tr>
                                </table>
                                <button class="bad-char-button" onClick={inputBadChar}>Correct</button>
                            </div>
                            {message !== '' &&
                                <div class="text-c">
                                    {message}
                                </div>
                            }
                       </div>
                    </div>
                    <div>
                        <footer class="footer-text olocation">
                            <p>Made By: Kyle Partyka, AJ Ong, Giovanni DeRosa</p>
                            <a href="https://github.com/kwp5">
                                <img
                                    src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                    width="75"
                                    height="75"
                                    alt="Github logo"
                                    title="Kyle's GitHub"
                                ></img>
                            </a>
                            <a href="https://github.com/Aj-Ong">
                                <img
                                    src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                    width="75"
                                    height="75"
                                    alt="Github logo"
                                    title="AJ's GitHub"
                                ></img>
                            </a>
                            <a href="https://github.com/gioNJIT">
                                <img
                                    src="https://www.clipartmax.com/png/middle/48-483031_github-logo-black-and-white-github-icon-vector.png"
                                    width="75"
                                    height="75"
                                    alt="Github logo"
                                    title="Giovanni's GitHub"
                                ></img>
                            </a>
                        </footer>
                    </div>
                </div>
            </body>
          );
    }
}