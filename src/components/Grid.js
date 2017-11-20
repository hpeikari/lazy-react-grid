import React, { Component } from 'react';
import { connect } from 'react-redux';
import GridHeaders from './GridHeaders';
import GridRows from './GridRows';
import styles from './index.scss';

import { fetchRowCount, setBlockIndex, fetchRowData, TABLE_NAME } from '../actions';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.initialRowDataLoad = this.initialRowDataLoad.bind(this);
  }

  componentWillMount() {
    this.props.fetchRowCount(TABLE_NAME);
    this.initialRowDataLoad();  // TODO: this must be called after rowCount is set
  }

  componentDidMount() {
    this.refs.gridWrapper.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.refs.gridWrapper.removeEventListener('scroll', this.handleScroll);
    console.log('You have unsaved changes...');
  }

  initialRowDataLoad() {
    console.log('initial data load... ' + this.props.rowCount);

    const initialRowIndexRange = {
      rowIdStart: 0,
      rowIdEnd: Math.min(this.props.rowCount, this.props.blockRowSize)
    };

    this.props.fetchRowData(TABLE_NAME, initialRowIndexRange);
  }

  handleScroll (event) {
    const scrollPosition = event.target.scrollTop;
    const blockHeight = this.props.rowHeight * this.props.blockRowSize; // in px
    const currentBlockIndex = Math.floor(scrollPosition / blockHeight);
    if (currentBlockIndex !== this.props.blockIndex) {
      this.props.setBlockIndex(TABLE_NAME, currentBlockIndex);

      const blockStartPxPosition = currentBlockIndex * blockHeight; // in px
      const blockEndPxPosition = blockStartPxPosition + blockHeight; // in px
      const rowIdStart = blockStartPxPosition / this.props.rowHeight;
      const rowIdEnd = blockEndPxPosition / this.props.rowHeight;

      this.props.fetchRowData(TABLE_NAME, {rowIdStart, rowIdEnd});

      console.log('blockIndex ' + currentBlockIndex + ' --> scroll positions: ' + blockStartPxPosition + ' < ' + scrollPosition + ' < ' + blockEndPxPosition + ' --> FetchRowIds('+ rowIdStart + ', '+ rowIdEnd +')' );
    }
  }

  render() {
//    console.log('render <Grid>')
    const totalScrollHeight = this.props.headerHeight + (this.props.rowCount * this.props.rowHeight);

    const inlineStyles = {
      gridTable: {
        height: totalScrollHeight
      }
    };

    return (
      <div ref='gridWrapper' className={styles.gridWrapper}>
        <div
          style={inlineStyles.gridTable}
          className={styles.gridTable}
          onScroll={(e) => handleScroll(e)}
        >
          <GridHeaders
            headerHeight={this.props.headerHeight}
            cellWidth={this.props.cellWidth}
          />
          <GridRows
            rowHeight={this.props.rowHeight}
            headerHeight={this.props.headerHeight}
            cellWidth={this.props.cellWidth}
            blockIndex={this.props.blockIndex}
            blockRowSize={this.props.blockRowSize}
          />
        </div>
      </div>
    );
  };
};

const mapStateToProps = ({grid}) => ({
  blockIndex: (grid[TABLE_NAME] && grid[TABLE_NAME].blockIndex) || 0,
  rowCount: (grid[TABLE_NAME] && grid[TABLE_NAME].rowCount) || 0
});

const mapDispatchToProps = dispatch => ({
  setBlockIndex: (tableName, blockIndex) => dispatch(setBlockIndex(tableName, blockIndex)),
  fetchRowCount: (tableName) => dispatch(fetchRowCount(dispatch, tableName)),
  fetchRowData: (tableName, rowRange) => dispatch(fetchRowData(dispatch, tableName, rowRange))
});

export default connect(mapStateToProps, mapDispatchToProps)(Grid);