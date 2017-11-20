import { keyBy } from 'lodash';
import {
  STORE_ROW_COUNT,
  SET_BLOCK_INDEX,
  STORE_ROW_DATA,
  STORE_COLUMN_DEFS,
  CHANGE_INPUT_VALUE
} from '../actions';

export default (state = {}, action) => {
  const actionMap = {
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
      const changedRowIndex = state[action.tableName].rowData.map((r, index) => (r.uniqueRowId == action.uniqueRowId) ? index : -1).find(n => n>=0);
      return ({
        ...state,
        [action.tableName]: {
          ...state[action.tableName] || {},
          rowData: [
            ...(state[action.tableName].rowData.map((row, idx) => (idx === changedRowIndex) ? { ...row, isChanged: true, [action.columnName]: action.value } :  row ))
          ]
        }
      })
    }
  };

  return actionMap[action.type] ? actionMap[action.type]() : state;
};
