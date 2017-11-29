import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Grid from './Grid';
import styles from './index.scss';

class App extends Component {
  render() {
    return (
      <div className={styles.tmpContainer}>
        Demo for LLama-Grid:
        <Grid
          headerHeight={40}
          rowHeight={25}
          btnHeight={20}
          cellWidth={200}
          blockRowSize={50}
          className={styles.gridClass}
        >
        </Grid>
      </div>
    );
  }
}

export default connect(null, null)(App);
