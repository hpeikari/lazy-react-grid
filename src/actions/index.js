import getRowDataArray from './MOCK_DATA';

export const SET_BLOCK_INDEX = 'llama-grid/SET_BLOCK_INDEX';
export const FETCH_ROW_COUNT = 'llama-grid/FETCH_ROW_COUNT';
export const STORE_ROW_COUNT = 'llama-grid/STORE_ROW_COUNT';
export const FETCH_ROW_DATA = 'llama-grid/FETCH_ROW_DATA';
export const STORE_ROW_DATA = 'llama-grid/STORE_ROW_DATA';
export const STORE_COLUMN_DEFS = 'llama-grid/STORE_COLUMN_DEFS';
export const CHANGE_INPUT_VALUE = 'llama-grid/CHANGE_INPUT_VALUE';
export const SET_CELL_ERROR_MSG = 'llama-grid/SET_CELL_ERROR_MSG';
export const ADD_NEW_ROW = 'llama-grid/ADD_NEW_ROW';

export const TABLE_NAME = 'transportation'

const totalRowCount = 1000000; // for some reason it can't render properly if rowCount is greater than 1,342,200
const rowDataArray = getRowDataArray(TABLE_NAME, totalRowCount);

export const fetchRowData = (dispatch, tableName, rowIndexRange) => {
  const rowDataInRange = rowDataArray.data.slice(rowIndexRange.rowIdStart, rowIndexRange.rowIdEnd + 1);
  dispatch(storeColumnDefs(tableName, rowDataArray.columnDefs)); // TODO: set only once per table
  dispatch(storeRowData(tableName, rowDataInRange));
  return { type: FETCH_ROW_DATA }
};

export const addNewRow = (tableName , newRow) => ({
  type: ADD_NEW_ROW,
  tableName,
  newRow
});

export const storeColumnDefs = (tableName , colDefs) => ({
  type: STORE_COLUMN_DEFS,
  tableName,
  colDefs
});

export const storeRowData = (tableName, rowData) => ({
  type: STORE_ROW_DATA,
  tableName,
  rowData
});

export const fetchRowCount = (dispatch, tableName) => {
  const rowCount = rowDataArray.data.length;
  dispatch(storeRowCount(tableName, rowCount));
  return { type: FETCH_ROW_COUNT }
};

export const storeRowCount = (tableName, rowCount) => ({
  type: STORE_ROW_COUNT,
  tableName,
  rowCount
});

export const setBlockIndex = (tableName, blockIndex) => ({
  type: SET_BLOCK_INDEX,
  tableName,
  blockIndex
});

export const changeInputValue = (tableName, uniqueRowId, isPinned, columnName, value) => ({
  type: CHANGE_INPUT_VALUE,
  tableName,
  uniqueRowId,
  isPinned,
  columnName,
  value
});

export const setCellErrorMessage = (tableName, uniqueRowId, isPinned, columnName, error = null) => ({
  type: SET_CELL_ERROR_MSG,
  tableName,
  uniqueRowId,
  isPinned,
  columnName,
  error
});
