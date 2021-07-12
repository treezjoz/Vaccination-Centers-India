import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import {addWeeks} from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import Table from './Table';
import { useHistory } from "react-router-dom";

const Slots = ({ values }) => {
  return (
    <>
      {values.map((slot, idx) => {
        return (
          <span key={idx} className="badge">
            {slot}
          </span>
        );
      })}
    </>
  );
};

function Display() {
  const [state, setState] = useState(null);
  const [dist, setDist] = useState(null);
  const [state_list, setStateList] = useState({ states: [],});
  const [dist_list, setDistList] = useState({ districts: [],});
  const [center_list, setCenterList] = useState({ centers: [],});
  const [startDate, setStartDate] = useState(new Date());
  const history = useHistory();

  const apistat = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  const getStates = () => {
    axios.get(apistat)
    .then((response) =>  {
      setStateList(response.data);
    })}

  const handleStateChange = (obj) => {
    setState(obj);
    const apidist = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+obj.state_id;
    axios.get(apidist)
    .then((response) =>  {
      setDistList(response.data);})
    setDist(null);
    setCenterList(null);
  };

  const handleDistChange = (obj) => {
    setDist(obj);
    setCenterList(null);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    const datef=moment(date).format("DD-MM-yyyy");
    const apicent="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+dist.district_id+"&date="+datef;
    axios.get(apicent)
    .then((response) =>  {
      setCenterList(response.data);})
  };

  const renderTable = () => {
    if(state && dist && center_list){
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
            Header:"Min_Age",
            accessor:"sessions[0].min_age_limit"
          },
          {
            Header:"Vaccine",
            accessor:"sessions[0].vaccine"
          },
          {
            Header:"Dose1",
            accessor:"sessions[0].available_capacity_dose1"
          },
          {
            Header:"Dose2",
            accessor:"sessions[0].available_capacity_dose2"
          },
          {
            Header:"Slots",
            accessor:"sessions[0].slots",
            Cell: ({ cell: { value } }) => <Slots values={value} />
          },
        ]
      }
    ], []
  );

  function handleLogout() {
        sessionStorage.removeItem('token');
        history.push('/');
    }

  return (
    <div className="App">
      <button className="logout" onClick={() => handleLogout()}>Logout</button>
      <h1>Covid Vaccination Centers in India</h1>
      <div style={{ width: 400, marginBottom: 20 }}>
        <label>State</label>
        <Select
          placeholder="Select State"
          value={state}
          options={state_list.states}
          onChange={handleStateChange}
          getOptionLabel={x => x.state_name}
          getOptionValue={x => x.state_id}
        />
        <br />
        <label>District</label>
        <Select
          placeholder="Select District"
          value={dist}
          options={dist_list.districts}
          onChange={handleDistChange}
          getOptionLabel={x => x.district_name}
          getOptionValue={x => x.district_id}
        />
        <br />
        <label>Date</label>
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
      {renderTable()? (<Table columns={columns} data={center_list.centers}/>):<br/>}
    </div>
  );
}

export default Display;
