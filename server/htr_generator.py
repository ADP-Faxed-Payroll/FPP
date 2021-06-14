import os, io
from google.cloud import vision

import pandas as pd

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'ServiceAccountToken.json'

client = vision.ImageAnnotatorClient()

# file_name = 'HTR-test-2.jpg'
# image_path = f'images/{file_name}'


def generate_htr_file(file_path):
    with io.open(file_path, 'rb') as image_file:
        content = image_file.read()

    # construct an image instance
    image = vision.Image(content=content)

    # annotate Image Response
    response = client.document_text_detection(image=image)  # returns TextAnnotation
    docText = response.full_text_annotation.text
    # print(docText) # full generated text
    return (response)

"""def get_confidence_levels(response):
    pages = response.full_text_annotation.pages
    for page in pages:
        for block in page.blocks:
            print('block confidence:', block.confidence)
    
            for paragraph in block.paragraphs:
                print('paragraph confidence:', paragraph.confidence)
    
                for word in paragraph.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
    
                    print('Word text: {0} (confidence: {1}'.format(word_text, word.confidence))
    
                    for symbol in word.symbols:
                        print('\tSymbol: {0} (confidence: {1}'.format(symbol.text, symbol.confidence))"""