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
    }
    return true;
  }

  render () {
    const viewportPosition = this.props.headerHeight + (this.props.blockIndex * this.props.blockRowSize * this.props.rowHeight);

    const inlineStyles = {
      rowWrapper: {
        position: 'absolute',
        top: viewportPosition
      }
    };

    console.log('render <GridRows>')

    return (
      <div className={styles.rowWrapper} style={inlineStyles.rowWrapper}>
        {
          this.props.uniqueRowIdArr && this.props.uniqueRowIdArr.map((uniqueRowId, index) => {
            return (
              <TextInputGridCell
                key={`${uniqueRowId}-${index * (Math.random() * 10000)}`}
                rowHeight={this.props.rowHeight}
                cellWidth={this.props.cellWidth}
                uniqueRowId={uniqueRowId}
              />
            )}
          )
        }
      </div>
    )
  }
};

const mapStateToProps = ({grid}) => ({
  blockIndex: (grid[TABLE_NAME] && grid[TABLE_NAME].blockIndex) || 0,
  uniqueRowIdArr: (grid[TABLE_NAME] && grid[TABLE_NAME].rowData).map(r => r.uniqueRowId) || []
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GridRows);
