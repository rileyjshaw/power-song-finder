import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryParams = window.location.hash
	.slice(1)
	.split('&')
	.reduce((acc, pair) => {
		if (pair) {
			const [key, value] = pair.split('=');
			acc[key] = decodeURIComponent(value);
		}
		return acc;
	}, {});
window.history.replaceState({}, document.title, window.location.pathname);

ReactDOM.render(
	<React.StrictMode>
		<App queryParams={queryParams} />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
