import moviesData from "./moviesData.json";

function createMovieGraph(moviesData) {
  const graph = [];

  moviesData.forEach(movie => {
    graph.push({ name: movie.name, actors: movie.actors, genres: movie.genres, neighbors: [] });
  });

  return graph;
}

function calculateSimilarityOfAll(graph) { //Jaccard
  graph.forEach(movie1 => {
    graph.forEach(movie2 => {
      if (movie1 !== movie2) {
        const commonActors = movie1.actors.filter(actor => movie2.actors.includes(actor)); //interseção de actors
        const commonGenres = movie1.genres.filter(genre => movie2.genres.includes(genre)); //interseção de genres

        if (commonActors.length > 0 || commonGenres.length > 0) {
          const actorsJaccard = commonActors.length / [...new Set(movie1.actors.concat(movie2.actors))].length; //interseção de actors dividido pela soma dos actors
          const genresJaccard = commonGenres.length / [...new Set(movie1.genres.concat(movie2.genres))].length; //intreseção dos genres dividido pela soma dos genres

          const similarity = (0.3 * actorsJaccard + 0.7 * genresJaccard) * 100;

          movie1.neighbors.push({
            movie: movie2.name,
            commonActors: commonActors,
            commonGenres: commonGenres,
            similarity: similarity > 25 ? Math.round(similarity) : null,
          });
        }
      }
    });
  });
}

const movieGraph = createMovieGraph(moviesData);

calculateSimilarityOfAll(movieGraph);

export default function handler(req, res) {
  res.status(200).json(movieGraph);
}
