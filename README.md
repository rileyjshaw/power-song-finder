# Power Song Finder

Power Song Finder searches your favorite Spotify tracks for a running “Power Song”. A Power Song matches your target cadence, and pumps you up during a tough point in the run.

> In carefully controlled experiments, adding a soundtrack helps rowers, sprinters, and swimmers shave seconds off their times. Runners can tolerate extreme heat and humidity longer, and triathletes can push themselves farther before reaching exhaustion. Moving to music even leads athletes to consume less oxygen as they exert themselves, as if the song itself supplies some of the energy they need. Findings like this led the authors of a scientific review in the Annals of Sports Medicine and Research to conclude that music is a legal performance-enhancing drug.
>
> — [Kelly McGonigal, _“The Joy of Movement”_](https://www.penguinrandomhouse.com/books/564895/the-joy-of-movement-by-kelly-mcgonigal/)

Cadence is defined in Beats Per Minute, or “BPM”. Your target BPM corresponds to how many strides you take per minute. Most recreational runners have a cadence between 150 BPM and 170 BPM, but your cadence is unique to your needs and goals as a runner.

## Inspiration

- [Kelly McGonigal, _“The Joy of Movement”_](https://www.penguinrandomhouse.com/books/564895/the-joy-of-movement-by-kelly-mcgonigal/) – _Chapter 4: “Let Yourself Be Moved”._

## Usage

Either use the [hosted version](https://rileyjshaw.com/power-song-finder), or follow these steps to clone your own copy:

```
git clone git@github.com:rileyjshaw/power-song-finder
cd power-song-finder
yarn install
# - Create a new Spotify app at: https://developer.spotify.com/dashboard/
# - Add “http://localhost:3000/” and your production route under “Redirect URIs”
# - Replace `SPOTIFY_CLIENT_ID` in `App.js` with your own client ID
# - Replace the production route of `SPOTIFY_REDIRECT_URI` in `App.js` with your production route
yarn start
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
