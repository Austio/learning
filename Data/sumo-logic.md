## SumoLogic

[Search Mastery Slides](https://www.slideshare.net/Sumo_Logic/sumo-logic-cert-jam-search-mastery-226926385)
[Search Master Lab](https://help.sumologic.com/01Start-Here/Quick-Start-Tutorials/Hands-on_Labs01%3A_Using_Sumo_Logic)
[Cheat Sheet for Operators](https://help.sumologic.com/05Search/Search-Cheat-Sheets/Log-Operators-Cheat-Sheet)  
[Best Practice for _sourceCategory](https://help.sumologic.com/03Send-Data/01-Design-Your-Deployment/Best-Practices%3A-Good-Source-Category%2C-Bad-Source-Category)
 - in Sumo `home/Manage Data/Collection`

|Tag|Description|
|---|---|
|_collector|Name of the collector(defaults to hostname)|
|_sourceHost|Hostname of the server(defaults to hostname)|
|_sourceName|Name and Path of the log file|
|_source|Name of the source this data came through|
|_sourceCategory|Can be freely configured.  Main Metadata tag|

[Available Metadata on search](https://help.sumologic.com/05Search/Get-Started-with-Search/Search-Basics/Built-in-Metadata)
 - like `_count`

### Aggregations

```
// ?<ip_address> is the meta data separator that creates
_sourceCategory=Labs/Apache/*
 | parse regex "(?<ip_address>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
 | count by ip_address
 | where _count > 2500 
``` 

### Parsing

`json auto` -> Will parse json for fields that we can automatically filter by
```
_sourceCategory=Labs/AWS/CloudTrail
| json auto
| count by (key_from_json_objects)
```

for JSON, you can click "expand json", then right click a field an "Parse Selected Field" to get an auto filter for the selection

`parse` -> sets a way for us to look at metadata
``` 
_sourceCategory=Labs/Apache/Error
| parse "[client *]" as client_ip
```

`nodrop` -> Prevents a parse from acting as a filter
`parse` -> sets a way for us to look at metadata
``` 
_sourceCategory=Labs/Apache/Error
| parse "[client *]" as client_ip nodrop
```

`isBlank|isEmpty|isBlank` -> filters on where for where it is blank
[Sumo Help Article](https://help.sumologic.com/05Search/Search-Query-Language/Search-Operators/isNull%2C-isEmpty%2C-isBlank)
```
_sourceCategory=Labs/Apache/Error
| parse "[client *]" as client_ip nodrop
| parse "mod_log_sql: *" as message
| where isBlank(client_ip)
```

```
Find top 5 users and their email

_sourceCategory=Labs/Github and "committer"
| parse "\"email\":\"*\"" as email
| parse field=email "*@*" as users, domain
| count by users
| top 5 users by _count
```

`multi` -> Handle cases where there are multiple instances of a match (IP below) in a log
  - will show up two times in the output of logs
```
_sourceCategory=labs/snort
| parse regex "(?<ip_address>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})" multi
```

##### Field Extraction Rules

Useful for parsing before data is ingested

### Conditional Operators

```
_sourceCategory=Labs/Apache/Access
| parse "HTTP/1.1\" * " as status_code
| if(status_code=200, 1, 0) as successes
| if(status_code=404, 1, 0) as client_errors  
| sum(successes) as success_cnt, sum(client_errors) as client_errors_cnt

_sourceCategory=Labs/Apache/Access
| parse  "HTTP/1.1\" * " as status_code // take the statuses
| if(status_code matches "4*", 1, 0) as client_err // pull 400s
| if(status_code matches "5*", 1, 0) as server_err   // pull 500s
| sum(server_err) as server_errors_cnt, sum(client_err) as client_errors_cnt // sum and put on the same line
```

### Subqueries
``` 
// Format is 
<Parent Query>
[subquery: <Child Query>
| compose IP keywords
]
```

```
_sourceCategory=labs/apache/error and "File does not exist: /usr/htdocs"
| parse "[*] [*] [client *]" as Time,Error,IP // Parses the IP address into a field
| count by IP // Aggregates the results by IP address
| topk(1,_count) // Displays the IP with the most “File does not exist: /usr/htdocs” errors
```

``` 
_sourceCategory=Labs/Apache/Access
[subquery:_sourceCategory=labs/apache/error and "File does not exist: /usr/htdocs"
| parse "[*] [*] [client *]" as Time,Error,IP
| count by IP 
| topk(1,_count) | compose IP keywords
]
```


### Plot IPs on a map
```
_sourceCategory=Labs/Apache/Access
| parse "* - -" as client_ip
| lookup latitude, longitude from geo://location on ip=client_ip
| count by latitude, longitude
| sort _count
```