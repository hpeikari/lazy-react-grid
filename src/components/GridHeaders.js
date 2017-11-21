import React from 'react';
import { connect } from 'react-redux';
import AddNewRowButton from './AddNewRowButton';
import styles from './index.scss';

import { TABLE_NAME } from '../actions';

const GridHeaders = props => {
  const inlineStyles = {
    headerWrapper: {
      height: props.headerHeight,
      width: props.cellWidth
    }
  };

//  console.log('render <GridHeaders>')

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.columnHeaderWrapper}>
        {
          Object.keys(props.colDefs).map(col => col).map(columnName => (
            <div className={styles.headerCell} style={inlineStyles.headerWrapper} key={columnName}>
              {columnName}
            </div>
          ))
        }
      </div>
      <AddNewRowButton
        btnHeight={props.btnHeight}
        colDefs={props.colDefs}
      />
    </div>
  )
};

const mapStateToProps = ({grid}) => ({
  colDefs: (grid[TABLE_NAME] && grid[TABLE_NAME].colDefs) || []
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GridHeaders);
