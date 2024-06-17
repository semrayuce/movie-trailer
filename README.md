# Movie Trailer API

A REST API for providing movie trailer URLs.

## Overview

This API fetches movie trailer URLs using the Viaplay and TMDB APIs. It takes a movie resource link as input and returns the URL to the trailer for that movie.

## Features

- **Caching**: Uses Redis for caching trailer URLs to improve performance and handle heavy loads.
- **Environment Configuration**: Uses dotenv for managing environment variables.
- **Testing**: Jest and Supertest for writing and running tests.
- **TypeScript**: Written in TypeScript for type safety and better development experience.
- **Express**: Lightweight and fast server-side framework.

## Prerequisites


Before running this project locally, ensure you have the following installed:

- Node.js (version 14.x or later)
- npm (version 6.x or later)
- Redis (for caching)


## Installation

1. Clone the repository git clone https://github.com/semrayuce/movie-trailer.git
2. Run `npm install` to install dependencies
3. Create a `.env` file with your TMDb API key and desired port
4. Run `npm run build`
5. Run `npm start` to start the server
6. Run `npm test` to run the tests 

## Usage

Send a GET request to `/api/trailer` with the `movieUrl` query parameter to get the trailer URL.

## Example

```sh
curl "http://localhost:3000/api/trailer?movieUrl=https://content.viaplay.se/pc-se/film/arrival-2016"