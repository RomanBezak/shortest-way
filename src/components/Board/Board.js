import React from 'react';
import { Graph, alg } from '@dagrejs/graphlib';
import classNames from 'classnames';

import './Board.scss';

const ROWS = 3;
const COLUMNS = 3;

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: ROWS,
      columns: COLUMNS,
      tilesMap: this.createMapModel()
    };

    var g = new Graph({ directed: true });
    g.setNode('1', 'first');


    g.setEdge('1','2');
    g.setEdge('1','4');
    g.setEdge('3','4');
    g.setEdge('2','5');
    g.setEdge('1','5');
    g.setEdge('4','2');
    g.setEdge('5','1');
    // directed.edge("a", "b"); // returns "my-label"
    // directed.edge("b", "a"); // returns undefined
    // alg.dijkstraAll(g)
    console.log(alg.dijkstraAll(g));
    
  }

  createMapModel(rows = ROWS, columns = COLUMNS, defaultValue = 1) {
    return Array(rows)
      .fill()
      .map(() => Array(columns).fill(defaultValue));
  }

  handlerTileClick(rowId, columnId) {
    const tilesMap = this.state.tilesMap;

    tilesMap[rowId][columnId] = tilesMap[rowId][columnId] ? 0 : 1;

    this.setState({ tilesMap });
  }

  render() {
    return (
      <div id="board-container">
        {
          this.state.tilesMap.map((row, rowId) => (
            <Row key={`row-${rowId}`}>
              {
                row.map((value, columnId) => (
                  <Tile
                    key={`column-${rowId}${columnId}`}
                    value={value}
                    onClick={() => this.handlerTileClick(rowId, columnId)}
                  />
                ))
              }
            </Row>
          ))
        }
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
    const classList = classNames({
      'tile': true,
      'wall': !this.props.value
    });

    return (
      <div
        className={classList}
        onClick={this.props.onClick}
        title={this.props.value}
      />
    );
  }
}
