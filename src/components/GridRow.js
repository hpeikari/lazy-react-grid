import React from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { isNumeric, valueFormatterForString } from '../utils';
import { TABLE_NAME, changeInputValue, setCellErrorMessage } from '../actions';

const GridRow = (props) => {
  const inlineStyles = {
    cellStyle: {
      height: props.rowHeight,
      width: props.cellWidth
    }
  };

  const validate = (val, cell) => {
    const value = val.trim();
    let error = null;
    if (!cell.cellColumnDef.allowsNull && !!value && !value.length) {
      error = 'This field is required.';
    } else if (value.length > cell.cellColumnDef.columnSize) {
      error = 'The entered value is too long.';
    } else if (['float', 'int'].indexOf(cell.cellColumnDef.dataTypeName) > 0 && !isNumeric(value)) {
      error = 'Enter a numeric value.';
    }

    // dispatch only if error has changed
    if (cell.cellError !== error) {
      props.setCellErrorMessageAction(TABLE_NAME, props.uniqueRowId, !!(props.cellData['__pinned__']), cell.cellColumnName, error);
    }
  };


  const handleClick = (value, cell) => {
    validate(value, cell);
  }


  // TODO: implement a debounce
  const handleChange = (value, cell) => {
    validate(value, cell);
    props.changeInputValueAction(TABLE_NAME, props.uniqueRowId, !!(props.cellData['__pinned__']), cell.cellColumnName, value);
  };

  // transform data for increased readability
  const cellData = Object.keys(props.colDefs).map(columnName => ({
    cellValue: valueFormatterForString(props.row[columnName]),
    cellError: props.row[`${columnName}_error`] || null,
    cellColumnName: columnName,
    cellColumnDef: props.colDefs[columnName]
  }));

// TODO optimize so all cells are rendered with small changes
//  console.log('render <GridRow>')

  return (
    <div
      className={[
        styles.rowStyle,
        props.row['__pinned__'] === 'top' ? styles.pinnedTopRow : ''
      ].join(' ')}
    >
      {
        // TODO create lookup table and logic to use diff cell editors
        cellData && cellData.map((cell, index) => (
          // TEXT-INPUT cell editor:
          <span
            key={`cell-${props.uniqueRowId}-{${cell.cellColumnName}`}
            className={styles.tooltip}
          >
            <input
              value={cell.cellValue}
              placeholder='null'
              disabled={cell.cellColumnDef.isReadOnly}
              type={cell.cellColumnDef.dataTypeName === 'int' ? 'int' : 'text'}
              style={inlineStyles.cellStyle}
              maxLength={cell.cellColumnDef.columnSize}
              className={[
                styles.gridCell,
                !cell.cellError && props.row['__pinned__'] ? styles.pinnedTopCell : '',
                cell.cellError ? styles.errorStyles : '',
                cell.cellColumnDef.isReadOnly ? styles.readOnly : ''
              ].join(' ')}
              onClick={e => handleClick(e.target.value, cell)}
              onChange={e => handleChange(e.target.value, cell)}
            />
            <span className={cell.cellError ? styles.showTooltipText : styles.hideTooltipText}>{cell.cellError}</span>
          </span>
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

const mapDispatchToProps = dispatch => ({
  changeInputValueAction: (tableName, uniqueRowId, isPinned, columnName, value) => dispatch(changeInputValue(tableName, uniqueRowId, isPinned, columnName, value)),
  setCellErrorMessageAction: (tableName, uniqueRowId, isPinned, columnName, error) => dispatch(setCellErrorMessage(tableName, uniqueRowId, isPinned, columnName, error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GridRow);
