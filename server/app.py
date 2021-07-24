import os
import urllib.request
from flask import Flask, request, redirect, render_template, jsonify
from werkzeug.utils import secure_filename
from htr_generator import generate_htr_file, get_confidence_levels, get_vertices

app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
print(APP_ROOT)

UPLOAD_FOLD = 'uploads/' # upload folder path
UPLOAD_FOLDER = os.path.join(APP_ROOT, UPLOAD_FOLD)
print(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # defines path for upload folder

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # as large as 16MB


ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg'])


def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():

	if request.method == 'POST':
        # check if the post request has the file part
		if 'file' not in request.files:
			print('No file part')
			return redirect(request.url)

		file = request.files['file']

		if file.filename == '':
			print('No file selected for uploading')
			return redirect(request.url)

		if file and allowed_file(file.filename):
			# creates a secure version of the filename ie. Payroll 6-14.jpg => Payroll_6-14.jpg
			filename = secure_filename(file.filename) 
			
			# saves file in ./server/uploads
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename)) 
			
			doc = generate_htr_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			doc_text = doc.full_text_annotation.text # HRT Api call
			# print(doc_text)
			
			word_list = doc_text.split()
			
			symbol_list = []
			for word in word_list:
				for letter in word:
					symbol_list.append(letter)

			word_confidence, symbol_confidence = get_confidence_levels(doc);
			
			get_vertices(doc)
			
			print('File successfully uploaded')

			data = {
				'WordList': word_list,
				'SymbolList': symbol_list,
				'WordConfidence': word_confidence,
				'SymbolConfidence': symbol_confidence,
				'DocText': doc_text,
			}

			return jsonify(data)
			
		else:
			print('Allowed file types are pdf, png, jpg, jpeg')
			return redirect(request.url)

if __name__ == "__main__":
    app.run(
    	host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081))
        )