

from Bio import Entrez
from Bio import Medline
import json

jsonEntry = {#format for json object containing article ID, title, authors, source with journal and volume, and abstract
    "articleID": "placeholder ID",
    'title': "placeholder title",
    'authors': "placeholder authors",
    'source': "placeholder source",
    'journal': "placeholder journal",
    'volume': "placeholder volume",
    'abstract': "placeholder abstract"
}

def resetJSONEntry():#resetting json entry to placeholder values
    jsonEntry['articleID'] = "placeholder ID"
    jsonEntry['title'] = "placeholder title"
    jsonEntry['authors'] = "placeholder authors"
    jsonEntry['source'] = "placeholder source"
    jsonEntry['journal'] = "placeholder journal"
    jsonEntry['volume'] = "placeholder volume"
    jsonEntry['abstract'] = "placeholder abstract"

########## front end values
searchTerm = "cancer care AND human"#search term used for program, integrate with front end by having front end search query set this variable
searchAmount = 5
outputFile = "List_Of_PubMed_Articles.json"
##########

with open(outputFile, "w") as clearFile:#making json file empty
    clearFile.write("")

print("Searching for " + str(searchAmount) + " PubMed articles with keywords <" + searchTerm + ">: ")
Entrez.email = "test@example.com"
streamE = Entrez.esearch(db = "pubmed", term = searchTerm, retmax = searchAmount)#searching for pubmed articles containing keywords
record = Entrez.read(streamE)
streamE.close()
idlist = record["IdList"]#getting article ids for further search

streamM = Entrez.efetch(db = "pubmed", id = idlist, rettype = "medline", retmode = "text")#get article details from article IDs
records = Medline.parse(streamM)

for ID, record in zip(idlist, records):
    articleID = ID
    title = record.get("TI", "?")
    authors = record.get("AU", "?")
    source = record.get("SO", "?")
    journal = record.get("JT", "?")
    volume = record.get("VI", "?")
    abstract = record.get("AB", "?")#getting article details

    jsonEntry['articleID'] = articleID
    jsonEntry['title'] = title
    jsonEntry['authors'] = authors
    jsonEntry['source'] = source
    jsonEntry['journal'] = journal
    jsonEntry['volume'] = volume
    jsonEntry['abstract'] = abstract
    outputJSON = json.dumps(jsonEntry, indent = 4)#creating json object containing article title, authors, source with journal and volume, and abstract

    with open(outputFile, "a") as file:
        file.write(outputJSON)#writing json object of article details into json file
        file.write("\n")
    resetJSONEntry()
##########
#front end integrated by reading the output json file from this program; file is List_Of_PubMed_Articles.json
##########

streamM.close()

print("Successfully found " + str(searchAmount) + " PubMed articles; written article IDs, titles, authors, sources, and abstracts to " + outputFile)
