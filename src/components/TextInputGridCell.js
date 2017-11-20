import React from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { TABLE_NAME, changeInputValue } from '../actions';

const TextInputGridCell = (props) => {
  const inlineStyles = {
    rowStyle: {
      height: props.rowHeight,
      width: props.cellWidth
    }
  };

  // transform data for increased readability
  const cellData = Object.keys(props.colDefs).map(col => col).map(columnName => ({
    cellValue: props.row[columnName],
    cellColumnName: columnName,
    cellColumnDef: props.colDefs[columnName]
  }));

  console.log('render <TextInputGridCell>')

  return (
    <div className={styles.rowStyle}>
      {
        cellData && cellData.map((cell, index) => (
            <input
              key={`{${cell.cellColumnName}-${index * (Math.random() * 10000)}`}
              value={cell.cellValue}
              readOnly={cell.cellColumnDef.isReadOnly}
              type={cell.cellColumnDef.dataTypeName === 'int' ? 'int' : 'text'}
              style={inlineStyles.rowStyle}
              className={[
                styles.gridCell,
                cell.cellColumnDef.isReadOnly ? styles.readOnly : ''
              ].join(' ')}
              onChange={(e)=>props.changeInputValueAction(TABLE_NAME, props.uniqueRowId, cell.cellColumnName, e.target.value)}
            />
          )
        )
      }
    </div>
  )
}

const mapStateToProps = ({grid}, props) => ({
  colDefs: (grid[TABLE_NAME] && grid[TABLE_NAME].colDefs) || [],
  row: (grid[TABLE_NAME] && grid[TABLE_NAME].rowData.find(r => r.uniqueRowId === props.uniqueRowId)) || []
});

const mapDispatchToProps = dispatch => ({
  changeInputValueAction: (tableName, uniqueRowId, columnName, value) => dispatch(changeInputValue(tableName, uniqueRowId, columnName, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextInputGridCell);
