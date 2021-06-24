import React from 'react';
// import { Text } from "react-native";
import './app.css';

export default function DocText(props) {
    
    return (
        <div>
            <div>
                List of words along with Confidence levels
                {props.htrData.WordList.map((word, index) => { // Maybe pass word and word Confidence to a Word Component
                    if(props.htrData.WordConfidence[index] >= 0.95){
                        return(<li style={{ color: 'green' }}>{word}</li>);
                    }
                    else if(props.htrData.WordConfidence[index] >= 0.80 && props.htrData.WordConfidence[index] < .95){
                        return(<li style={{ color: 'yellow' }}>{word}</li>);
                    }
                    else if(props.htrData.WordConfidence[index] < 0.80){
                        return(<li style={{ color: 'red' }}>{word}</li>);
                    }
                    else{
                         console.log(word + " ?????????")
                    }
                })};
               
                </div>
        </div>
          );
}
/* 
        <div>
            <p className="DocText">{props.htrData.DocText}</p>
        </div>
        
                    {props.htrData.WordList.map((word, index) => 
                    if(props.htrData.WordConfidence[index] >= 0.95){
                        
                    }
                    ))};
        */
        
        