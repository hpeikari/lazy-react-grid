export default (tableName, totalRowCount) => ({
  transportation: { // tableName
    columnDefs: [
      {
        allowsNull: false,
        baseTableName: null,
        columnName: 'someText',
        columnSize: 4,
        dataTypeName: 'nvarchar',
        defaultValue: 'default data',
        isKey: true,
        isReadOnly: true,
        isUnique: false,
        ordinal: 0,
        precision: 0,
        scale: 0
      }, {
        allowsNull: true,
        baseTableName: null,
        columnName: 'field2',
        columnSize: 4,
        dataTypeName: 'nvarchar',
        defaultValue: null,
        isKey: false,
        isReadOnly: false,
        isUnique: false,
        ordinal: 0,
        precision: 0,
        scale: 0
      }, {
        allowsNull: false,
        baseTableName: null,
        columnName: 'floatValue',
        columnSize: 4,
        dataTypeName: 'float',
        defaultValue: 'default',
        isKey: false,
        isReadOnly: true,
        isUnique: false,
        ordinal: 0,
        precision: 0,
        scale: 0
      }, {
        allowsNull: false,
        baseTableName: null,
        columnName: 'intField',
        columnSize: 4,
        dataTypeName: 'int',
        defaultValue: 10,
        isKey: false,
        isReadOnly: false,
        isUnique: false,
        ordinal: 0,
        precision: 0,
        scale: 0
      },
    ],
    data: new Array(totalRowCount).fill(0).map((n, i)=> ({
      uniqueRowId: i,
      someText: 'unique row id - ' + i,
      field2: 'filed two - ' + (i * 4),
      floatValue: (i / 6),
      intField: i
    }))
  }
})[tableName];
