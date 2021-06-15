# Faxed Payroll Project

## Team
- AJ Ong
- Giovanni Derosa
- Kyle Partyka
- Alan Payne (Sponsor)

## Overview
The Faxed Payroll Project (FPP) aims to deliver an automated payroll system accessible from the browser. The automated payroll system will allow users to upload a scanned payroll form, and feature an automated  analysis of the computer and handwritten text and will convert it to machine readable text. 

## Setup
1. `npm install`
2. `pip install -r requirements.txt`
3. If you're using AWS C9, run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## To setup Google Vision API you can go to [this link](https://cloud.google.com/vision/docs/setup#sa-create) or follow the steps below
1. In the Cloud Console, go to the **[Create service account](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts/create?supportedpurview=project&_ga=2.215202271.937513644.1623688202-1955621489.1618182675)** page.
2. Select a project.
3. In the **Service account name** field, enter a name. The Cloud Console fills in the **Service account ID** field based on this name.
   In the Service account description field, enter a description. For example, Service account for quickstart.
4. Click **Create**.
5. Click the **Select a role** field.
   Under **Quick access**, click **Basic**, then click **Owner**.
6. Click **Continue**.
7. Click **Done** to finish creating the service account.
    **Do not close your browser window. You will use it in the next step.**

## Create a service account key:
1. In the Cloud Console, click the email address for the service account that you created.
2. Click **Keys**.
3. Click **Add key**, then click **Create new key**.
4. Click **Create**. A JSON key file is downloaded to your computer.
5. Click **Close**.
6. Put ServiceAccountToken.json in the ***server/*** directory

## Start the App
1. Run command in terminal (in your project directory): `cd server/` and then `python app.py`
2. Run command in another terminal, `cd src` into the project directory, and run `npm run start`. 
3. The app will open automatically if you're running it locally. If you're using AWS C9. preview the web page in browser with '/'.
