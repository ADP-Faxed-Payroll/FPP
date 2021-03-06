import React from 'react';
import './Landing.css';
import ReactDOM from 'react-dom';
import App from './App';
import landingImage from './adp_logo1.png';

export default function Landing() {
    function Login() {
        ReactDOM.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
            document.getElementById('root'),
        );
    }

  return (
    <div class="head">
      <header>
        <div class="container">
          <div class="main">
            <div class="main-part">
              <div class="main-part landing-img">
                <img class="main-img" src={landingImage} alt="ADP Logo" />
              </div>
              <div>
                <h1 class="login title">Automated Payroll System</h1>
                <p class="login text">
                  ADP spends millions on manual payroll analysis and submission so using this technology
                  costs can be avoided and everyone within the ADP family can limit their worries about 
                  their pay. Log into your ADP account below and start today.
                </p>
              </div>
              <div>
                <table class="form-table">
                  <tr>
                    <td>
                      <strong>Username </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input type="text" name="username" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Password </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input type="password" name="password" />
                    </td>
                  </tr>
                </table>
                <br />
                <button class="login-button" type="submit" onClick={Login}>Login</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="grid-container">
        <div class="grid-item">
          <h4>Upload</h4>
          <p>
            As payroll documents are recieved they can be uploaded onto the website for the Google 
            Handwriting API to be scanned quicker than any human could do before.
          </p>
        </div>
        <div class="grid-item">
          <h4>View</h4>
          <p>
            See the output of the AI right where you uploaded as well as the confidence levels of the 
            AI with understanding and compiling the data.
          </p>
        </div>
        <div class="grid-item">
          <h4>Analyze</h4>
          <p>
            Humans are still part of the equation to verify the work that the AI completed. Hover over 
            the different colors of confidence to see the different levels of confidence for specific 
            words or phrases to ensure accurate data.
          </p>
        </div>
        <div class="grid-item">
          <h4>Submit</h4>
          <p>
            Submit the formulated data to the ADP API for payrolls to be applied to their respective
            employee's and customers.
          </p>
        </div>
      </div>
      <footer class="footer-text">
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
  );
}
