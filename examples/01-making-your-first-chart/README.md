# Welcome

This demo includes sample weather data for Seattle, WA.

If you would like to generate your own weather data, you can create a free account to use the [Dark Sky API](https://darksky.net/dev).

Once your account is created, modify `scripts/get_weather_data.py` with your API key as well as the latitude and longitude of the location you wish to load weather data for. You can easily obtain GPS coordinates for your current location or a known address by visiting the [GPS Coordinates Finder](https://gps-coordinates.org)

If you have Python 3 installed on your system, all you will need to do is run:

```py
$ python scripts/get_weather_data.py
# Grabbing data for 2018-05-21
# Grabbing data for 2018-05-22
# ...
# Grabbing data for 2019-05-19
# Grabbing data for 2019-05-20

# Once that is complete, you will have a JSON file 📈
```