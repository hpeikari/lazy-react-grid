import React from 'react';
import { connect } from 'react-redux';
import AddNewRowButton from './AddNewRowButton';
import styles from './index.scss';

import { TABLE_NAME } from '../actions';

const GridHeaders = props => {
  const headerWidth = (props.cellWidth * props.colCount) + props.scrollBarWidth;

  const inlineStyles = {
    columnsWrapper: {
      overflowX: 'hidden'
    },
    columnHeaderWrapper: {
      width: headerWidth
    },
    headerCell: {
      height: props.headerHeight,
      width: props.cellWidth
    }
  };

//  console.log('render <GridHeaders>')

  return (
    <div className={styles.headerWrapper}>
      <div id='llamaLazyGrid_columnsWrapper' style={inlineStyles.columnsWrapper}>
        <div className={styles.columnHeaderWrapper} style={inlineStyles.columnHeaderWrapper}>
          {
            Object.keys(props.colDefs).map(col => col).map(columnName => (
              <div className={styles.headerCell} style={inlineStyles.headerCell} key={columnName}>
                {columnName}
              </div>
            ))
          }
        </div>
      </div>
      <AddNewRowButton
        btnHeight={props.btnHeight}
        colDefs={props.colDefs}
      />
    </div>
  )
};

const mapStateToProps = ({grid}) => {
  const colDefs = (grid[TABLE_NAME] && grid[TABLE_NAME].colDefs) || {}
  return {
    colDefs,
    colCount: Object.keys(colDefs).length
  }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GridHeaders);
