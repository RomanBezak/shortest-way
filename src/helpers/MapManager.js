import { Graph, alg } from '@dagrejs/graphlib';
import constants from '../config/constatnts';

const {
  WALL,
  INITIAL_POINT
} = constants;

export default class MapManager {
  getShortestWayBetweenTwoInitialPoints() {
    const [startPoint, endPoint] = this.initialPoints;
    const dijkstraResponse = alg.dijkstra(this.tileMapGraph, startPoint);

    return this.calculateShortestWay(dijkstraResponse, endPoint);
  }

  calculateShortestWay(response, to, path = [to]) {
    if (response[to] && response[to].distance !== Infinity) {
      if (response[to].distance > 0) {
        return this.calculateShortestWay(
          response,
          response[to].predecessor,
          [...path, response[to].predecessor]
        );
      } else return path.filter(i => this.initialPoints.includes(i) === false);
    } return null;
  }

  initGraph(tilesMap) {
    this.tilesMap = tilesMap;
    this.tileMapGraph = new Graph({ directed: true});

    this.initNodes();
    this.initEdges()
    this.calculateInitialPoints();
  }

  initNodes() {
    this.tilesMap.forEach((row, rowId) => {
      row.forEach((tile, colId) => {
        this.tileMapGraph.setNode(this.getNodeIdByRowAndColumn(rowId, colId));
      });
    });
  }

  initEdges() {
    this.tilesMap.forEach((row, rowId) => {
      row.forEach((tile, colId) => {
        this.getTileNeighbors(rowId, colId).forEach(neighborNodeId => {
          this.tileMapGraph.setEdge(this.getNodeIdByRowAndColumn(rowId, colId), neighborNodeId);
        });
      });
    });
  }

  calculateInitialPoints() {
    this.initialPoints = [];

    this.tilesMap.forEach((row, rowId) => {
      row.forEach((tile, colId) => {
        if (tile === INITIAL_POINT)
          this.initialPoints.push(this.getNodeIdByRowAndColumn(rowId, colId));
      });
    });
  }

  getNodeIdByRowAndColumn(row, column) {
    return `${row}_${column}`;
  }

  static getTileRowAndColumbByNodeId(pointId) {
    return pointId.split('_').map(i => Number(i));
  }

  getTileNeighbors(row, col) {
    if (this.tilesMap[row][col] === WALL) {
      return [];
    }

    return [
      this.isValidTileNeighbor(row-1, col),
      this.isValidTileNeighbor(row+1, col),
      this.isValidTileNeighbor(row, col+1),
      this.isValidTileNeighbor(row, col-1)
    ].filter(Boolean);
  }

  isValidTileNeighbor(row, col) {
    return this.tilesMap[row] && this.tilesMap[row][col] && this.tilesMap[row][col] !== WALL && this.getNodeIdByRowAndColumn(row, col);
  }
}
