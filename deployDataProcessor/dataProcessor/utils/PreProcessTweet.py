from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.corpus import words
import re
import json
from collections import Counter
import operator
import string
import gensim
import nltk
import re
from nltk.data import find
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()
stop = set(stopwords.words('english'))
punctuation = set(string.punctuation)
nltk_words = set([x.lower() for x in words.words()])
json_dict={}

emoticons_str = r"""
    (?:
        [:=;] # Eyes
        [oO\-]? # Nose (optional)
        [D\)\]\(\]/\\OpP] # Mouth
    )"""

regex_str = [
    emoticons_str,
    r'<[^>]+>', # HTML tags
    r'(?:@[\w_]+)', # @-mentions
    r"(?:\#+[\w_]+[\w\'_\-]*[\w_]+)", # hash-tags
    r'http[s]?://(?:[a-z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+', # URLs

    r'(?:(?:\d+,?)+(?:\.?\d+)?)', # numbers
    r"(?:[a-z][a-z'\-_]+[a-z])", # words with - and '
    r'(?:[\w_]+)', # other words
    r'(?:\S)' # anything else
]

tokens_re = re.compile(r'('+'|'.join(regex_str)+')', re.VERBOSE | re.IGNORECASE)
emoticon_re = re.compile(r'^'+emoticons_str+'$', re.VERBOSE | re.IGNORECASE)

def tokenize(s):
    return tokens_re.findall(s)

def wordLemmatizer(word):
    lemma = lemmatizer.lemmatize(word,'v')
    if lemma == word:
        lemma = lemmatizer.lemmatize(word,'n')
    return lemma    
def max_match(s):
    if not s:
        return []
    for i in range(len(s), 0, -1):
        firstword = wordLemmatizer(s[:i])
        remainer = s[i:]
        if firstword in nltk_words:
            return [firstword] + max_match(remainer)
    firstword = s[0]
    remainer = s[1:]
    return [firstword] + max_match(remainer)
 

def preprocess(s, lowercase=True):
    hash_tags = [str(x) for x in re.findall(r"#\w+", s)]
    cleaned_tags = []
    for hash_tag in hash_tags:
        hash_tag = hash_tag.replace("#","")
        words = re.split(r'([A-Z][a-z]*)', hash_tag)
        if len(words) > 1 :
            cleaned_tags += [x.lower() for x in words if x] # remove empty strings
        elif len(words) == 1:
            cleaned_tags += max_match(words[0])
    hashString=' '.join(cleaned_tags)
    #remove url hashtag and @
    s = re.sub(r'(https?:\/\/[a-zA-Z0-9.\/\?=#]*|#\w+|@\w+)', '', s, flags=re.MULTILINE)
    s=' '.join((s,hashString))
    s=s.lower()
    #s = ''.join(ch for ch in s if ch not in punctuation)
    tokens = tokenize(s)
    tokens = [wordLemmatizer(x) for x in tokens]
    tokens = [ word for word in tokens if word not in stop ]
    return tokens

    
# tweet = "RT @marcobonzanini: just an example! :D http://example.com #NLP"
# print(preprocess(tweet))
# ['RT', '@marcobonzanini', ':', 'just', 'an', 'example', '!', ':D', 'http://example.com', '#NLP']

def polarity_classification(tweetTokens, positive_words_set, negative_words_set):
    '''
    rtype: [int]
    '''
    sentimentPredictions = []
    positiveCount = 0
    negativeCount = 0
   
    for word in tweetTokens:
        if word in positive_words_set:
            positiveCount += 1
        elif word in negative_words_set:
            negativeCount += 1

    if positiveCount > negativeCount:
        polarity_score=1
    elif positiveCount <negativeCount:
        polarity_score=-1
    else:
        polarity_score=0
    return polarity_score        

def download_sample_nltk_corpus():
    nltk.download('word2vec_sample')


#
#Tokenizing the processed tweets (tweet text)
#
def posNegWordList():
    positive_seeds = ["good","nice","excellent","positive","fortunate","correct","superior","great"]
    negative_seeds = ["bad","nasty","poor","negative","unfortunate","wrong","inferior","awful"]


    word2vec_sample = str(find('models/word2vec_sample/pruned.word2vec.txt'))
    model = gensim.models.Word2Vec.load_word2vec_format(word2vec_sample, binary=False)
    positive_words2 = []
    negative_words2 = []

    for word in model.vocab:
        positive_score = 0.0
        negative_score = 0.0
        for seed in positive_seeds:
            positive_score += model.similarity(word, seed)
        for seed in negative_seeds:
            negative_score += model.similarity(word, seed)
        overall_score = (positive_score  - negative_score) / (len(negative_seeds) + len(positive_seeds))
        if overall_score < -0.03:
            negative_words2.append(word)
        if overall_score > 0.03:
            positive_words2.append(word)
    return positive_words2, negative_words2
 
# if tweet contains emoticons no tweet analysis otherwise apply sentiment analysis.
def processSentimentAnnlysis(tweet_text,positive_words,negative_words):
    # due to lower case :D convert to :d
    positive_words2=positive_words
    negative_words2=negative_words
    patternSmile = re.compile("^(\|?>?[:*;Xx8=]-?o?\^?[DdPpb3)}\]>]\)?)$")
    patternSad = re.compile("^(([:><].?-?[@><cC(\[{\|]\|?|[Dd][:8;=X]<?|v.v))$")
    #tweet = json.loads(line)
    tweet=tweet_text
    #tokens = preprocess(tweet['text'])
    tokens = preprocess(tweet)
    smiley=False
    for x in tokens:
        try:
            if patternSmile.match(x):
                polarity_final_score=1  
                smiley=True
                break
            elif patternSad.match(x):
                polarity_final_score=-1
                smiley=True
                break   
        except:
            print ('')
    if not smiley :
        tokens = [''.join(char for char in stringToken if char not in punctuation) for stringToken in tokens]
        polarity_score=polarity_classification(tokens, set(positive_words2), set(negative_words2))
        polarity_final_score=polarity_score
        #do_something_else(tokens)
    return polarity_final_score
#
#Calculating term frequencies
#
#Removing all punctuations
#punctuation = list(string.punctuation)
#adding to stop word list
#stop = stopwords.words('english') + punctuation + ['rt', 'via','\u2026','the','in','\ud83d']
#stop = ['Traffic','traffic']

#with open('ProcessedTweets_bigData.json', 'r') as f:
 #   count=Counter()
  #  for line in f:
   #     tweetText=json.loads(line)
        # for word in preprocess(tweetText):
        #     if word in stop:
        #         print tweetText
    #    terms = [term for term in preprocess(tweetText) if term in stop]
     #   count.update(terms)
    #print (count.most_common(150))
