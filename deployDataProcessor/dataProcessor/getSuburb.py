import json

with open('income_data.json') as data_file:
    data = json.load(data_file)

def inside(point, vs):
    x=point[0]
    y=point[1]
    inside = False
    i = 0
    j=len(vs)-1
    while i < len(vs):
        #print "i" + str(vs[i][0])
        #print vs
        xi = vs[i][0]
        yi = vs[i][1]

        xj = vs[j][0]
        yj = vs[j][1]

        intersect = ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

        if(intersect):
            if inside == False:
                inside = True
            else:
                inside = False
        j = i
        i=i+1
    return inside


for i in data['features']:
    #pass tweet's coordinates  here
    if(inside([-37.80279107, 144.95885151],i['geometry']['coordinates'][0][0])):
        print(i['properties']['feature_name'])
