import { Stack, Flex, Container, Center, Button, Text, Paper } from '@mantine/core';
import moviesData from "./api/moviesData.json";
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [graph, setGraph] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  const ResetButton = () => (
    <Button onClick={onClick={resetMatchData}} color="blue">
      Reset Match Data
    </Button>
  );

  const resetMatchData = () => {
    setMatchData(null);
    setSimilarMovies([]); 
  };

  useEffect(() => {
    getGraph();
  }, []);

  useEffect(() => {
    if (matchData) {
      const neighborsComponents = matchData.neighbors
        .filter(neighbor => neighbor.similarity != null)
        .map((neighbor, index) => (
          <Paper shadow="lg" radius="lg" withBorder p="xl" key={index}>
            <Stack>
              <Text size={"xl"} c={"#6099b5"} fw={500}> {neighbor.movie} </Text>
              <Text size={"sm"} align='center' mt={-10}> {neighbor.similarity}P </Text>
            </Stack>
          </Paper>
        ));
  
      const resultsHeader = <Text size={"lg"} fw={600} mt={4}>Movies like {matchData.name}:</Text>;
  
      setSimilarMovies([ResetButton, resultsHeader, ...neighborsComponents]);
    }
  }, [matchData]);

  async function getGraph() {
    try {
      const response = await fetch('/api/graph');
      const data = await response.json();
      setGraph(data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  }

  function handleButtonClick(movie) {
    const matchingNode = graph.find(node => node.name === movie.name);
    setMatchData(matchingNode);
  }

  return (
    <Container fluid h={'100vh'} w={'100vw'}>
      {matchData ? (
        <Flex align="center" justify="center" p={10} wrap="wrap" style={{ flex: 1, gap: 30, marginTop: '20vh' }}>
          {similarMovies}
        </Flex>
      ) : (
        <>
          <Text align="center" size={"xl"} mt={50} fw={700} c="dimmed">Choose your favorite movie:</Text>
          <Center>
            <Flex align="center" justify="center" p={10} wrap="wrap" style={{ flex: 1, gap: 30, marginTop: '20vh' }}>
              {moviesData.map((movie, index) => (
                <div key={index}>
                  <Button onClick={() => { handleButtonClick(movie) }} variant="light" fullWidth>{movie.name}</Button>
                  <Text size={"sm"}> {movie.genres.join(", ")} </Text>
                </div>
              ))}
            </Flex>
          </Center>
        </>
      )}
    </Container>
  );
}
