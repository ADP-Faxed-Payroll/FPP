import axios from 'axios';
import { useState } from 'react';
import './app.css';
import landingImage from './adp_logo1.png';
import TableRow from './TableRow';
import { CSVLink, CSVDownload } from "react-csv";

export default function FileUploader() {
   const [file, setFile] = useState();
   //  [fileSubmitted, setFileSubmitted] = useState(false);
   const [htrData, setHTRData] = useState({	WordList: [],
                            				WordConfidence: [],
                            				DocText: '',
                            				Matrix: [],
                            				Footers: {},
                            				ColorMatrix:[],
                            				TotalMatrix:[],
                            				SymbolList:[],
                                            }); // JSON state object
    const[htrDataRecieved, setHTRDataRecieved] = useState(false);
    const [RotateDoc, setRotateDoc] = useState(0);
    const [wrongChar, setWrongChar] = useState('');
    const [rightNum, setRightNum] = useState('');
    const [message, setMessage] = useState('');
    
    const [download, setDownload] = useState([]);
    const [filename, setFilename] = useState('');
    
    const [submitted, setSubmit] = useState(false);
    const [confirm, setConfirm] = useState(false);

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
    
    function onSubmit(matrixData){
        let csvContent = "data:text/csv;charset=utf-8," 
        + matrixData.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }
    
    function submitTable(){
        setSubmit(true);
    }
    
    function uploadAgain(){
        setSubmit(false);
        setConfirm(false);
        setHTRDataRecieved(false);
        setFile(null)
    }
    
    function confirmTable(){
        let temp = htrData.TotalMatrix;
        let company = "";
        let date = "";
        for(var i = 0; i < htrData.TotalMatrix.length; i++) {
            var row = htrData.TotalMatrix[i];
            for(var j = 0; j < row.length; j++) {
                if(i === 12 && (j!==1 && j!==11)){
                    continue;
                }
                else if(i === 13 && (j!==1)){
                    continue;
                }
                else if(i === 14 && (j!==1)){
                    continue;
                }
                else if(i === 15 && j!==1){
                    continue;
                }
                else if(i === 12 && j ===1 ){
                    temp[i][j] = document.getElementById('' + i + '' + j).innerHTML;
                    console.log("cell[" + i + "][" + j + "] = " + row[j]);
                    company = temp[i][j];
                }
                else if(i === 12 && j ===11 ){
                    temp[i][j] = document.getElementById('' + i + '' + j).innerHTML;
                    console.log("cell[" + i + "][" + j + "] = " + row[j]);
                    date = temp[i][j];
                }
                else{
                    temp[i][j] = document.getElementById('' + i + '' + j).innerHTML;
                    console.log("cell[" + i + "][" + j + "] = " + row[j]);
                }
            }
        }
        console.log("TEMP: " + temp);
        setFilename(company + date);
        setDownload(temp);
        setConfirm(true);
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
                            TotalMatrix: response.data.TotalMatrix,
                            SymbolList: response.data.SymbolList,
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
    
    
    if(confirm){
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

                            <span style={{color : htrData.ColorMatrix[0][0]}} id="00">{htrData.Matrix[0][0]}</span>
                            <span style={{color : htrData.ColorMatrix[0][1]}} id="01">{htrData.Matrix[0][1]}</span>
                            <span style={{color : htrData.ColorMatrix[0][2]}} id="02">{htrData.Matrix[0][2]}</span>
                            <span style={{color : htrData.ColorMatrix[0][3]}} id="03">{htrData.Matrix[0][3]}</span>
                            <span style={{color : htrData.ColorMatrix[0][4]}} id="04">{htrData.Matrix[0][4]}</span>
                            <span style={{color : htrData.ColorMatrix[0][5]}} id="05">{htrData.Matrix[0][5]}</span>
                            <span style={{color : htrData.ColorMatrix[0][6]}} id="06">{htrData.Matrix[0][6]}</span>
                            <span style={{color : htrData.ColorMatrix[0][7]}} id="07">{htrData.Matrix[0][7]}</span>
                            <span style={{color : htrData.ColorMatrix[0][8]}} id="08">{htrData.Matrix[0][8]}</span>
                            <span style={{color : htrData.ColorMatrix[0][9]}} id="09">{htrData.Matrix[0][9]}</span>
                            <span style={{color : htrData.ColorMatrix[0][10]}} id="010">{htrData.Matrix[0][10]}</span>
                            <span style={{color : htrData.ColorMatrix[0][11]}} id="011">{htrData.Matrix[0][11]}</span>
                            
                           
                            <span style={{color : htrData.ColorMatrix[1][0]}} id="10">{htrData.Matrix[1][0]}</span>
                            <span style={{color : htrData.ColorMatrix[1][1]}} id="11">{htrData.Matrix[1][1]}</span>
                            <span style={{color : htrData.ColorMatrix[1][2]}} id="12">{htrData.Matrix[1][2]}</span>
                            <span style={{color : htrData.ColorMatrix[1][3]}} id="13">{htrData.Matrix[1][3]}</span>
                            <span style={{color : htrData.ColorMatrix[1][4]}} id="14">{htrData.Matrix[1][4]}</span>
                            <span style={{color : htrData.ColorMatrix[1][5]}} id="15">{htrData.Matrix[1][5]}</span>
                            <span style={{color : htrData.ColorMatrix[1][6]}} id="16">{htrData.Matrix[1][6]}</span>
                            <span style={{color : htrData.ColorMatrix[1][7]}} id="17">{htrData.Matrix[1][7]}</span>
                            <span style={{color : htrData.ColorMatrix[1][8]}} id="18">{htrData.Matrix[1][8]}</span>
                            <span style={{color : htrData.ColorMatrix[1][9]}} id="19">{htrData.Matrix[1][9]}</span>
                            <span style={{color : htrData.ColorMatrix[1][10]}} id="110">{htrData.Matrix[1][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[1][11]}} id="111">{htrData.Matrix[1][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[2][0]}} id="20">{htrData.Matrix[2][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][1]}} id="21">{htrData.Matrix[2][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][2]}} id="22">{htrData.Matrix[2][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][3]}} id="23">{htrData.Matrix[2][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][4]}} id="24">{htrData.Matrix[2][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][5]}} id="25">{htrData.Matrix[2][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][6]}} id="26">{htrData.Matrix[2][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][7]}} id="27">{htrData.Matrix[2][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][8]}} id="28">{htrData.Matrix[2][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][9]}} id="29">{htrData.Matrix[2][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][10]}} id="210">{htrData.Matrix[2][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[2][11]}} id="211">{htrData.Matrix[2][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[3][0]}} id="30">{htrData.Matrix[3][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][1]}} id="31">{htrData.Matrix[3][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][2]}} id="32">{htrData.Matrix[3][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][3]}} id="33">{htrData.Matrix[3][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][4]}} id="34">{htrData.Matrix[3][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][5]}} id="35">{htrData.Matrix[3][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][6]}} id="36">{htrData.Matrix[3][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][7]}} id="37">{htrData.Matrix[3][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][8]}} id="38">{htrData.Matrix[3][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][9]}} id="39">{htrData.Matrix[3][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][10]}} id="310">{htrData.Matrix[3][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[3][11]}} id="311">{htrData.Matrix[3][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[4][0]}} id="40">{htrData.Matrix[4][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][1]}} id="41">{htrData.Matrix[4][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][2]}} id="42">{htrData.Matrix[4][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][3]}} id="43">{htrData.Matrix[4][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][4]}} id="44">{htrData.Matrix[4][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][5]}} id="45">{htrData.Matrix[4][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][6]}} id="46">{htrData.Matrix[4][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][7]}} id="47">{htrData.Matrix[4][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][8]}} id="48">{htrData.Matrix[4][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][9]}} id="49">{htrData.Matrix[4][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][10]}} id="410">{htrData.Matrix[4][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[4][1]}} id="411">{htrData.Matrix[4][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[5][0]}} id="50">{htrData.Matrix[5][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][1]}} id="51">{htrData.Matrix[5][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][2]}} id="52">{htrData.Matrix[5][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][3]}} id="53">{htrData.Matrix[5][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][4]}} id="54">{htrData.Matrix[5][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][5]}} id="55">{htrData.Matrix[5][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][6]}} id="56">{htrData.Matrix[5][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][7]}} id="57">{htrData.Matrix[5][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][8]}} id="58">{htrData.Matrix[5][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][9]}} id="59">{htrData.Matrix[5][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][10]}} id="510">{htrData.Matrix[5][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[5][11]}} id="511">{htrData.Matrix[5][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[6][0]}} id="60">{htrData.Matrix[6][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][1]}} id="61">{htrData.Matrix[6][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][2]}} id="62">{htrData.Matrix[6][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][3]}} id="63">{htrData.Matrix[6][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][4]}} id="64">{htrData.Matrix[6][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][5]}} id="65">{htrData.Matrix[6][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][6]}} id="66">{htrData.Matrix[6][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][7]}} id="67">{htrData.Matrix[6][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][8]}} id="68">{htrData.Matrix[6][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][9]}} id="69">{htrData.Matrix[6][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][10]}} id="610">{htrData.Matrix[6][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[6][11]}} id="611">{htrData.Matrix[6][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[7][0]}} id="70">{htrData.Matrix[7][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][1]}} id="71">{htrData.Matrix[7][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][2]}} id="72">{htrData.Matrix[7][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][3]}} id="73">{htrData.Matrix[7][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][4]}} id="74">{htrData.Matrix[7][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][5]}} id="75">{htrData.Matrix[7][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][6]}} id="76">{htrData.Matrix[7][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][7]}} id="77">{htrData.Matrix[7][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][8]}} id="78">{htrData.Matrix[7][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][9]}} id="79">{htrData.Matrix[7][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][10]}} id="710">{htrData.Matrix[7][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[7][11]}} id="711">{htrData.Matrix[7][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[8][0]}} id="80">{htrData.Matrix[8][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][1]}} id="81">{htrData.Matrix[8][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][2]}} id="82">{htrData.Matrix[8][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][3]}} id="83">{htrData.Matrix[8][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][4]}} id="84">{htrData.Matrix[8][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][5]}} id="85">{htrData.Matrix[8][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][6]}} id="86">{htrData.Matrix[8][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][7]}} id="87">{htrData.Matrix[8][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][8]}} id="88">{htrData.Matrix[8][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][9]}} id="89">{htrData.Matrix[8][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][10]}} id="810">{htrData.Matrix[8][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[8][11]}} id="811">{htrData.Matrix[8][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[9][0]}} id="90">{htrData.Matrix[9][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][1]}} id="91">{htrData.Matrix[9][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][2]}} id="92">{htrData.Matrix[9][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][3]}} id="93">{htrData.Matrix[9][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][4]}} id="94">{htrData.Matrix[9][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][5]}} id="95">{htrData.Matrix[9][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][6]}} id="96">{htrData.Matrix[9][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][7]}} id="97">{htrData.Matrix[9][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][8]}} id="98">{htrData.Matrix[9][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][9]}} id="99">{htrData.Matrix[9][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][10]}} id="910">{htrData.Matrix[9][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[9][11]}} id="911">{htrData.Matrix[9][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[10][0]}} id="100">{htrData.Matrix[10][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][1]}} id="101">{htrData.Matrix[10][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][2]}} id="102">{htrData.Matrix[10][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][3]}} id="103">{htrData.Matrix[10][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][4]}} id="104">{htrData.Matrix[10][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][5]}} id="105">{htrData.Matrix[10][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][6]}} id="106">{htrData.Matrix[10][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][7]}} id="107">{htrData.Matrix[10][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][8]}} id="108">{htrData.Matrix[10][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][9]}} id="109">{htrData.Matrix[10][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][10]}} id="1010">{htrData.Matrix[10][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[10][11]}} id="1011">{htrData.Matrix[10][11]}</span>
                            
                            <span  style={{color : htrData.ColorMatrix[11][0]}} id="110">{htrData.Matrix[11][0]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][1]}} id="111">{htrData.Matrix[11][1]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][2]}} id="112">{htrData.Matrix[11][2]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][3]}} id="113">{htrData.Matrix[11][3]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][4]}} id="114">{htrData.Matrix[11][4]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][5]}} id="115">{htrData.Matrix[11][5]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][6]}} id="116">{htrData.Matrix[11][6]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][7]}} id="117">{htrData.Matrix[11][7]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][8]}} id="118">{htrData.Matrix[11][8]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][9]}} id="119">{htrData.Matrix[11][9]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][10]}} id="1110">{htrData.Matrix[11][10]}</span>
                            <span  style={{color : htrData.ColorMatrix[11][11]}} id="1111">{htrData.Matrix[11][11]}</span>
                            
                            <span class="h" id="120"><strong>Company:</strong></span> 
                            <span  class="two" style={{color : htrData.Footers['colors'][1]}} id="121">{htrData.Footers['company']}</span>
                            <span class="clvl"><strong>Confidence Level Colors</strong></span>
                            <span class="dp" id="1210"><strong>Date Printed:</strong></span> 
                            <span  class="date-printed" style={{color : htrData.Footers['colors'][0]}} id="1211">{htrData.Footers['date_printed']}</span>
                            
                            <span class="h" id="130"><strong>Frequency:</strong></span> 
                            <span  class="two" style={{color : htrData.Footers['colors'][2]}}  id="131">{htrData.Footers['frequency']}</span>
                            <span class="three" style={{color : "green"}}><strong>Confidence above 95%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h" id="140"><strong>Check Date:</strong></span> 
                            <span  class="two" style={{color : htrData.Footers['colors'][3]}} id="141">{htrData.Footers['check_date']}</span>
                            <span class="three" style={{color : "orange"}}><strong>Confidence between 95%-85%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h" id="150"><strong>Pay Period:</strong></span> 
                            <span  class="two" style={{color : htrData.Footers['colors'][4]}} id="151">{htrData.Footers['pay_period']}</span>
                            <span class="three" style={{color : "red"}}><strong>Confidence below 85%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                        </div>
                        
                        <div id="upload-contain" class="n-uploader sizing">
                            <h3 class="text-c mtb">Upload Payroll File</h3>
                            <label for="file">Select File</label>
                            <h5 class="text-c mtb">Accepted file types: .jpg .png</h5>
                            <button class="up-button" onClick={onFileUpload}>
                                Upload
                            </button>
                            <input class="file-input" type="file" name="file" id="file" onChange={onFileChange} />
                        </div>
                        <div>
                            <form >
                                <label for="confrim-button" onClick={uploadAgain}><strong>Upload again</strong></label>
                                <br />
                                <CSVLink  className="csvDL" data={download} filename={filename + '.csv'}>Download</CSVLink>
                                <br />
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
                                            <input class="s-input-box" type="text" maxlength="1" placeholder="Symbol" onChange={e => setWrongChar(e.target.value)}></input>
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
    
    
    if(submitted){
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

                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][0]}} id="00">{htrData.Matrix[0][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][1]}} id="01">{htrData.Matrix[0][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][2]}} id="02">{htrData.Matrix[0][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][3]}} id="03">{htrData.Matrix[0][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][4]}} id="04">{htrData.Matrix[0][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][5]}} id="05">{htrData.Matrix[0][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][6]}} id="06">{htrData.Matrix[0][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][7]}} id="07">{htrData.Matrix[0][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][8]}} id="08">{htrData.Matrix[0][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][9]}} id="09">{htrData.Matrix[0][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][10]}} id="010">{htrData.Matrix[0][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][11]}} id="011">{htrData.Matrix[0][11]}</span>
                            
                           
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][0]}} id="10">{htrData.Matrix[1][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][1]}} id="11">{htrData.Matrix[1][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][2]}} id="12">{htrData.Matrix[1][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][3]}} id="13">{htrData.Matrix[1][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][4]}} id="14">{htrData.Matrix[1][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][5]}} id="15">{htrData.Matrix[1][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][6]}} id="16">{htrData.Matrix[1][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][7]}} id="17">{htrData.Matrix[1][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][8]}} id="18">{htrData.Matrix[1][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][9]}} id="19">{htrData.Matrix[1][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][10]}} id="110">{htrData.Matrix[1][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[1][11]}} id="111">{htrData.Matrix[1][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][0]}} id="20">{htrData.Matrix[2][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][1]}} id="21">{htrData.Matrix[2][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][2]}} id="22">{htrData.Matrix[2][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][3]}} id="23">{htrData.Matrix[2][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][4]}} id="24">{htrData.Matrix[2][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][5]}} id="25">{htrData.Matrix[2][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][6]}} id="26">{htrData.Matrix[2][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][7]}} id="27">{htrData.Matrix[2][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][8]}} id="28">{htrData.Matrix[2][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][9]}} id="29">{htrData.Matrix[2][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][10]}} id="210">{htrData.Matrix[2][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[2][11]}} id="211">{htrData.Matrix[2][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][0]}} id="30">{htrData.Matrix[3][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][1]}} id="31">{htrData.Matrix[3][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][2]}} id="32">{htrData.Matrix[3][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][3]}} id="33">{htrData.Matrix[3][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][4]}} id="34">{htrData.Matrix[3][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][5]}} id="35">{htrData.Matrix[3][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][6]}} id="36">{htrData.Matrix[3][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][7]}} id="37">{htrData.Matrix[3][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][8]}} id="38">{htrData.Matrix[3][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][9]}} id="39">{htrData.Matrix[3][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][10]}} id="310">{htrData.Matrix[3][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][11]}} id="311">{htrData.Matrix[3][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][0]}} id="40">{htrData.Matrix[4][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][1]}} id="41">{htrData.Matrix[4][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][2]}} id="42">{htrData.Matrix[4][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][3]}} id="43">{htrData.Matrix[4][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][4]}} id="44">{htrData.Matrix[4][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][5]}} id="45">{htrData.Matrix[4][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][6]}} id="46">{htrData.Matrix[4][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][7]}} id="47">{htrData.Matrix[4][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][8]}} id="48">{htrData.Matrix[4][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][9]}} id="49">{htrData.Matrix[4][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][10]}} id="410">{htrData.Matrix[4][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[4][1]}} id="411">{htrData.Matrix[4][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][0]}} id="50">{htrData.Matrix[5][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][1]}} id="51">{htrData.Matrix[5][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][2]}} id="52">{htrData.Matrix[5][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][3]}} id="53">{htrData.Matrix[5][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][4]}} id="54">{htrData.Matrix[5][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][5]}} id="55">{htrData.Matrix[5][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][6]}} id="56">{htrData.Matrix[5][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][7]}} id="57">{htrData.Matrix[5][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][8]}} id="58">{htrData.Matrix[5][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][9]}} id="59">{htrData.Matrix[5][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][10]}} id="510">{htrData.Matrix[5][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[5][11]}} id="511">{htrData.Matrix[5][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][0]}} id="60">{htrData.Matrix[6][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][1]}} id="61">{htrData.Matrix[6][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][2]}} id="62">{htrData.Matrix[6][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][3]}} id="63">{htrData.Matrix[6][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][4]}} id="64">{htrData.Matrix[6][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][5]}} id="65">{htrData.Matrix[6][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][6]}} id="66">{htrData.Matrix[6][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][7]}} id="67">{htrData.Matrix[6][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][8]}} id="68">{htrData.Matrix[6][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][9]}} id="69">{htrData.Matrix[6][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][10]}} id="610">{htrData.Matrix[6][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][11]}} id="611">{htrData.Matrix[6][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][0]}} id="70">{htrData.Matrix[7][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][1]}} id="71">{htrData.Matrix[7][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][2]}} id="72">{htrData.Matrix[7][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][3]}} id="73">{htrData.Matrix[7][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][4]}} id="74">{htrData.Matrix[7][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][5]}} id="75">{htrData.Matrix[7][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][6]}} id="76">{htrData.Matrix[7][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][7]}} id="77">{htrData.Matrix[7][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][8]}} id="78">{htrData.Matrix[7][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][9]}} id="79">{htrData.Matrix[7][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][10]}} id="710">{htrData.Matrix[7][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[7][11]}} id="711">{htrData.Matrix[7][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][0]}} id="80">{htrData.Matrix[8][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][1]}} id="81">{htrData.Matrix[8][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][2]}} id="82">{htrData.Matrix[8][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][3]}} id="83">{htrData.Matrix[8][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][4]}} id="84">{htrData.Matrix[8][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][5]}} id="85">{htrData.Matrix[8][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][6]}} id="86">{htrData.Matrix[8][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][7]}} id="87">{htrData.Matrix[8][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][8]}} id="88">{htrData.Matrix[8][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][9]}} id="89">{htrData.Matrix[8][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][10]}} id="810">{htrData.Matrix[8][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[8][11]}} id="811">{htrData.Matrix[8][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][0]}} id="90">{htrData.Matrix[9][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][1]}} id="91">{htrData.Matrix[9][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][2]}} id="92">{htrData.Matrix[9][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][3]}} id="93">{htrData.Matrix[9][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][4]}} id="94">{htrData.Matrix[9][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][5]}} id="95">{htrData.Matrix[9][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][6]}} id="96">{htrData.Matrix[9][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][7]}} id="97">{htrData.Matrix[9][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][8]}} id="98">{htrData.Matrix[9][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][9]}} id="99">{htrData.Matrix[9][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][10]}} id="910">{htrData.Matrix[9][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[9][11]}} id="911">{htrData.Matrix[9][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][0]}} id="100">{htrData.Matrix[10][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][1]}} id="101">{htrData.Matrix[10][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][2]}} id="102">{htrData.Matrix[10][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][3]}} id="103">{htrData.Matrix[10][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][4]}} id="104">{htrData.Matrix[10][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][5]}} id="105">{htrData.Matrix[10][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][6]}} id="106">{htrData.Matrix[10][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][7]}} id="107">{htrData.Matrix[10][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][8]}} id="108">{htrData.Matrix[10][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][9]}} id="109">{htrData.Matrix[10][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][10]}} id="1010">{htrData.Matrix[10][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[10][11]}} id="1011">{htrData.Matrix[10][11]}</span>
                            
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][0]}} id="110">{htrData.Matrix[11][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][1]}} id="111">{htrData.Matrix[11][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][2]}} id="112">{htrData.Matrix[11][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][3]}} id="113">{htrData.Matrix[11][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][4]}} id="114">{htrData.Matrix[11][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][5]}} id="115">{htrData.Matrix[11][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][6]}} id="116">{htrData.Matrix[11][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][7]}} id="117">{htrData.Matrix[11][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][8]}} id="118">{htrData.Matrix[11][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][9]}} id="119">{htrData.Matrix[11][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][10]}} id="1110">{htrData.Matrix[11][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[11][11]}} id="1111">{htrData.Matrix[11][11]}</span>
                            
                            <span class="h" id="120"><strong>Company:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][1]}} id="121">{htrData.Footers['company']}</span>
                            <span class="clvl"><strong>Confidence Level Colors</strong></span>
                            <span class="dp" id="1210"><strong>Date Printed:</strong></span> 
                            <span contenteditable='true' class="date-printed" style={{color : htrData.Footers['colors'][0]}} id="1211">{htrData.Footers['date_printed']}</span>
                            
                            <span class="h" id="130"><strong>Frequency:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][2]}}  id="131">{htrData.Footers['frequency']}</span>
                            <span class="three" style={{color : "green"}}><strong>Confidence above 95%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h" id="140"><strong>Check Date:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][3]}} id="141">{htrData.Footers['check_date']}</span>
                            <span class="three" style={{color : "orange"}}><strong>Confidence between 95%-85%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h" id="150"><strong>Pay Period:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][4]}} id="151">{htrData.Footers['pay_period']}</span>
                            <span class="three" style={{color : "red"}}><strong>Confidence below 85%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                        </div>
                        
                        <div id="upload-contain" class="n-uploader sizing">
                            <h3 class="text-c mtb">Upload Payroll File</h3>
                            <label for="file">Select File</label>
                            <h5 class="text-c mtb">Accepted file types: .jpg .png</h5>
                            <button class="up-button" onClick={onFileUpload}>
                                Upload
                            </button>
                            <input class="file-input" type="file" name="file" id="file" onChange={onFileChange} />
                        </div>
                        <div>
                            <form style={{color : 'red'}}>
                                <label for="confrim-button" onClick={confirmTable}><strong>CONFIRM</strong></label>
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
                                            <input class="s-input-box" type="text" maxlength="1" placeholder="Symbol" onChange={e => setWrongChar(e.target.value)}></input>
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
                                <h5 class="text-c mtb">Accepted file types: .jpg .png</h5>
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

                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][0]}} id="00">{htrData.Matrix[0][0]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][1]}} id="01">{htrData.Matrix[0][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][2]}} id="02">{htrData.Matrix[0][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][3]}} id="03">{htrData.Matrix[0][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][4]}} id="04">{htrData.Matrix[0][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][5]}} id="05">{htrData.Matrix[0][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][6]}} id="06">{htrData.Matrix[0][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][7]}} id="07">{htrData.Matrix[0][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][8]}} id="08">{htrData.Matrix[0][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][9]}} id="09">{htrData.Matrix[0][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][10]}} id="010">{htrData.Matrix[0][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[0][11]}} id="011">{htrData.Matrix[0][11]}</span>
                            
                           
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
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][1]}}>{htrData.Matrix[3][1]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][2]}}>{htrData.Matrix[3][2]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][3]}}>{htrData.Matrix[3][3]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][4]}}>{htrData.Matrix[3][4]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][5]}}>{htrData.Matrix[3][5]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][6]}}>{htrData.Matrix[3][6]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][7]}}>{htrData.Matrix[3][7]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][8]}}>{htrData.Matrix[3][8]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][9]}}>{htrData.Matrix[3][9]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][10]}}>{htrData.Matrix[3][10]}</span>
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[3][11]}}>{htrData.Matrix[3][11]}</span>
                            
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
                            <span contenteditable='true' style={{color : htrData.ColorMatrix[6][11]}}>{htrData.Matrix[6][11]}</span>
                            
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
                            
                            <span class="h"><strong>Company:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][1]}}>{htrData.Footers['company']}</span>
                            <span class="clvl"><strong>Confidence Level Colors</strong></span>
                            <span class="dp"><strong>Date Printed:</strong></span> 
                            <span contenteditable='true' class="date-printed" style={{color : htrData.Footers['colors'][0]}}>{htrData.Footers['date_printed']}</span>
                            
                            <span class="h"><strong>Frequency:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][2]}}>{htrData.Footers['frequency']}</span>
                            <span class="three" style={{color : "green"}}><strong>Confidence above 95%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h"><strong>Check Date:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][3]}}>{htrData.Footers['check_date']}</span>
                            <span class="three" style={{color : "orange"}}><strong>Confidence between 95%-85%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            
                            <span class="h"><strong>Pay Period:</strong></span> 
                            <span contenteditable='true' class="two" style={{color : htrData.Footers['colors'][4]}}>{htrData.Footers['pay_period']}</span>
                            <span class="three" style={{color : "red"}}><strong>Confidence below 85%</strong></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                            <span class="h"></span>
                        </div>
                        
                        <div id="upload-contain" class="n-uploader sizing">
                            <h3 class="text-c mtb">Upload Payroll File</h3>
                            <label for="file">Select File</label>
                            <h5 class="text-c mtb">Accepted file types: .jpg .png</h5>
                            <button class="up-button" onClick={onFileUpload}>
                                Upload
                            </button>
                            <input class="file-input" type="file" name="file" id="file" onChange={onFileChange} />
                        </div>
                        <div>
                            <form>
                                <label for="sub-button" onClick={submitTable}>Submit</label>
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
                                            <input class="s-input-box" type="text" maxlength="1" placeholder="Symbol" onChange={e => setWrongChar(e.target.value)}></input>
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