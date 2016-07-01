import json


tweet_text={}
i=0

outFile=open("../Files/polarFile.json","w")
with open('../Files/tweets_bigFile_with_polarity.json', 'r') as f:
       #positive_words2,negative_words2 = preprocessor.posNegWordList()
       for line in f:
           tweet = json.loads(line)
           if tweet['text']:
               #i=i+1
               tweet_text['text']=tweet['text']
               tweet_text['polarity']=tweet['polarity_final_score']
               cood=tweet['coordinates']
               tweet_text['coordinates']=cood['coordinates']
               outFile.write(json.dumps(tweet_text))
               outFile.write("\n")
