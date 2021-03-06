import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useKeyPresses, useRepeatable } from './hooks';
import './App.css';

const SPOTIFY_API_ROUTE = process.env.NODE_ENV === 'development' ? '' : 'https://api.spotify.com';
const SPOTIFY_REDIRECT_URI =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://rileyjshaw.com/power-song-finder/';
const SPOTIFY_CLIENT_ID = 'a6babd5bf4654f2998b1afa67c1866cf';
const SPOTIFY_SCOPES = ['user-top-read', 'user-read-email'];
const SPOTIFY_SHOW_DIALOG = false;
// TODO: Make this random and check it. See https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
const SPOTIFY_STATE = 'POWER_SONG';
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${encodeURIComponent(
	SPOTIFY_SCOPES.join(' ')
)}&state=${SPOTIFY_STATE}&show_dialog=${SPOTIFY_SHOW_DIALOG}`;

const TEMPO_LOWER_BOUND = 60;
const TEMPO_UPPER_BOUND = 240;
const boundTempo = tempo => Math.max(TEMPO_LOWER_BOUND, Math.min(TEMPO_UPPER_BOUND, tempo));
const msToTimestamp = ms => `${Math.floor(ms / 60000)}:${`${Math.floor(ms / 1000) % 60}`.padStart(2, 0)}`;

const PlayIcon = () => (
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
		<polygon points="20,10 20,90 80,50" />
	</svg>
);
const PauseIcon = () => (
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
		<rect x="20" y="25" width="20" height="50" />
		<rect x="52" y="25" width="20" height="50" />
	</svg>
);

const steps = [
	{
		title: 'Find your Power Song',
		Main: IntroDescription,
		Footer: () => (
			<p>
				To get started, <a href={SPOTIFY_AUTH_URL}>log in with Spotify</a>.
			</p>
		),
	},
	{
		title: 'Set your target cadence',
		Main: SelectTempo,
		Footer: ({ setStep }) => (
			<p>
				Once you’ve chosen a cadence,{' '}
				<button className="Button-link" onClick={() => setStep(s => s + 1)}>
					pick your Power Song
				</button>
				.
			</p>
		),
	},
	{
		title: 'Pick your Power Song',
		Main: SelectSong,
		Footer: ({ setStep }) => (
			<p>
				Or,{' '}
				<button className="Button-link" onClick={() => setStep(s => Math.max(0, s - 1))}>
					try another cadence
				</button>
				.
			</p>
		),
	},
];

function IntroDescription() {
	return (
		<div className="Intro">
			<p className="unitalic">
				This application searches your favorite Spotify tracks for a running “Power Song”. A Power Song matches your
				target cadence, and pumps you up during a tough point in the run.
			</p>
			<blockquote>
				<p>
					In carefully controlled experiments, adding a soundtrack helps rowers, sprinters, and swimmers shave seconds
					off their times. Runners can tolerate extreme heat and humidity longer, and triathletes can push themselves
					farther before reaching exhaustion. Moving to music even leads athletes to consume less oxygen as they exert
					themselves, as if the song itself supplies some of the energy they need. Findings like this led the authors of
					a scientific review in the Annals of Sports Medicine and Research to conclude that music is a legal
					performance-enhancing drug.
				</p>
				<footer>
					—{' '}
					<cite>
						<a
							href="https://www.penguinrandomhouse.com/books/564895/the-joy-of-movement-by-kelly-mcgonigal/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Kelly McGonigal, <em className="unitalic">“The Joy of Movement”</em>
						</a>
					</cite>
				</footer>
			</blockquote>
			<p className="unitalic">
				Cadence is defined in Beats Per Minute, or “BPM”. Your target BPM corresponds to how many strides you take per
				minute. Most recreational runners have a cadence between 150 BPM and 170 BPM, but your cadence is unique to your
				needs and goals as a runner.
			</p>
		</div>
	);
}

function SelectTempo({ targetTempo, setTargetTempo }) {
	const [incrementPress, incrementRelease] = useRepeatable(e => {
		if (e) e.preventDefault();
		setTargetTempo(t => t + 1);
	});
	const [decrementPress, decrementRelease] = useRepeatable(e => {
		if (e) e.preventDefault();
		setTargetTempo(t => t - 1);
	});
	const keyHandlers = useMemo(
		() => ({
			ArrowUp: { onDown: incrementPress, onUp: incrementRelease },
			ArrowRight: { onDown: incrementPress, onUp: incrementRelease },
			ArrowDown: { onDown: decrementPress, onUp: decrementRelease },
			ArrowLeft: { onDown: decrementPress, onUp: decrementRelease },
		}),
		[decrementPress, decrementRelease, incrementPress, incrementRelease]
	);
	useKeyPresses(keyHandlers);
	return (
		<div className="Tempo-select">
			<button
				onMouseDown={incrementPress}
				onMouseUp={incrementRelease}
				onTouchStart={incrementPress}
				onTouchCancel={incrementRelease}
				onTouchEnd={incrementRelease}
				className="Tempo-button"
			>
				▲
			</button>
			<div className="Tempo-container">
				<span className="Tempo-value">{targetTempo}</span>
				<span className="Tempo-bpm">BPM</span>
			</div>
			<button
				onMouseDown={decrementPress}
				onMouseUp={decrementRelease}
				onTouchStart={decrementPress}
				onTouchCancel={decrementRelease}
				onTouchEnd={decrementRelease}
				className="Tempo-button"
			>
				▼
			</button>
		</div>
	);
}

function Mp3Toggle({ url }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const track = useMemo(() => {
		const track = new Audio();
		track.preload = 'none';
		track.addEventListener('ended', () => setIsPlaying(false));
		return track;
	}, []);
	useEffect(() => {
		track.src = url;
	}, [track, url]);
	const togglePlaying = useCallback(() => {
		setIsPlaying(x => !x);
		track.paused || track.ended ? track.play() : track.pause();
	}, [track]);

	return <button onClick={togglePlaying}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>;
}

// Prefers a lower absolute delta. In the case where absolute deltas are the same,
// prefers a slower tempo.
const compareDeltas = (a, b) => Math.abs(a) - Math.abs(b) || Math.sign(a) - Math.sign(b);

function SelectSong({ tracks, targetTempo }) {
	return (
		tracks && (
			<table>
				<thead>
					<tr>
						<th scope="col">Title</th>
						<th scope="col">Artist</th>
						<th scope="col">Duration</th>
						<th scope="col">BPM</th>
						<th scope="col">Delta</th>
						<th scope="col">Preview</th>
					</tr>
				</thead>
				<tbody>
					{tracks
						.map(track => {
							let scaledBpm = track.bpm;
							let bestDelta = track.bpm - targetTempo;
							for (let i = 1; i <= 3; ++i) {
								const factor = 2 ** i;
								const doubledBpm = track.bpm * factor;
								const doubledDelta = doubledBpm - targetTempo;
								const halvedBpm = track.bpm / factor;
								const halvedDelta = halvedBpm - targetTempo;
								if (compareDeltas(halvedDelta, bestDelta) < 0) {
									scaledBpm = halvedBpm;
									bestDelta = halvedDelta;
								} else if (compareDeltas(doubledDelta, bestDelta) < 0) {
									scaledBpm = doubledBpm;
									bestDelta = doubledDelta;
								}
							}

							return {
								...track,
								bpm: scaledBpm,
								delta: bestDelta,
							};
						})
						.sort((a, b) => compareDeltas(a.delta, b.delta))
						.map(track => (
							<tr key={`${track.title}|${track.artist}`}>
								<td>
									<a href={track.url} target="_blank" rel="noopener noreferrer">
										{track.title}
									</a>
								</td>
								<td>{track.artist}</td>
								<td>{track.duration}</td>
								<td>{Math.round(track.bpm)}</td>
								<td>{`${['-', '', '+'][Math.sign(track.delta) + 1]}${parseFloat(
									((Math.abs(track.delta) / targetTempo) * 100).toFixed(1)
								)}%`}</td>
								<td>
									<Mp3Toggle url={track.preview} />
								</td>
							</tr>
						))}
				</tbody>
			</table>
		)
	);
}

function App({ queryParams }) {
	const [step, setStep] = useState(queryParams.access_token ? 1 : 0);
	const [targetTempo, _setTargetTempo] = useState(150);
	const [tracks, setTracks] = useState(null);

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--hue',
			16 + (1 - (targetTempo - 60) / (TEMPO_UPPER_BOUND - TEMPO_LOWER_BOUND)) * 200
		);
	}, [targetTempo]);

	const setTargetTempo = useCallback(newTempo => {
		if (typeof newTempo === 'function') {
			_setTargetTempo(oldTempo => boundTempo(newTempo(oldTempo)));
		} else _setTargetTempo(boundTempo(newTempo));
	}, []);

	useEffect(() => {
		if (queryParams.access_token) {
			setTracks([]);

			const Authorization = `${queryParams.token_type} ${queryParams.access_token}`;
			let nextParams = '?limit=50';
			(async () => {
				const processResponse = ({ next, items: tracks }) => {
					nextParams = next && next.slice(next.indexOf('?'));

					tracks.forEach(track => {
						fetch(`${SPOTIFY_API_ROUTE}/v1/audio-features/${track.id}`, {
							headers: { Authorization },
						})
							.then(response => response.json())
							.then(features => {
								setTracks(oldTracks => [
									...oldTracks,
									{
										id: track.id,
										title: track.name,
										artist: track.artists.map(a => a.name).join(', '),
										duration: msToTimestamp(track.duration_ms),
										bpm: features.tempo,
										preview: track.preview_url,
										url: track.external_urls.spotify,
										features,
									},
								]);
							});
					});
				};

				while (nextParams) {
					await fetch(`${SPOTIFY_API_ROUTE}/v1/me/top/tracks${nextParams}`, {
						headers: { Authorization },
					})
						.then(response => response.json())
						.then(processResponse);
				}
			})();
		}
	}, [queryParams.access_token, queryParams.token_type]);

	const { title, Main, Footer } = steps[step];
	return (
		<div className="App">
			<header className="Header">
				<h1>{title}</h1>
			</header>
			<main>
				<Main targetTempo={targetTempo} setTargetTempo={setTargetTempo} tracks={tracks} />
			</main>
			<footer className="Footer">
				<Footer setStep={setStep} />
			</footer>
		</div>
	);
}

export default App;
