An elasticsearch index has two fiels
 - mappings:   
 - settings:



### Create Business Things

PUT /business/employee/330
{
  "name": "Richard Bell",
  "title": "Senior Accountant",
  "salar_usd": 115000.00,
  "hiredate": "Jan 19, 2013"
}

PUT /business/employee/331
{
  "name": "Steve Lawman",
  "title": "Lawyer",
  "salar_usd": 140000.00,
  "hiredate": "Oct 10, 2010"
}

PUT /business/building/110
{
  "address":"123place", 
  "floors":10, 
  "offices":21, 
  "loc":
    {
      "lat":40.8, 
      "lon": -74.2
    }
}

PUT /business/contract/998
{
  "name": "Prop",
  "date_signed": "July 26, 2010",
  "employees_involved": [331, 330, 398]
}

```
{
  "business": {
    "aliases": {},
    "mappings": {
      "building": {
        "properties": {
          "address": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "floors": {
            "type": "long"
          },
          "loc": {
            "properties": {
              "lat": {
                "type": "float"
              },
              "lon": {
                "type": "float"
              }
            }
          },
          "offices": {
            "type": "long"
          }
        }
      }
    },
    "settings": {
      "index": {
        "creation_date": "1519355037896",
        "number_of_shards": "5",
        "number_of_replicas": "1",
        "uuid": "KG06tJpSQBil8TDH5-YV9A",
        "version": {
          "created": "5030399"
        },
        "provided_name": "business"
      }
    }
  }
}
``` 
 