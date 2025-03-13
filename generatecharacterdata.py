
import requests
import os, shutil
import json
from dotenv import load_dotenv

load_dotenv()

TimePeriodArray = ["202306","202307","202308","202309","202310","202311","202312","202401","202402","202403","202404","202405","202406","202407","202408","202409","202410","202411","202412","202501","202502"]
CharacterToolNameArray = ["ryu","luke","kimberly","chunli","manon","zangief","jp","dhalsim","cammy","ken","deejay","lily","aki","rashid","blanka","juri","marisa","guile","ed","honda","jamie","gouki","vega","terry","mai"]
DataPath = "./CharacterData/"
ControlType = 0
League = 8
LeagueStr = str(League)

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
token = os.getenv('URL_TOKEN')
CharacterUsageRequestURL = "https://www.streetfighter.com/6/buckler/api/en/stats/usagerate/{timePeriod}"
CharacterUsageHeaders = {
          "Cookie": "buckler_id={BucklerId}; buckler_praise_date=1740178799166;",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        }

CharacterWinrateRequestURL = "https://www.streetfighter.com/6/buckler/api/en/stats/dia/{timePeriod}"
CharacterWinrateHeaders = {
          "Cookie": "buckler_id={BucklerId}; buckler_praise_date=1740178799166;",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        }

# Collected data from our request
AllCharacterUsageRateByTimePeriod = {}

# Our data sorted in the format
SortedCharacterUsageData = {}
# characterName1 : {
#     Time Period : Usage Rate
#     Time Period : Usage Rate
#     Time Period : Usage Rate
#      }
# characterName2 : {
#     Time Period : Usage Rate
#     Time Period : Usage Rate
#     Time Period : Usage Rate
#      }

AllCharacterWinrateByTimePeriod = {}
SortedCharacterWinrateData = {}

for TimePeriod in TimePeriodArray:

  # Usage rate
  usageUrl = CharacterUsageRequestURL.format(timePeriod = TimePeriod)

  # sending get request and saving the response as response object
  usageRequest = requests.get(url = usageUrl, headers = CharacterUsageHeaders)

  usageData = usageRequest.json()

  timePeriodData = usageData["usagerateData"]

  allControlTypeData = timePeriodData[ControlType]

  masterRateUsageData = allControlTypeData["val"][League]

  # extracting data in json format
  AllCharacterUsageRateByTimePeriod.update({
     TimePeriod : masterRateUsageData["val"]
  })

  # Win rate
  winrateUrl = CharacterWinrateRequestURL.format(timePeriod = TimePeriod)

  # sending get request and saving the response as response object
  winrateRequest = requests.get(url = winrateUrl, headers = CharacterWinrateHeaders)

  winRateData = winrateRequest.json()

  combinedWinRateData = winRateData["diaData"]["c"]

  sortedWinRate = combinedWinRateData["d_sort"]

  masterRateWinRateData = sortedWinRate[LeagueStr]

  # We may want to use all the values later but for now we just want the total
  winRateData = masterRateWinRateData["records"]

  for dataEntry in winRateData:
     dataEntry.pop("values")

  AllCharacterWinrateByTimePeriod.update({
     TimePeriod : winRateData
  })
  
# CHARACTER USAGE

# Loop through and create a json object for each character assigning time period and usage.
for character in CharacterToolNameArray:

  characterUsageData = {}
  characterWinRateData = {}
    
  fileHasCharacter = False
  
  for timerPeriodKey, characterObjs in AllCharacterUsageRateByTimePeriod.items():

    for characterObj in characterObjs:
        
      if characterObj["character_tool_name"] == character:
          fileHasCharacter = True
          characterUsageData.update({
                            timerPeriodKey: characterObj["play_rate"]
                            })
    # if the file we're on doesn't have this character's name then they haven't been released this month
    if fileHasCharacter is False:
      characterUsageData.update({
                            timerPeriodKey : 0
                            })

  # update the our all character json object
  SortedCharacterUsageData.update({
    character: characterUsageData
  })


  # CHARACTER WINRATE
  fileHasCharacter = False

  for timerPeriodKey, characterObjs in AllCharacterWinrateByTimePeriod.items():
     
     for characterObj in characterObjs:
        
        if characterObj["tool_name"] == character:
          fileHasCharacter = True
          characterWinRate = 50.0

          # Format we recieve is 5.0 == 50% win rate we want it from 0 to 1
          try:
            characterWinRate = float(characterObj["total"]) * 10
          except ValueError:
            characterWinRate = 50.0

          characterWinRateData.update({
            timerPeriodKey: characterWinRate
          })
    # if the file we're on doesn't have this character's name then they haven't been released this month
     if fileHasCharacter is False:
      characterWinRateData.update({
                            timerPeriodKey : 50.0
                            })   
  # update the our all character json object
  SortedCharacterWinrateData.update({
    character: characterWinRateData
  })      

# Create the all.json file
with open(DataPath + "characterusage.json","x") as f:
    json.dump(SortedCharacterUsageData,f)
   
# Create the all.json file
with open(DataPath + "characterwinrate.json","x") as f:
    json.dump(SortedCharacterWinrateData,f)
