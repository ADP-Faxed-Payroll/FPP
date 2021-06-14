import axios from 'axios';
 
import React, {useState} from 'react';

export default function App() {
   const [selectedFile, setSelectedFile] = useState();
   
    function onFileChange(e){
        console.log(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
    }
    
    function onFileUpload(e){
        console.log(selectedFile.name);
        
        const formData = new FormData();
        
        // Update the formData object
        formData.append('file', selectedFile);
        formData.append('filename', selectedFile.name);

        // Request made to the backend api
        // Send formData object
        axios.post("/upload", formData);
        
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