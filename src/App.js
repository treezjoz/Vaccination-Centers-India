import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import {addWeeks} from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Table from './Table';
import './App.css'

function App() {
  const [state, setState] = useState(null);
  const [dist, setDist] = useState(null);
  const [datas, setDatas] = useState({ states: [],});
  const [datad, setDatad] = useState({ districts: [],});
  const [datac, setDatac] = useState({ centers: [],});
  const [startDate, setStartDate] = useState(new Date());

  const apistat = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  const getStates = () => {
    axios.get(apistat)
    .then((response) =>  {
      setDatas(response.data);
    })}

  const handleStateChange = (obj) => {
    setState(obj);
    const apidist = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+obj.state_id;
    axios.get(apidist)
    .then((response) =>  {
      setDatad(response.data);})
    setDist(null);
    setDatac(null);
  };

  const handleDistChange = (obj) => {
    setDist(obj);
    setDatac(null);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    const datef=moment(date).format("DD-MM-yyyy");
    const apicent="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+dist.district_id+"&date="+datef;
    axios.get(apicent)
    .then((response) =>  {
      setDatac(response.data);})
  };

  const renderTable = () => {
    if(state && dist && datac){
      return true;
    }
    else{
      return false;
    }
  }

  useEffect(() =>{
    getStates();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "",
        isVisible: false,
        id: 'centers',
        columns: [
          {
            Header:"Center Name",
            accessor:"name"
          },
          {
            Header:"Address",
            accessor:"address"
          },
          {
            Header:"Block",
            accessor:"block_name"
          },
          {
            Header:"Fee",
            accessor:"fee_type"
          },
          {
            Header:"Date",
            accessor:"sessions[0].date"
          },
          {
            Header:"Min_Age",
            accessor:"sessions[0].min_age_limit"
          },
          {
            Header:"Vaccine",
            accessor:"sessions[0].vaccine"
          },
          {
            Header:"Avail_Dose1",
            accessor:"sessions[0].available_capacity_dose1"
          },
          {
            Header:"Avail_Dose2",
            accessor:"sessions[0].available_capacity_dose2"
          },
        ]
      }
    ], []
  );

  return (
    <div className="App">
      <h1>Covid Vaccination Centres in India</h1>
      <div style={{ width: 400, marginBottom: 20 }}>
        <b>State</b>
        <Select
          placeholder="Select State"
          value={state}
          options={datas.states}
          onChange={handleStateChange}
          getOptionLabel={x => x.state_name}
          getOptionValue={x => x.state_id}
        />
        <br />
        <b>District</b>
        <Select
          placeholder="Select District"
          value={dist}
          options={datad.districts}
          onChange={handleDistChange}
          getOptionLabel={x => x.district_name}
          getOptionValue={x => x.district_id}
        />
        <br />
        <b>Date</b>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          minDate={new Date()}
          maxDate={addWeeks(new Date(), 1)}
          dateFormat="d-MM-yyyy"
          showDisabledMonthNavigation
        />
        <br /><br />
      </div>
      {renderTable()? (<Table columns={columns} data={datac.centers}/>):<br/>}
    </div>
  );
}

export default App;
