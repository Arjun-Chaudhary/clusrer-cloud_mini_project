import utils.data_processor_utils as utils
import utils.PreProcessTweet as preprocessor
import sys
import nltk
import json
from conf.couchdb_login import couch_login
import configparser

with open('Files/suburb_data.json') as data_file:
    suburb_data = json.load(data_file)

with open('Files/SA1Code_data.json') as data_file:
    SA1Code_data = json.load(data_file)
    
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

def adding_polarityScore_suburbCodeAndName():
    config = configparser.RawConfigParser()
    config.read('conf/conf.cfg')
    db_tweets = couch_login(config,'tweets')
    db_handles = couch_login(config,'handles')
    positive_words2,negative_words2 = preprocessor.posNegWordList()
    for id in db_tweets.iterview('hasCoordinate/hasCoordinate',9700000,None):
        print('%s' % id.key['id_str'])
        polarity_final_score=preprocessor.processSentimentAnnlysis(id.key['text'],positive_words2,negative_words2)
        id.key['polarity_final_score']=polarity_final_score
        print (id.key['geo']['coordinates'])
        a=id.key['geo']['coordinates'][0]
        b=id.key['geo']['coordinates'][1] 
        id.key['geo']['coordinates'][0]=b
        id.key['geo']['coordinates'][1]=a
        print (id.key['geo']['coordinates'])
        for i in suburb_data['features']:
            if(inside(id.key['geo']['coordinates'],i['geometry']['coordinates'][0][0])):
                id.key['suburb']=i['properties']['feature_name']
                print (id.key['suburb'])
                id.key['suburb_code']=i['properties']['feature_code']
                print (id.key['suburb_code'])
        id.key['geo']['coordinates'][0]=a
        id.key['geo']['coordinates'][1]=b
        doc=db_tweets.save(id.key)
    print("complete")

def adding_SA1Code_toTweet():
    config = configparser.RawConfigParser()
    config.read('conf/conf.cfg')
    db_tweets = couch_login(config,'tweets')
    db_handles = couch_login(config,'handles')
    positive_words2,negative_words2 = preprocessor.posNegWordList()
    for id in db_tweets.iterview('hasCoordinate/hasCoordinate',9700000,None):
        #print('%s' % id.key['id_str'])
        #polarity_final_score=preprocessor.processSentimentAnnlysis(id.key['text'],positive_words2,negative_words2)
        #id.key['polarity_final_score']=polarity_final_score
        #print (id.key['geo']['coordinates'])
        a=id.key['geo']['coordinates'][0]
        b=id.key['geo']['coordinates'][1] 
        id.key['geo']['coordinates'][0]=b
        id.key['geo']['coordinates'][1]=a
        print (id.key['geo']['coordinates'])
        print(len(suburb_data['features']))
        for i in suburb_data['features']:
            #pass tweet's coordinates  here
            #print (id.key['geo']['coordinates'])
            if(inside(id.key['geo']['coordinates'],i['geometry']['coordinates'][0][0])):
                id.key['SA1_code']=i['properties']['feature_name']
                print (id.key['SA1_code'])
                #id.key['suburb_code']=i['properties']['feature_code']
                #print (id.key['suburb_code'])
        #outFile.write(json.dumps(tweet))
        #outFile.write("\n")
        id.key['geo']['coordinates'][0]=a
        id.key['geo']['coordinates'][1]=b
        doc=db_tweets.save(id.key)
        #print ('%s\n' % doc[id])
    print("complete")

def makingDatabase_for_storingAURIN_blockIncomeData():
    config = configparser.RawConfigParser()
    config.read('conf/conf.cfg')
    db_tweets = couch_login(config,'block_income')
    j=0
    for i in SA1Code_data['features']:
        print (j)
        db_tweets.save(i)
        j=j+1

def makingDatabase_for_storingAURIN_familyIncomeData():
    config = configparser.RawConfigParser()
    config.read('conf/conf.cfg')
    db_tweets = couch_login(config,'family_data')
    j=0
    for i in suburb_data['features']:
        print (j)
        db_tweets.save(i)
        j=j+1
        
def main(argv):
    adding_polarityScore_suburbCodeAndName()
    adding_SA1Code_toTweet()
    makingDatabase_for_storingAURIN_familyIncomeData()
    makingDatabase_for_storingAURIN_blockIncomeData()
    
if __name__ == "__main__":
   main(sys.argv[1:])