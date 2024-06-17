export interface TmdbMovieResult {
    id: number;
    //The rest
}

export interface TmdbMovieResponse {
    movie_results: TmdbMovieResult[];
}

export interface TmdbVideo {
    key: string;
    type: string;
}

export interface TmdbVideoResponse {
    results: TmdbVideo[];
}
