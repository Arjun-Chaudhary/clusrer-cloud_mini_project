import json
from conf.couchdb_login import couch_login
import configparser




def extractTweetsText():
	outFile=open("../Files/ProcessedTweets_bigData.json","w")
	#i=0
	with open("../Files/tweets_bigFile.json", 'r') as f:
	    for line in f:
	        tweet = json.loads(line)    #picks up a tweet
	        if tweet['text']:    #checks if it has coordinates
	            #i=i+1
	            tweetText=tweet['text']
	            #print(tweetText.encode('utf-8'))
	            outFile.write(json.dumps(tweetText))
	            outFile.write("\n")
	            #dict['coordinate'+str(i)]=cood      #storing the coordinate values in a dictionary

def getCoordFromView():
	config = configparser.RawConfigParser()
	config.read('conf/conf.cfg')
	db_tweets = couch_login(config,'tweets')
	db_handles = couch_login(config,'handles')


	# file=open("Files/tweets_bigFile.json","w")

	# for id in db_tweets.iterview('hasCoordinate/hasCoordinate',12000,None):
	    # print id.key
	    # print(id.key)
	    # file.write(json.dumps(id.key))
	    # file.write("\n")