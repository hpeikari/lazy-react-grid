import React from 'react';
import { connect } from 'react-redux';
import styles from './index.scss';
import { isNumeric } from '../utils';
import { TABLE_NAME, changeInputValue, setCellErrorMessage } from '../actions';

const TextInputCell = (props) => {

  const validate = (val, cellData) => {
    const value = val.trim();
    let error = null;
    if (!cellData.cellColumnDef.allowsNull && !!value && !value.length) {
      error = 'This field is required.';
    } else if (value.length > cellData.cellColumnDef.columnSize) {
      error = 'The entered value is too long.';
    } else if (['float', 'int'].indexOf(cellData.cellColumnDef.dataTypeName) > 0 && !isNumeric(value)) {
      error = 'Enter a numeric value.';
    }

    // dispatch only if error has changed
    if (cellData.cellError !== error) {
      props.setCellErrorMessageAction(TABLE_NAME, props.uniqueRowId, props.isPinned, cellData.cellColumnName, error);
    }
  };


  const handleClick = (value, cellData) => {
    validate(value, cellData);
  }


  // TODO: implement a debounce
  const handleChange = (value, cellData) => {
    validate(value, cellData);
    props.changeInputValueAction(TABLE_NAME, props.uniqueRowId, props.isPinned, cellData.cellColumnName, value);
  };

  const inlineStyles = {
    cellStyle: {
      height: props.rowHeight,
      width: props.cellWidth
    }
  };

//    console.log('render <TextInputCell>')
  return (
    <span
      key={`cellData-${props.uniqueRowId}-{${props.cellData.cellColumnName}`}
      className={styles.tooltip}
    >
      <input
        value={props.cellData.cellValue}
        placeholder='null'
        disabled={props.cellData.cellColumnDef.isReadOnly}
        type={props.cellData.cellColumnDef.dataTypeName === 'int' ? 'int' : 'text'}
        style={inlineStyles.cellStyle}
        maxLength={props.cellData.cellColumnDef.columnSize}
        className={[
          styles.gridCell,
          !props.cellData.cellError && props.isPinned ? styles.pinnedTopCell : '',
          props.cellData.cellError ? styles.errorStyles : '',
          props.cellData.cellColumnDef.isReadOnly ? styles.readOnly : ''
        ].join(' ')}
        onClick={e => handleClick(e.target.value, props.cellData)}
        onChange={e => handleChange(e.target.value, props.cellData)}
      />
      <span className={props.cellData.cellError ? styles.showTooltipText : styles.hideTooltipText}>{props.cellData.cellError}</span>
    </span>
  )
};

const mapStateToProps = ({grid}, props) => {
  const rowDataSet = props.isPinned ? 'newRowData' : 'rowData';

  return {
    row: (grid[TABLE_NAME] && grid[TABLE_NAME][rowDataSet] && grid[TABLE_NAME][rowDataSet].find(r => r.uniqueRowId === props.uniqueRowId)) || []
  }
};

const mapDispatchToProps = dispatch => ({
  changeInputValueAction: (tableName, uniqueRowId, isPinned, columnName, value) => dispatch(changeInputValue(tableName, uniqueRowId, isPinned, columnName, value)),
  setCellErrorMessageAction: (tableName, uniqueRowId, isPinned, columnName, error) => dispatch(setCellErrorMessage(tableName, uniqueRowId, isPinned, columnName, error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextInputCell);
