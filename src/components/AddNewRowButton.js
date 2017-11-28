import React from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';

import { TABLE_NAME, addNewRow } from '../actions';

const AddNewRowButton = props => {
  const inlineStyles = {
    addNewRowBtn: {
      height: props.btnHeight
    }
  };

  const addNewRowHandler = (tableName, colDefs) => {
    const newRow = colDefs && Object.keys(props.colDefs).map(col => {
      return ({
        [col]: colDefs[col].defaultValue || null
        })
      })
      .reduce((res, cur) => ({...res, ...cur}));

    const totalRowCount = props.rowCount + props.newRowCount;
    const newRowWithUniqueId = {
      uniqueRowId: totalRowCount|| 0,
      // TODO: is prefix/suffix with __ a good convention to distinguish between real cols from backend vs helper cols created by grid? how about __uniqueRowId__ ?
      __pinned__: 'top',
      ...newRow
    };

    // store newly created row in redux
    props.addNewRowAction(tableName, newRowWithUniqueId);
  }

  return ( // TODO: tableData && tableData.rowData && !hasnewRowData &&
    <div
    className={styles.addNewRowBtn}
    style={inlineStyles.addNewRowBtn}
    onClick={() => addNewRowHandler(TABLE_NAME, props.colDefs)}>
    + ADD NEW RECORD
      </div>
    );
};


const mapStateToProps = ({grid}) => ({
  colDefs: (grid[TABLE_NAME] && grid[TABLE_NAME].colDefs) || [],
  rowCount: (grid[TABLE_NAME] && grid[TABLE_NAME].rowCount) || 0,
  newRowCount: (grid[TABLE_NAME] && grid[TABLE_NAME].newRowData && grid[TABLE_NAME].newRowData.length) || 0 // TODO: iterate through newRowData and check for newly created only
});

const mapDispatchToProps = dispatch => ({
  addNewRowAction: (tableName, newRow) => dispatch(addNewRow(tableName, newRow))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNewRowButton);
