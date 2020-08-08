import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import React, { useEffect, useMemo, useState } from 'react';
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
  getMoistureRecords,
  getTemperatureRecords,
  listAllBoards,
  listAllPins, onMoistureChange,
  onTemperatureChange,
  registerPin,
  removePin,
  updatePinValue
} from '../../../../store/actions/index.action';
import MonitorMqttService from '../../../../services/mqtt/monitor.service';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { PinDto } from '../../../../dtos/pin.dto';
import { PinStatus, PinType } from '../../../../consts/pin.const';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import PinControlMqttService from '../../../../services/mqtt/pin-control.service';
import MqttTopics from '../../../../services/mqtt/topics.const';
import { cloneDeep } from 'lodash';

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

  const { className } = props;

  const [temperatureValues, setTemperatureValues] = useState(cloneDeep(data));
  const [temperatureTimestamp, setTemperatureTimestamp] = useState(new Date().valueOf());

  const [moistureValues, setMoistureValues] = useState(cloneDeep(data));
  const [moistureTimestamp, setMoistureTimestamp] = useState(new Date().valueOf());

  const [boardName, setBoardName] = useState('raspberry.pi.fsb');
  const [pin, setPin] = useState({});
  const [pinName, setPinName] = useState(new Date().valueOf() + '');
  const [pinType, setPinType] = useState(PinType.DIGITAL);
  const [pinValue, setPinValue] = useState({});
  const [activeBoard, setActiveBoard] = useState(null);

  const [monitorService, setMonitorService] = useState(null);
  const pinControlService = new PinControlMqttService();

  const classes = useStyles();

  const parseRecords = (records, currentValues, callback) => {
    let { labels, values } = records;
    if (!labels || !values) {
      return;
    }
    const timestamp = new Date().valueOf();
    const newValues = currentValues;

    labels = labels.map(label => {
      return moment(new Date(label)).format('mm:ss');
    });

    newValues.labels = labels;
    newValues.datasets[0].data = values;

    callback(newValues, timestamp);
  };

  const onRegisterPin = () => {
    const dto = new PinDto();
    dto.pinName = pinName;
    dto.boardName = boardName;
    dto.pinType = pinType;

    props.registerPin(dto);
  };

  useEffect(() => {
    parseRecords(props.temperature, temperatureValues, (newValues, timestamp) => {
      setTemperatureValues(newValues);
      setTemperatureTimestamp(timestamp);
    });
  }, [props.temperature]);

  useEffect(() => {
    parseRecords(props.moisture, moistureValues, (newValues, timestamp) => {
      setMoistureValues(newValues);
      setMoistureTimestamp(timestamp);
    });
  }, [props.moisture]);

  useEffect(() => {


    // get pin records
    props.listAllPins();
    props.listAllBoards();

    return () => {
      if (monitorService) {
        monitorService.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!activeBoard) {
      return;
    }

    // get monitor records
    props.getTemperatureRecords(activeBoard);
    props.getMoistureRecords(activeBoard);
  }, [activeBoard]);

  useEffect(() => {
    if (!props.boards) {
      return;
    }

    // set default board
    setActiveBoard(props.boards[0]);
    
    if (monitorService) {
      monitorService.stop();
    }
    const service = new MonitorMqttService(props.boards);
    setMonitorService(service);
  }, [props.boards]);

  useEffect(() => {
    if (monitorService) {
      monitorService.subscribe(props.onTemperatureChange, MqttTopics.TEMPERATURE_CHANGE);
      monitorService.subscribe(props.onMoistureChange, MqttTopics.MOISTURE_CHANGE);
    }
  }, [monitorService]);

  useEffect(() => {
    if (activeBoard) {
      monitorService.setActiveBoard(activeBoard);
    }
  }, [activeBoard]);

  useMemo(() => {
    props.updatePinValue({
      pin, value: pinValue.value
    });
    pinControlService.setValue(pinValue);
  }, [pinValue.value]);

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Select
            value={activeBoard ? activeBoard : ''}
            onChange={e => setActiveBoard(e.target.value)}
          >
            {(props.boards && props.boards.map(board => {
                return board ?
                  <MenuItem value={board} key={board}>
                    {board}
                  </MenuItem> : '';
              }
            ))}
          </Select>
        }
        title="Temperature Monitor"
      />
      <Divider/>

      <CardContent>
        <div className={classes.chartContainer}>
          <Line
            key={temperatureTimestamp + '_temperature'}
            data={temperatureValues}
            options={options}
          />
        </div>

        <div className={classes.chartContainer}>
          <Line
            key={moistureTimestamp + '_moisture'}
            data={moistureValues}
            options={options}
          />
        </div>

        <form noValidate autoComplete="off" className={'d-flex align-items-center mt-3'}>
          <TextField label="Board name" className={'mr-3'} value={boardName}
                     onChange={e => setBoardName(e.target.value)}/>
          <TextField label="Pin name" className={'mr-3'} value={pinName} onChange={e => setPinName(e.target.value)}/>

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
          <div className={'col-md-12 mb-3'} key={boardName}>
            <Typography variant="h5" component="h2">
              {boardName}
            </Typography>

            <Grid container spacing={3}>
              {props.pins[boardName].map((pin, j) =>
                <Grid item xs={6} sm={3} key={pin.pin_name + '-' + j}>
                  <Paper className={'p-2 mt-2'}>
                    <Typography variant="body2" component="p">
                      {pin.pin_name}
                    </Typography>

                    {
                      pin.type === PinType.DIGITAL ?
                        <Switch
                          checked={pin.digital_value === PinStatus.ON}
                          onChange={(e, value) => props.updatePinValue({
                            pin, value: value ? PinStatus.ON : PinStatus.OFF
                          })}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        /> :
                        <Slider
                          defaultValue={pin.analog_value}
                          valueLabelDisplay="auto"
                          onChange={(e, value) => {
                            setPin(pin);
                            setPinValue({ board_name: boardName, pin_name: pin.pin_name, value });
                          }}
                          step={1}
                          marks
                          min={0}
                          max={100}
                        />
                    }

                    <Button variant="contained" color="secondary" onClick={e => {
                      props.removePin({
                        boardName,
                        pinName: pin.pin_name
                      });
                    }}>
                      Delete
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </div>
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
  getMoistureRecords,
  onMoistureChange,
  listAllBoards,
  listAllPins,
  registerPin,
  removePin,
  updatePinValue
};

const mapStateToProps = state => {
  const { pins, boards } = state.signal;
  return {
    pins, boards,
    temperature: state.monitor.temperature,
    moisture: state.monitor.moisture
  };
};

TemperatureMonitorChart = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemperatureMonitorChart);
export default TemperatureMonitorChart;
