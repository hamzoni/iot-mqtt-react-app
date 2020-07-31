import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';

import { data, options } from './chart';
import Button from '@material-ui/core/Button';

import moment from 'moment';
import {
  getTemperatureRecords,
  listAllPins,
  onTemperatureChange,
  registerPin
} from '../../../../store/actions/index.action';
import TemperatureMqttService from '../../../../services/mqtt/temperature.service';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { PinDto } from '../../../../dtos/pin.dto';
import { PinType } from '../../../../consts/pin.const';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

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

let TemperatureMonitorChart = props => {

  const { labels, values, className } = props;

  const [dataState, setDataState] = useState(data);
  const [keyState, setKeyState] = useState(new Date().valueOf());

  const [boardName, setBoardName] = useState('');
  const [pinName, setPinName] = useState('');
  const [pinType, setPinType] = useState(PinType.DIGITAL);

  const service = new TemperatureMqttService();


  const classes = useStyles();

  useEffect(() => {
    setLocalData(labels, values);
  }, [labels, values]);

  const setLocalData = (labels, values) => {
    if (!labels || !values) {
      return;
    }

    const item = dataState;

    labels = labels.map(label => {
      return moment(new Date(label)).format('mm:ss');
    });

    item.labels = labels;
    item.datasets[0].data = values;
    setDataState(item);
    setKeyState(new Date().valueOf());
  };

  const onRegisterPin = () => {
    const dto = new PinDto();
    dto.pinName = pinName;
    dto.boardName = boardName;
    dto.pinType = pinType;

    props.registerPin(dto);
  };

  useEffect(() => {
    props.getTemperatureRecords();
    props.listAllPins();

    service.start((result) => {
      props.onTemperatureChange(result);
    });

    return () => {
      service.stop();
    };
  }, []);

  useEffect(() => {
    console.log(props.pins);
  }, [props.pins]);

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

        <form noValidate autoComplete="off" className={'d-flex align-items-center mt-3'}>
          <TextField label="Board name" className={'mr-3'} onChange={e => setBoardName(e.target.value)}/>
          <TextField label="Pin name" className={'mr-3'} onChange={e => setPinName(e.target.value)}/>

          <FormControl className={'mr-3'}>
            <InputLabel id="pinType">Pin type</InputLabel>
            <Select
              labelId="pinType"
              id="pinType"
              value={pinType}
              onChange={e => setPinType(e.target.value)}
            >
              <MenuItem value={PinType.DIGITAL}>
                {PinType.DIGITAL}
              </MenuItem>
              <MenuItem value={PinType.ANALOG}>
                {PinType.ANALOG}
              </MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={onRegisterPin}>
            Register Pin
          </Button>
        </form>

      </CardContent>


      <div className={'row p-3'}>
        {props.pins && Object.keys(props.pins).map((boardName, i) =>
          <>
            <div className={'col-md-12 mb-3'}>
              <Typography variant="h5" component="h2">
                {boardName}
              </Typography>

              <Grid container spacing={3}>
                {props.pins[boardName].map((pin, j) =>
                  <Grid item xs={6} sm={3}>
                    <Paper className={'p-2 mt-2'}>
                      <Typography variant="body2" component="p">
                        {pin.pin_name}
                      </Typography>

                      <Slider
                        defaultValue={30}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                      />

                      <Switch
                        checked={true}
                        // onChange={}
                        // name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </div>
          </>
        )}
      </div>

    </Card>
  );
};

TemperatureMonitorChart.propTypes = {
  className: PropTypes.string
};


const mapDispatchToProps = {
  getTemperatureRecords,
  onTemperatureChange,
  listAllPins,
  registerPin
};

const mapStateToProps = state => {
  const { labels, values } = state.monitor.temperature;
  const pins = state.signal.pins;

  return {
    labels, values, pins
  };
};

TemperatureMonitorChart = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemperatureMonitorChart);
export default TemperatureMonitorChart;
