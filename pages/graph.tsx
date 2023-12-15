import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useMediaQuery } from '@mantine/hooks';

interface Nodes {
  actors: any;
  genres: any;
  [key: string]: any;
}

const Graph: React.FC = () => {
  const [graph, setGraph] = useState<Nodes[]>([]);
  const [graphInitialized, setGraphInitialized] = useState(false); // Track initialization state
  const isMobile = useMediaQuery('(max-width: 50em)');

  async function getGraph() {
    try {
      const response = await fetch('/api/graph');
      const data = await response.json();
      setGraph(data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  }

  useEffect(() => {
    getGraph();
  }, []);

  useEffect(() => {
    if (!graphInitialized && graph.length > 0) {
      const nodes = graph.map((node) => ({ id: node.name }));
      const links = graph
        .flatMap((node) =>
          node.neighbors
            .filter((neighbor) => neighbor.similarity !== null)
            .map((neighbor) => ({
              source: node.name,
              target: neighbor.movie,
              similarity: neighbor.similarity,
            }))
        );

      const width = 1200;
      const height = 800;

      const svg = d3.select('#graph-container').append('svg').attr('width', width).attr('height', height);

      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d) => (d as any).id).distance(300))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const link = svg
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);

      const node = svg
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 8)
        .attr('fill', 'steelblue')
        .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      const edgeLabels = svg
        .selectAll('.edge-label')
        .data(links)
        .enter()
        .append('text')
        .attr('class', 'edge-label')
        .text((d: any) => Math.round(d.similarity) + 'P')
        .attr('dy', -5)
        .attr('text-anchor', 'middle')
        .style('fill', 'skyblue');

      const nodeLabels = svg
        .selectAll('.node-label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'node-label')
        .text((d: any) => d.id)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .style('fill', 'steelblue');

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => (d as any).source.x)
          .attr('y1', (d: any) => (d as any).source.y)
          .attr('x2', (d: any) => (d as any).target.x)
          .attr('y2', (d: any) => (d as any).target.y);

        node.attr('cx', (d: any) => (d as any).x).attr('cy', (d: any) => (d as any).y);

        edgeLabels
          .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
          .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

        nodeLabels.attr('x', (d: any) => (d as any).x).attr('y', (d: any) => (d as any).y);
      });

      setGraphInitialized(true);
    }

  }, [graph, graphInitialized]);

  return <div id="graph-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
};

export default Graph;
