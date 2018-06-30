import requests
import json

headers = {'content-type': 'application/json'}

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

def reindex(analysisSettings={}, mappingSettings={}, movieDict=extract(), index="imdb", type="movie"):
    index_path_url = "http://localhost:9200/{index}".format(index=index)
    settings = {
        "settings": {
             "number_of_shards": 1,
             "index": {
                 "analysis": analysisSettings,
             },
             "mappings": mappingSettings
             }}
    resp = requests.delete(index_path_url)
    print "Deleting Old Index: {resp}".format(resp=resp)
    resp = requests.put(index_path_url,data=json.dumps(settings), headers = headers)
    print "Creating Settings: {resp}".format(resp=resp,settings=settings)
    bulkMovies = ""
    print "\nBuilding Bulk Index Command.  index: {index}, type: {type}".format(type=type,index=index)
    for id, movie in movieDict.iteritems():
        addCmd = {"index": {"_index": index,
                            "_type": type,
                            "_id": movie["id"]}}
        bulkMovies += json.dumps(addCmd) + "\n" + json.dumps(movie) + "\n"
    print "indexing..."
    resp = requests.post("http://localhost:9200/_bulk", data = bulkMovies, headers = headers)
    print "Bulk Index Response: {resp}".format(resp=resp)
    return resp
