
import requests
import os, shutil
import json
from dotenv import load_dotenv

load_dotenv()

DataPath = "./CharacterData/"
TimePeriodPath = DataPath + "TimePeriods/"
CharacterPath = DataPath + "Characters/"
AllCharacterPath = DataPath + "Characters/all.json"
ControlType = 0

# Delete anything in the folder already
for filename in os.listdir(DataPath):
    file_path = os.path.join(DataPath, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (file_path, e))

if not os.path.exists(TimePeriodPath):
    os.makedirs(TimePeriodPath)

if not os.path.exists(CharacterPath):
    os.makedirs(CharacterPath)

BucklerId = os.getenv('BUCKLER_ID')
CharacterDataUrl = "https://www.streetfighter.com/6/buckler/api/en/stats/usagerate/{timePeriod}"
Headers = {
          "Cookie": "buckler_id={BucklerId}; buckler_praise_date=1740178799166;",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        }

TimePeriodArray = ["202306","202307","202308","202309","202310","202311","202312","202401","202402","202403","202404","202405","202406","202407","202408","202409","202410","202411","202412","202501"]
CharacterToolNameArray = ["ryu","luke","kimberly","chunli","manon","zangief","jp","dhalsim","cammy","ken","deejay","lily","aki","rashid","blanka","juri","marisa","guile","ed","honda","jamie","gouki","vega","terry"]
AllCharacterData = {}

for TimePeriod in TimePeriodArray:

  characterDataUrl = CharacterDataUrl.format(timePeriod = TimePeriod)

  # sending get request and saving the response as response object
  Request = requests.get(url = characterDataUrl, headers = Headers)

  # extracting data in json format
  data = Request.json()

  timePeriodPath = TimePeriodPath + TimePeriod + ".json"

  with open(timePeriodPath,"x") as f:
      json.dump(data,f)

# Loop through and create a json object for each character assigning time period and usage.
for character in CharacterToolNameArray:
   
  characterPath = CharacterPath + character + ".json"
  characterData = {}

  for file in os.listdir(TimePeriodPath):

    filePath = TimePeriodPath + file

    with open(filePath) as f:
      
      fileHasCharacter = False
      timePeriodJson = json.load(f)
      
      timePeriodData = timePeriodJson["usagerateData"]

      allControlTypeData = timePeriodData[ControlType]

      masterRateData = allControlTypeData["val"][8]

      for dataEntry in masterRateData["val"]:
         
        if dataEntry["character_tool_name"] == character:
           fileHasCharacter = True
           characterData.update({
                              file.strip('.json'): dataEntry["play_rate"]
                              })
      if fileHasCharacter is False:
        characterData.update({
                              file.strip('.json'): 0
                              })


  AllCharacterData.update({
    character: characterData
  })

  with open(characterPath,"x") as f:
      json.dump(characterData,f)

with open(AllCharacterPath,"x") as f:
    json.dump(AllCharacterData,f)
   
