import React, { Component } from 'react';
import { connect } from 'react-redux';
import GridRow from './GridRow';
import styles from './index.scss';

import { TABLE_NAME } from '../actions';

class GridRows extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.totalRowCount === nextProps.totalRowCount // no change in the total number of rows
        && this.props.rowDataArr[0] === nextProps.rowDataArr[0]) {  // new block of rows is not fetched
      return false;
    }

    return true;
  }

  render () {
    const viewportPosition = (this.props.blockIndex * this.props.blockRowSize * this.props.rowHeight);

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
          // merge the two row data arrays so we can render them together

          this.props.newRowDataArr.concat(this.props.rowDataArr)
          .map((row, index) => (
              <GridRow
                key={`gridRowData-${row.uniqueRowId}`}
                uniqueRowId={row.uniqueRowId}
                cellData={row}
                rowHeight={this.props.rowHeight}
                cellWidth={this.props.cellWidth}
              />
            )
          )
        }
      </div>
    );
  };
};

const mapStateToProps = ({grid}) => {
  const rowDataArr = (grid[TABLE_NAME] && grid[TABLE_NAME].rowData && grid[TABLE_NAME].rowData) || [];
  const newRowDataArr = (grid[TABLE_NAME] && grid[TABLE_NAME].newRowData && grid[TABLE_NAME].newRowData) || [];

  const rowDataUniqueRowIdArr = rowDataArr.map(r => r.uniqueRowId) || [];
  const newRowDataUniqueRowIdArr = newRowDataArr.map(r => r.uniqueRowId) || [];
  return {
    blockIndex: (grid[TABLE_NAME] && grid[TABLE_NAME].blockIndex) || 0,
    rowDataArr,
    newRowDataArr,
    totalRowCount: newRowDataUniqueRowIdArr.length + rowDataUniqueRowIdArr.length
  }
}

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GridRows);
