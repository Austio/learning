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

def plainReindex(movieDict=extract(), index="imdb", type="movie"):
  index_path_url = "http://localhost:9200/{index}".format(index=index)
  bulkMovies = ""
  for id, movie in movieDict.iteritems():
      addCmd = {"index": {"_index": index,
                          "_type": type,
                          "_id": movie["id"]}}
      bulkMovies += json.dumps(addCmd) + "\n" + json.dumps(movie) + "\n"
  print "indexing..."
  resp = requests.post("http://localhost:9200/_bulk", data=bulkMovies, headers=headers)


userSearch = 'basketball with cartoon aliens'
query = {
    "query": {
        "multi_match": {
            "query": userSearch,
            "fields": ["title^10","overview"]
        }
    }
}

mostSearch = {
  "query": {
    "multi_match": {
      "query": "Patrick Stewart",
      "fields": ["title", "overview", "cast.name", "directors.name"],
      "type": "best_fields"
    }
  }
}


def search(query=query, index="imdb", type="movie", explain="false"):
    url = "http://localhost:9200/{index}/{type}/_search?explain={explain}".format(index=index,type=type, explain=explain)
    httpResp = requests.get(url,data=json.dumps(query),headers=headers)
    hits = json.loads(httpResp.text)['hits']
    print "Num\tRelevance Score\t\tMovie Title"
    for idx, hit in enumerate(hits['hits']):
        print "%s\t%s\t\t%s" % (idx+1, hit["_score"], hit["_source"]["title"])
        if explain == "true":
            e = simplerExplain(hit["_explanation"])
            print "{exp}".format(exp=e)


def getLuceneSyntax(query=query, index="imdb", type="movie"):
    url = 'http://localhost:9200/{index}/{type}/_validate/query?explain=true'.format(index=index,type=type)
    httpResp = requests.get(url, data=json.dumps(query), headers=headers)
    print json.loads(httpResp.text)

def analyze(data, analyzer="standard"):
    d = {
        "analyzer": analyzer,
        "text": data
    }
    url = 'http://localhost:9200/_analyze?format=yaml'
    print requests.get(url, data=json.dumps(d), headers=headers).text
