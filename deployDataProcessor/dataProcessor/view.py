import json
import json
from conf.couchdb_login import couch_login
import configparser
from pprint import pprint

config = configparser.RawConfigParser()
config.read('conf/conf.cfg')
db_tweets = couch_login(config,'block_income')

with open('Files/SA1Code_data.json') as data_file:    
    data = json.load(data_file)
 
j=0
for i in data['features']:
    print (j)
    db_tweets.save(i)
    j=j+1

