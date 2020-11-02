#!/usr/bin/python

import json
import requests
import pprint

# reference : https://realpython.com/python-requests/
# usage : python generateStandaloneData.py > example.json

# requires RAW mongoDB data which is not available within this repo.

if __name__ == '__main__':

    # Works for one url at a time, refer the documentation for available endpoints.
    URL = "http://localhost:8081/datasets/data?category=STM&ref=Abf1"
    # URL = "http://localhost:8081/datasets/data?category=STM&ref=Hap5"

    # GET data    
    response = requests.get(URL, verify=False)
    data = response.json()['datasets']
    # pprint.pprint(data)

    count = 0
    datasetLimit = 20  # max 167
    final = {} 

    for item in data:
        if count < datasetLimit:
            if item['referencePoint'] not in final.keys():
                final[item['referencePoint']] = [{"proteinName":item['proteinName'],"plotData":item['plotData'],"totalTagScaling":item['totalTagScaling']}]
            else:
                final[item['referencePoint']].append({"proteinName":item['proteinName'],"plotData":item['plotData'],"totalTagScaling":item['totalTagScaling']})
            count = count + 1
        else:
            break

    print(json.dumps(final))


