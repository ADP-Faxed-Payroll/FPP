import os
import urllib.request
from flask import Flask, request, redirect, render_template, jsonify
from werkzeug.utils import secure_filename
from htr_generator import generate_htr_file, get_confidence_levels, get_vertices, get_footers

app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
print(APP_ROOT)

UPLOAD_FOLD = 'uploads/' # upload folder path
UPLOAD_FOLDER = os.path.join(APP_ROOT, UPLOAD_FOLD)
print(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # defines path for upload folder

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # as large as 16MB
badCharDict = {}

ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg'])


def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
			word_list = []
			symbol_list = []
			for word in doc_text.split():
				nextWord = ""
				for letter in word:
					if letter in badCharDict.values():
						for key,val in badCharDict.items():
							if letter == val:
								symbol_list.append(key)
								nextWord += key
								break
						continue
					nextWord += letter
					symbol_list.append(letter)
				word_list.append(nextWord)
				nextWord = ""


			word_confidence = get_confidence_levels(doc);
			
			matrix, color_matrix = get_vertices(doc)
			footers = get_footers(doc)
			
			print('File successfully uploaded')

			data = {
				'WordList': word_list,
				'WordConfidence': word_confidence,
				'DocText': doc_text,
				'Matrix': matrix,
				'Footers': footers,
				'Colors': color_matrix,
			}
			
			return jsonify(data)
			
		else:
			print('Allowed file types are pdf, png, jpg, jpeg')
			return redirect(request.url)

@app.route('/updateDictionary', methods=['POST'])
def update_dict():
	if request.method == 'POST':
		bad = request.json['newChar']
		goodNum = request.json['numVal']
		check = False
		# Ensure the value is not an ascii char or return that message in the response
		if(len(bad) != len(bad.encode())):
			# Add it to the dict that would persist throughout the session unless we are using a database
		    badCharDict[goodNum] = bad
		    print("Value added")
		    message = "Value added"
		    check = True
		else:
		    print("It may have been an ascii-encoded unicode string")
		    message = "Value was an ascii string"
		data = {
			'Check': check,
			'Message': message
		}
		return jsonify(data)

if __name__ == "__main__":
    app.run(
    	host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081))
        )