# Movie Search Plus

Movie Search Plus is a ReactJS-based application that allows users to search for movies using the TMDB (The Movie Database) API. The app also integrates with Appwrite to show trending movies based on the most searched films. It utilizes debouncing to minimize API calls while users type their search queries.

## Features

- **Search for Movies**: Allows users to search for movies by title using the TMDB API.
- **Trending Movies**: Displays trending movies based on the most searched movies, leveraging Appwrite as the backend.
- **Debounced Search**: Implements debouncing to reduce the frequency of API calls while the user types in the search bar, improving performance and user experience.

## Tech Stack

- **Frontend**: ReactJS
- **API**: TMDB API
- **Backend**: Appwrite (for tracking and displaying trending movies)
- **Debouncing**: Implemented using `setTimeout` and `clearTimeout` for reduced API calls.
