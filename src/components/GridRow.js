import React from 'react';
import { connect } from 'react-redux';
import TextInputCell from './TextInputCell';
import styles from './index.scss';
import { valueFormatterForString } from '../utils';
import { TABLE_NAME } from '../actions';

const GridRow = (props) => {
  // transform data for increased readability
  const cellData = Object.keys(props.colDefs).map(columnName => ({
    cellValue: valueFormatterForString(props.row[columnName]),
    cellError: props.row[`${columnName}_error`] || null,
    cellColumnName: columnName,
    cellColumnDef: props.colDefs[columnName]
  }));

  const handleBlur = (event, uniqueRowId) => {
    console.log('on blur .... rowId: ', uniqueRowId, cellData)
  }
// TODO optimize rendering
//  console.log('render <GridRow>')

  return (
    <div
      className={[
        styles.rowStyle,
        props.row['__pinned__'] === 'top' ? styles.pinnedTopRow : ''
      ].join(' ')}
      onBlur={e => handleBlur(e, props.uniqueRowId)}
    >
      {
        cellData && cellData.map((cell, index) => (
          // TODO create lookup table and logic to use diff cell editors
          // TEXT-INPUT cell editor:
          <TextInputCell
            key={`cell-${props.uniqueRowId}-{${cell.cellColumnName}`}
            cellData={cell}
            uniqueRowId={props.uniqueRowId}
            isPinned={!!(props.row['__pinned__'])}
            rowHeight={props.rowHeight}
            cellWidth={props.cellWidth}
          />
        ))
     }
    </div>
  )
}

const mapStateToProps = ({grid}, props) => {
  const rowDataSet = !!(props.cellData['__pinned__']) ? 'newRowData' : 'rowData';

  return {
    colDefs: (grid[TABLE_NAME] && grid[TABLE_NAME].colDefs) || [],
    row: (grid[TABLE_NAME] && grid[TABLE_NAME][rowDataSet] && grid[TABLE_NAME][rowDataSet].find(r => r.uniqueRowId === props.uniqueRowId)) || []
  }
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GridRow);
