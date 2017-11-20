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
          rowHeight={25}
          headerHeight={40}
          cellWidth={150}
          blockRowSize={100}
        >
        </Grid>
      </div>
    );
  }
}

export default connect(null, null)(App);
