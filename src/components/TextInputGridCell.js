import React from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { isNumeric } from '../utils';
import { TABLE_NAME, changeInputValue, setCellErrorMessage } from '../actions';

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
    cellError: props.row[`${columnName}_error`] || null,
    cellColumnName: columnName,
    cellColumnDef: props.colDefs[columnName]
  }));

  // TODO: needs clean up: dispatch action to set/unset "error" in redux
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

    if (cell.cellError !== error) {
      // dispatch only if error has changed
      props.setCellErrorMessageAction(TABLE_NAME, props.uniqueRowId, cell.cellColumnName, error);
    }
  };

  const handleBlur = (value, cell) => {
    validate(value, cell);
  }

  const handleChange = (value, cell) => {
    validate(value, cell) // TODO: needs clean up
    props.changeInputValueAction(TABLE_NAME, props.uniqueRowId, cell.cellColumnName, value);
  };

  console.log('render <TextInputGridCell>', cellData)

  return (
    <div className={styles.rowStyle}>
      {
        // TODO: create a lookup table for other input "type"s
        cellData && cellData.map((cell, index) => (
          <span className={styles.tooltip} key={`{${cell.cellColumnName}-${props.keyIndex}`}>
            <input
              value={cell.cellValue}
              readOnly={cell.cellColumnDef.isReadOnly}
              type={cell.cellColumnDef.dataTypeName === 'int' ? 'int' : 'text'}
              style={inlineStyles.rowStyle}
              maxLength={cell.cellColumnDef.columnSize}
              className={[
                styles.gridCell,
                cell.cellError ? styles.errorStyles : '',
                cell.cellColumnDef.isReadOnly ? styles.readOnly : ''
              ].join(' ')}
              onBlur={e => handleBlur(e.target.value, cell)}
              onChange={e => handleChange(e.target.value, cell)}
            />
            <span className={cell.cellError ? styles.showTooltipText : styles.hideTooltipText}>{cell.cellError}</span>
          </span>
        ))
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
  setCellErrorMessageAction: (tableName, uniqueRowId, columnName, error) => dispatch(setCellErrorMessage(tableName, uniqueRowId, columnName, error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextInputGridCell);
