import React from 'react';
import classNames from 'classnames';
import constants from '../../config/constatnts';
import MapManager from '../../helpers/MapManager';
import './Board.scss';

const {
  WALL,
  EMPTY,
  INITIAL_POINT,
  WAY_POINT,
  ROWS,
  COLUMNS
} = constants;

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      rows: ROWS,
      columns: COLUMNS,
      initialPoints: 2,
      tilesMap: this.createMapModel()
    };

    this.state = this.initialState;
    this.mapManager = new MapManager();

    this.clearBoard = this.clearBoard.bind(this);
    this.handleCalculateClick = this.handleCalculateClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  createMapModel(rows = ROWS, columns = COLUMNS, defaultValue = EMPTY) {
    return Array(rows)
      .fill()
      .map(() => Array(columns).fill(defaultValue));
  }

  calculateShortestWay() {
    this.mapManager.initGraph(this.state.tilesMap);
    
    const shortestWay = this.mapManager.getShortestWayBetweenTwoInitialPoints();

    let tilesMap = this.state.tilesMap;

    if (shortestWay) {
      shortestWay.forEach(point => {
        let [row, col] = MapManager.getTileRowAndColumbByNodeId(point);

        tilesMap[row][col] = WAY_POINT;
      });

      this.setState({ tilesMap });
    } else {
      alert('Path not found');
    }
  }

  handleResetClick() {
    console.log('reset');
  }

  handleCalculateClick() {
    if (this.state.initialPoints) {
      alert('Starting points not set');
    } else {
      this.calculateShortestWay();
    }
  }

  handleTileClick(rowId, columnId) {
    const tilesMap = this.state.tilesMap;
    const tile = tilesMap[rowId][columnId];

    if (this.state.initialPoints && tile !== INITIAL_POINT) {
      tilesMap[rowId][columnId] = INITIAL_POINT;

      this.setState({ initialPoints: this.state.initialPoints - 1 });
    } else {
      switch (tile) {
        case EMPTY:
          tilesMap[rowId][columnId] = WALL;
          break;
        case WALL:
          tilesMap[rowId][columnId] = EMPTY;
          break;
        case INITIAL_POINT:
          tilesMap[rowId][columnId] = EMPTY;
          this.setState({ initialPoints: this.state.initialPoints + 1 });
          break;
        default:
          break;
      }

      this.setState({ tilesMap });
    }
  }

  clearBoard() {
    this.setState({
      ...this.initialState,
      tilesMap: this.createMapModel(this.initialState.rows, this.initialState.columns)
    });
  }

  render() {
    return (
      <div id="board">
        <div id="board-container">
          {
            this.state.tilesMap.map((row, rowId) => (
              <Row key={`row-${rowId}`}>
                {
                  row.map((value, columnId) => (
                    <Tile
                      key={`column-${rowId}${columnId}`}
                      value={value}
                      onClick={() => this.handleTileClick(rowId, columnId)}
                    />
                  ))
                }
              </Row>
            ))
          }
        </div>
        <div id="controls">
          <button onClick={this.handleCalculateClick}>Calculate shortest way</button>
          <button onClick={this.clearBoard}>Clear board</button>

          <div className="map-size-controls-container">
          <label>
            Rows:
            <input type="number" onChange={e => this.initialState.rows = Number(e.target.value)} />
          </label>
          <label>
            Columns:
            <input type="number" onChange={e => this.initialState.columns = Number(e.target.value)}/>
          </label>
            <button onClick={this.clearBoard}>Reset</button>
          </div>
        </div>
      </div>

    );
  }
}

const Row = (props) => <div className="row">{props.children}</div>;

class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    const { value, onClick } = this.props;

    const classList = classNames({
      'tile': true,
      'wall': value === WALL
    });

    const isInitialPoint = value === INITIAL_POINT;
    const isWayPoint = value === WAY_POINT;

    return (
      <div
        className={classList}
        onClick={onClick}
        title={value}
      >
        { isInitialPoint && <div className="initialPoint" /> }
        { isWayPoint && <div className="wayPoint" /> }
      </div>
    );
  }
}
