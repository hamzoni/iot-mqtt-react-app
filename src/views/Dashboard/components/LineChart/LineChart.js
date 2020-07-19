import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';


import { data, options } from './chart';
import Button from '@material-ui/core/Button';
import TemperatureApiService from '../../../../services/api/temperature.service';
import { setData, updateData } from '../../../../store/actions';
import TemperatureMqttService from '../../../../services/mqtt/temperature.service';

import moment from 'moment';

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

let LineChart = props => {
  const dispatch = useDispatch();

  const { labels, values, className } = props;

  const [dataState, setDataState] = useState(data);
  const [keyState, setKeyState] = useState(new Date().valueOf());


  const classes = useStyles();

  useEffect(() => {
    TemperatureApiService.getIndices(result => {
      dispatch(setData(result));
    });

    TemperatureMqttService.run(value => {
      dispatch(updateData(value));
    });
  }, [dispatch]);

  useEffect(() => {
    setLocalData(labels, values);
  }, [labels, values]);

  const setLocalData = (labels, values) => {
    const item = dataState;

    labels = labels.map(label => {
      return moment(new Date(label)).format('mm:ss');
    });

    item.labels = labels;
    item.datasets[0].data = values;
    setDataState(item);
    setKeyState(new Date().valueOf());
  };

  return (
    <Card
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

const mapStateToProps = state => ({
  labels: state.data.labels,
  values: state.data.values
});

LineChart = connect(mapStateToProps)(LineChart);
export default LineChart;
