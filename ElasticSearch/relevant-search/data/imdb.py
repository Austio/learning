import requests
import json


def flatten(l):
    [item for sublist in l for item in sublist]


def simplerExplain(explainJson, depth=0):
    result = " " * (depth * 2) + "%s, %s\n" % (explainJson['value'], explainJson['description'])
    #print json.dumps(explainJson, indent=True)
    if 'details' in explainJson:
        for detail in explainJson['details']:
            result += simplerExplain(detail, depth=depth+1)
    return result


# Assumes ran from relevant-search directory
def extract():
    f = open('./data/imdb.json')
    if f:
        return json.loads(f.read())
    return {}


def reindex(analysisSettings={}, mappingSettings={}, movieDict={}):
    settings = {
        "settings": {
             "number_of_shards": 1,
             "index": {
                 "analysis": analysisSettings,
             },
             "mappings": mappingSettings
             }}
    requests.delete("http://localhost:9200/imdb")
    requests.put("http://localhost:9200/imdb",data=json.dumps(settings))
    bulkMovies = ""
    print "building..."
    for id, movie in movieDict.iteritems():
        addCmd = {"index": {"_index": "imdb",
                            "_type": "movie",
                            "_id": movie["id"]}}
        bulkMovies += json.dumps(addCmd) + "\n" + json.dumps(movie) + "\n"
    print "indexing..."
    resp = requests.post("http://localhost:9200/_bulk", data = bulkMovies)
