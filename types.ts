interface MovieGraph {
    [movie: string]: {
      actors: string[];
      genres: string[];
      neighbors: {
        movie: string;
        commonActors: string[];
        commonGenres: string[];
        similarity: string | number;
      }[];
    };
  }
  
  interface MovieData {
    movieGraph: MovieGraph;
  }
  
  export default MovieData;
  