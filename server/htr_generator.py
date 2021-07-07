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
            #print('block confidence:', block.confidence)
    
            for paragraph in block.paragraphs:
                #print('paragraph confidence:', paragraph.confidence)
    
                for word in paragraph.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
                    word_confidence.append(word.confidence)
                    #print('Word text: {0} (confidence: {1}'.format(word_text, word.confidence))
    
                    for symbol in word.symbols:
                        symbol_confidence.append(symbol.confidence)
                        #print('\tSymbol: {0} (confidence: {1}'.format(symbol.text, symbol.confidence))
    return word_confidence, symbol_confidence
    
def get_vertices(response):
    texts = response.text_annotations
    
    employee_information = []
    regular_hours = []
    salary_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    overtime_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    vacation_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    sick_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    personal_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    holiday_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    bonus_amount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    misc_amount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    standby_hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    notes = ["", "", "", "", "", "", "", "", "", "", "", ""]
    ignored_words = ['Employee', 'Information', 'Regular', 'Hours', 'Salary', 'Amount', 'Overtime', 'Vacation', 'Sick', 'Personal', 'Holiday', 'Bonus', 'Misc', 'Standby', 'Notes']
    ctr = 0
    
    print('Texts:')
    TL= [383,3113]
    BL= [530,3113]
    TR= [383,2585]
    BR= [530,2585]
    Y_shift=218
    X_shift=120
    w, h = 12, 12;
    Matrix = [[0 for x in range(w)] for y in range(h)]
    
    
    
    for text in texts:
        #print('\n"{}"'.format(text.description))
        vertices = []
        for vertex in text.bounding_poly.vertices:
            vertices.append('({},{})'.format(vertex.x, vertex.y))

        #print('bounds: {}'.format(','.join(vertices)))
        
        if text.description in ignored_words or vertex.x < 330:
            continue
        
        for row in range(12):
            TL[0]=TL[0]+row*X_shift
            BL[0]=BL[0]+row*X_shift
            TR[0]=TR[0]+row*X_shift
            BR[0]=BR[0]+row*X_shift
            for column in range(12):
                if column==1:
                    TL[1]-=540
                    BL[1]-=540
                    TR[1]-=322
                    BR[1]-=322
                elif column==0:
                    TL[1]=3113
                    BL[1]=3113
                    TR[1]=2585
                    BR[1]=2585
                else:
                    TL[1]=(TL[1]-540)-((column-1)*Y_shift)
                    BL[1]=(BL[1]-540)-((column-1)*Y_shift)
                    TR[1]=(TR[1]-322)-((column-1)*Y_shift)
                    BR[1]=(BR[1]-322)-((column-1)*Y_shift)
                
                print("TR BR BL TL: ")
                print(TR, BR, BL, TL)
                if vertex.y > TR[1] and vertex.y <= TL[1] and vertex.x > TR[0] and vertex.x < BL[0] : # works
                    if text.description == ',' or text.description == '.':
                        TL[1]=3113
                        BL[1]=3113
                        TR[1]=2585
                        BR[1]=2585
                        continue
                    employee_information.append(text.description)
                    Matrix[row][column]=text.description
                TL[1]=3113
                BL[1]=3113
                TR[1]=2585
                BR[1]=2585
            TL[0]=383
            BL[0]=530
            TR[0]=383
            BR[0]=530
            
        TL[0]=TL[0]+X_shift
        BL[0]=BL[0]+X_shift
        TR[0]=TR[0]+X_shift
        BR[0]=BR[0]+X_shift
        
        if vertex.y > 2585 and vertex.y <= 3100 and vertex.x < 1839: # works
            if text.description == ',' or text.description == '.':
                continue
            employee_information.append(text.description)

        if vertex.y > 2355 and vertex.y <= 2585 and vertex.x < 1839: # works
            regular_hours.append(text.description)

        if vertex.y > 2100 and vertex.y <= 2355 and vertex.x < 1839: # works
            salary_hours.append(text.description)
            
        if vertex.y > 2000 and vertex.y <= 2100 and vertex.x < 1839: # works
            overtime_hours.append(text.description)
                
        if vertex.y > 2580 and vertex.y <= 2000 and vertex.x < 1839: 
            vacation_hours.append(text.description)
                    
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            sick_hours.append(text.description)
                
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            personal_hours.append(text.description)
                
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            holiday_hours.append(text.description)
                
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            bonus_amount.append(text.description)
                
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            misc_amount.append(text.description)
                
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            standby_hours.append(text.description)
                    
        if vertex.y > 2580 and vertex.y <= 3090 and vertex.x < 1839:
            notes.append(text.description)

        
    print('Employees:', employee_information)
    print('Regular Hours:', regular_hours)
    print(Matrix)

    
"""
lines = response.text_annotations[0].description
    
    
    items = []
    lines = {}
    
    for text in response.text_annotations[1:]:
        top_x_axis = text.bounding_poly.vertices[0].x
        top_y_axis = text.bounding_poly.vertices[0].y
        bottom_y_axis = text.bounding_poly.vertices[3].y
    
        if top_y_axis not in lines:
            lines[top_y_axis] = [(top_y_axis, bottom_y_axis), []]
    
        for s_top_y_axis, s_item in lines.items():
            if top_y_axis < s_item[0][1]:
                lines[s_top_y_axis][1].append((top_x_axis, text.description))
                break
    
    for _, item in lines.items():
        if item[1]:
            words = sorted(item[1], key=lambda t: t[0])
            items.append((item[0], ' '.join([word for _, word in words]), words))
    
    print("ITEMS: ", items)
    print('\n')
    print("LINES: ", lines)
    # print(response)
"""