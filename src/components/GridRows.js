import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInputGridCell from './TextInputGridCell';
import styles from './index.scss';

import { TABLE_NAME } from '../actions';

class GridRows extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.uniqueRowIdArr.length === nextProps.uniqueRowIdArr.length
       && this.props.uniqueRowIdArr[0] === nextProps.uniqueRowIdArr[0]) {
      return false;
    } else {
      return true;
    }
  }

  render () {
    const viewportPosition = this.props.headerHeight + this.props.btnHeight + (this.props.blockIndex * this.props.blockRowSize * this.props.rowHeight);

    const inlineStyles = {
      rowContainer: {
        position: 'absolute',
        top: viewportPosition
      }
    };

//    console.log('render <GridRows>')

    return (
      <div className={styles.rowContainer} style={inlineStyles.rowContainer}>
        {
          // TODO: refactor such that we concat the array of pinned with non-pinned
          // (i.e. newRowData with rowData) and then map through the array in sequence
          //  this.props.newUniqueRowIdArr && this.props.newUniqueRowIdArr.map((uniqueRowId, index) => {
          //    return (
          //      <TextInputGridCell
          //        key={`userRow-${uniqueRowId}`}
          //        keyIndex={uniqueRowId}
          //        rowHeight={this.props.rowHeight}
          //        cellWidth={this.props.cellWidth}
          //        uniqueRowId={uniqueRowId}
          //        />
          //    )}
          //  )
        }
        {
          this.props.uniqueRowIdArr && this.props.uniqueRowIdArr.map((uniqueRowId, index) => {
            return (
              <TextInputGridCell
                key={`userRow-${uniqueRowId}`}
                keyIndex={uniqueRowId}
                rowHeight={this.props.rowHeight}
                cellWidth={this.props.cellWidth}
                uniqueRowId={uniqueRowId}
              />
            )}
          )
        }
      </div>
    );
  };
};

const mapStateToProps = ({grid}) => ({
  blockIndex: (grid[TABLE_NAME] && grid[TABLE_NAME].blockIndex) || 0,
  uniqueRowIdArr: (grid[TABLE_NAME] && grid[TABLE_NAME].rowData && grid[TABLE_NAME].rowData.map(r => r.uniqueRowId)) || [],
  newUniqueRowIdArr: (grid[TABLE_NAME] && grid[TABLE_NAME].newRowData && grid[TABLE_NAME].newRowData.map(r => r.uniqueRowId)) || []
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GridRows);
