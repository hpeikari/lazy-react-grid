import { keyBy } from 'lodash';
import {
  STORE_ROW_COUNT,
  SET_BLOCK_INDEX,
  STORE_ROW_DATA,
  STORE_COLUMN_DEFS,
  CHANGE_INPUT_VALUE,
  SET_CELL_ERROR_MSG,
  ADD_NEW_ROW
} from '../actions';

export default (state = {}, action) => {
  const actionMap = {
    [ADD_NEW_ROW]: () => ({
      ...state,
      [action.tableName]: {
        ...state[action.tableName] || {},
        newRowData: (state[action.tableName].newRowData || []).concat(action.newRow)
      }
    }),

    [STORE_COLUMN_DEFS]: () => ({
      ...state,
      [action.tableName]: {
        ...state[action.tableName] || {},
        colDefs: keyBy(action.colDefs, 'columnName')
      }
    }),

    [STORE_ROW_DATA]: () => ({
      ...state,
      [action.tableName]: {
        ...state[action.tableName] || {},
        rowData: action.rowData
      }
    }),

    [STORE_ROW_COUNT]: () => ({
      ...state,
      [action.tableName]: {
        ...state[action.tableName] || {},
        rowCount: action.rowCount
      }
    }),

    [SET_BLOCK_INDEX]: () => ({
      ...state,
      [action.tableName]: {
        ...state[action.tableName] || {},
        blockIndex: action.blockIndex
      }
    }),

    [CHANGE_INPUT_VALUE]: () => {
      const rowDataSet = action.isPinned ? 'newRowData' : 'rowData';
      const changedRowIndex = state[action.tableName][rowDataSet].map((r, index) => (r.uniqueRowId == action.uniqueRowId) ? index : -1).find(n => n>=0);
      return ({
        ...state,
        [action.tableName]: {
          ...state[action.tableName] || {},
          [rowDataSet]: [
            ...(state[action.tableName][rowDataSet].map((row, idx) => (idx === changedRowIndex) ?
              { ...row,
                isChanged: true,
                [action.columnName]: action.value
              } : {...row }
            ))
          ]
        }
      })
    },

    [SET_CELL_ERROR_MSG]: () => {
      const rowDataSet = action.isPinned ? 'newRowData' : 'rowData';
      const changedRowIndex = state[action.tableName][rowDataSet].map((r, index) => (r.uniqueRowId == action.uniqueRowId) ? index : -1).find(n => n>=0);
      return ({
        ...state,
        [action.tableName]: {
          ...state[action.tableName] || {},
          [rowDataSet]: [
            ...(state[action.tableName][rowDataSet].map((row, idx) => (idx === changedRowIndex) ?
              { ...row,
               [`${action.columnName}_error`]: action.error
              } : {...row }
            ))
          ]
        }
      })
    }
  };

  return actionMap[action.type] ? actionMap[action.type]() : state;
};
