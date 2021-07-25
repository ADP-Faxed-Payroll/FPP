import os, io
from google.cloud import vision

import pandas as pd

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'ServiceAccountToken.json'

client = vision.ImageAnnotatorClient()

def generate_htr_file(file_path):
    with io.open(file_path, 'rb') as image_file:
        content = image_file.read()

    # construct an image instance
    image = vision.Image(content=content)

    # annotate Image Response
    response = client.document_text_detection(image=image)  # returns TextAnnotation
    
    return (response)

def get_confidence_levels(response):
    word_confidence = []
    symbol_confidence = []
    pages = response.full_text_annotation.pages
    for page in pages:
        for block in page.blocks:
            # print('block confidence:', block.confidence)
    
            for paragraph in block.paragraphs:
                # print('paragraph confidence:', paragraph.confidence)
    
                for word in paragraph.words:
                    # word_text = ''.join([symbol.text for symbol in word.symbols])
                    word_confidence.append(word.confidence)
                    # print('Word text: {0} (confidence: {1}'.format(word_text, word.confidence))
    
                    # for symbol in word.symbols:
                        # symbol_confidence.append(symbol.confidence)
                        # print('\tSymbol: {0} (confidence: {1}'.format(symbol.text, symbol.confidence))
    return word_confidence
    
def get_vertices(response):
    texts = response.text_annotations

    ignored_words = ['Employee', 'Information', 'Regular', 'Hours', 'Salary', 'Amount', 'Overtime', 'Vacation', 'Sick', 'Personal', 'Holiday', 'Bonus', 'Misc', 'Standby', 'Notes']
    
    TL= [383,3113] ####################Box coordinates
    BL= [503,3113]
    TR= [383,2585]
    BR= [503,2585]
    Y_shift=218
    X_shift=120
    w, h = 12, 12;
    Matrix = [['' for x in range(w)] for y in range(h)]
    
    
    
        
    #for-loop that is going to go through each of the 144 boxes 1 by 1 and will store them in a matrix
    for row in range(12):
        TL[0]=TL[0]+row*X_shift #resets the first index in the box coordinates that are initiated above
        BL[0]=BL[0]+row*X_shift
        TR[0]=TR[0]+row*X_shift
        BR[0]=BR[0]+row*X_shift
        for column in range(12):
            if column==1: #the column is making a jump that is different than the others due to it going from first box to second
                TL[1]-=540
                BL[1]-=540
                TR[1]-=218
                BR[1]-=218
            elif column==0: #if column is starting over, Y axis should be at the beginning again, thus subscript [1] gets changed
                TL[1]=3113
                BL[1]=3113
                TR[1]=2585
                BR[1]=2585
            else:          #after the first shift, the columns are the same size
                TL[1]=(TL[1]-540)-((column-1)*Y_shift) 
                BL[1]=(BL[1]-540)-((column-1)*Y_shift)
                TR[1]=(TR[1]-218)-((column-1)*Y_shift)
                BR[1]=(BR[1]-218)-((column-1)*Y_shift)
            
            for text in texts:
                avg_x=0
                avg_y=0
                vertices = []
                for vertex in text.bounding_poly.vertices:
                    vertices.append('({},{})'.format(vertex.x, vertex.y))
                    avg_x+=vertex.x
                    avg_y+=vertex.y
                
                avg_x=avg_x/4
                avg_y=avg_y/4
             
        
                if text.description in ignored_words or vertex.x < 330:
                    continue
            
                if avg_y > TR[1] and avg_y <= TL[1] and avg_x > TR[0] and avg_x < BL[0] : # works
                    if Matrix[row][column]!=0:
                        Matrix[row][column] = ''.join([Matrix[row][column], text.description])
                    else:
                        Matrix[row][column] = text.description   
                    
            TL[1]=3113
            BL[1]=3113
            TR[1]=2585
            BR[1]=2585
        TL[0]=383
        BL[0]=503
        TR[0]=383
        BR[0]=503
        
    TL[0]=TL[0]+X_shift
    BL[0]=BL[0]+X_shift
    TR[0]=TR[0]+X_shift
    BR[0]=BR[0]+X_shift
        

    print(Matrix)