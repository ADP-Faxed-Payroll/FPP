import axios from 'axios';
import React, {useState, useEffect} from 'react';

export default function FileUploader() {
   const [file, setFile] = useState();
   //  [fileSubmitted, setFileSubmitted] = useState(false);
   
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
        .then(res => {
            console.log(res);
            console.log(res.data)
        })
        .catch(error => console.log(error));
        // setFileSubmitted(true);
    }
    
    return (
        <div>
            <div>
                <input type="file" name="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                  Upload!
                </button>
            </div>
        </div>
      );
    
}