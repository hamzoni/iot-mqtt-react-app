import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { connect } from 'react-redux'

import axios from 'axios';

import { data, options } from './chart';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const temperature_topic = 'IOT_TEMPERATURE_TOPIC';

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:8883');

client.on('connect', function() {
  client.subscribe(temperature_topic, function(err) {
    console.log(err ? err : `Subscribe to topic ${temperature_topic} success`);
  });
});


const LineChart = props => {
  const { className, ...rest } = props;

  const [dataState, setDataState] = useState(data);
  const [keyState, setKeyState] = useState(new Date().valueOf());

  const classes = useStyles();

  // client.on('message', function(topic, message) {
  //   message = message.toString();
  //
  //   if (topic === temperature_topic) {
  //     message = parseInt(message);
  //
  //     let item = dataState;
  //     item.labels.splice(0, 1);
  //     item.labels.push(new Date());
  //
  //     item.datasets[0].data.splice(0, 1);
  //     item.datasets[0].data.push(message);
  //
  //     console.log(item);
  //
  //     setKeyState(new Date().valueOf());
  //     setDataState(item);
  //   }
  // });


  // const url = `http://localhost:9000/`;
  // axios.get(url).then(response => {
  //   const results = response.data.results;
  //
  //   const labels = results.map(result => result.created_at).map(item => new Date(item * 1000));
  //   const values = results.map(result => result.value).map(item => parseFloat(item));
  //
  //
  //   let item = data;
  //   item.labels = labels;
  //   item.datasets[0].data = values;
  //
  //   setDataState(item);
  // });

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Button
            size="small"
            variant="text"
          >
            Last 7 days <ArrowDropDownIcon/>
          </Button>
        }
        title="Temperature Monitor"
      />
      <Divider/>

      <CardContent>
        <div className={classes.chartContainer}>
          <Line
            key={keyState}
            data={dataState}
            options={options}
          />
        </div>
      </CardContent>

    </Card>
  );
};

LineChart.propTypes = {
  className: PropTypes.string
};


const mapStateToProps = (state /*, ownProps*/) => {
  return {
    counter: state.counter
  }
};

export default LineChart;
