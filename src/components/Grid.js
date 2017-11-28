import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import GridHeaders from './GridHeaders';
import GridRows from './GridRows';
import { getScrollbarWidth } from '../utils';
import styles from './index.scss';

import { fetchRowCount, setBlockIndex, fetchRowData, TABLE_NAME } from '../actions';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.syncScrolls = this.syncScrolls.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.initialRowDataLoad = this.initialRowDataLoad.bind(this);
    this.scrollBarWidth = getScrollbarWidth();


    this.debounceScroll = debounce(scrollPosition => {
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
    }, 50); // throttle delay
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

  handleScroll(event) {
    const scrollTopPosition = event.target.scrollTop;
    const scrollLeftPosition = event.target.scrollLeft;

    if (this.scrollTop !== scrollTopPosition) { // vertical scroll
      this.scrollTop = scrollTopPosition;
      this.debounceScroll(scrollTopPosition);
    } else if (this.scrollLeft !== scrollLeftPosition) { // horizontal scroll
      this.syncScrolls(scrollLeftPosition);
    }
  }

  syncScrolls(scrollLeftPosition) {
    this.scrollLeft = scrollLeftPosition;
    const colWrapperElement = document.getElementById('llamaLazyGrid_columnsWrapper');
    colWrapperElement.scrollLeft = scrollLeftPosition;
  }

  render() {
//    console.log('render <Grid>')
    const totalScrollHeight = ((this.props.rowCount + this.props.newRowCount) * this.props.rowHeight);

    const inlineStyles = {
      scrollableContainerWrapper: {
        overflow: 'scroll',
        display: 'block'
      },
      scrollableContainer: {
        height: totalScrollHeight,
        position: 'relative'
      }
    };

    return (
      <div
        ref='gridWrapper'
        className={[
          styles.gridWrapper,
          this.props.className
          ].join(' ')}
      >
        <div
          className={styles.gridTable}
        >
          <GridHeaders
            headerHeight={this.props.headerHeight}
            btnHeight={this.props.btnHeight}
            cellWidth={this.props.cellWidth}
            scrollBarWidth={this.scrollBarWidth}
          />
          <div
            onScroll={e => this.handleScroll(e)}
            style={inlineStyles.scrollableContainerWrapper}
            className={styles.scrollableContainerWrapper}
          >
            <div style={inlineStyles.scrollableContainer}>
              <GridRows
                rowHeight={this.props.rowHeight}
                cellWidth={this.props.cellWidth}
                blockIndex={this.props.blockIndex}
                blockRowSize={this.props.blockRowSize}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
};

const mapStateToProps = ({grid}) => ({
  blockIndex: (grid[TABLE_NAME] && grid[TABLE_NAME].blockIndex) || 0,
  rowCount: (grid[TABLE_NAME] && grid[TABLE_NAME].rowCount) || 0,
  newRowCount: (grid[TABLE_NAME] && grid[TABLE_NAME].newRowData && grid[TABLE_NAME].newRowData.length) || 0 // TODO: iterate through newRowData and check for newly created only
});

const mapDispatchToProps = dispatch => ({
  setBlockIndex: (tableName, blockIndex) => dispatch(setBlockIndex(tableName, blockIndex)),
  fetchRowCount: (tableName) => dispatch(fetchRowCount(dispatch, tableName)),
  fetchRowData: (tableName, rowRange) => dispatch(fetchRowData(dispatch, tableName, rowRange))
});

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
