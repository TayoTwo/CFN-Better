
import requests
import os, shutil
import json
from dotenv import load_dotenv

load_dotenv()

TimePeriodArray = ["202306","202307","202308","202309","202310","202311","202312","202401","202402","202403","202404","202405","202406","202407","202408","202409","202410","202411","202412","202501"]
CharacterToolNameArray = ["ryu","luke","kimberly","chunli","manon","zangief","jp","dhalsim","cammy","ken","deejay","lily","aki","rashid","blanka","juri","marisa","guile","ed","honda","jamie","gouki","vega","terry"]
DataPath = "./CharacterData/"
ControlType = 0
League = 8

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

BucklerId = os.getenv('BUCKLER_ID')
CharacterDataUrl = "https://www.streetfighter.com/6/buckler/api/en/stats/usagerate/{timePeriod}"
Headers = {
          "Cookie": "buckler_id={BucklerId}; buckler_praise_date=1740178799166;",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        }

AllTimePeriodData = {}
AllCharacterData = {}

for TimePeriod in TimePeriodArray:

  characterDataUrl = CharacterDataUrl.format(timePeriod = TimePeriod)

  # sending get request and saving the response as response object
  Request = requests.get(url = characterDataUrl, headers = Headers)

  data = Request.json()

  timePeriodData = data["usagerateData"]

  allControlTypeData = timePeriodData[ControlType]

  masterRateData = allControlTypeData["val"][League]

  # extracting data in json format
  AllTimePeriodData.update({
     TimePeriod : masterRateData["val"]
  })

# Loop through and create a json object for each character assigning time period and usage.
for character in CharacterToolNameArray:

  characterData = {}
    
  fileHasCharacter = False
  
  for timerPeriodKey, timePeriodObj in AllTimePeriodData.items():

    for characterObj in timePeriodObj:
        
      if characterObj["character_tool_name"] == character:
          fileHasCharacter = True
          characterData.update({
                            timerPeriodKey + "01": characterObj["play_rate"]
                            })
    # if the file we're on doesn't have this character's name then they haven't been released this month
    if fileHasCharacter is False:
      characterData.update({
                            timerPeriodKey + "01" : 0
                            })

  # update the our all character json object
  AllCharacterData.update({
    character: characterData
  })

# Create the all.json file
with open(DataPath + "characterdata.json","x") as f:
    json.dump(AllCharacterData,f)
   
