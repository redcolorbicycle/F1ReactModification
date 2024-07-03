import React, { useState, useEffect } from 'react';
import './App.css';
import SearchIcon from './search.svg';
import DriverCard from './DriverCard';

const API_URL = "https://ergast.com/api/f1/drivers";
const API_JSON_CONVERTER = ".json?limit=100000";

const App = () => {

    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const searchDrivers = async (name) => {
        const response = await fetch(`${API_URL}${API_JSON_CONVERTER}`);
        const data = await response.json();
        const matchingDrivers = [];
        data.MRData.DriverTable.Drivers.forEach((entry) => {
            if (entry.givenName.toLowerCase().includes(name.toLowerCase())
                || entry.familyName.toLowerCase().includes(name.toLowerCase())
                    || entry.driverId.toLowerCase().includes(name.toLowerCase())) {
                matchingDrivers.push(entry);
            }
        });
        setDrivers(matchingDrivers);
    }

    useEffect(() => {
        searchDrivers("Leclerc");
    }, []);

    return (
        <div className="app">
            <h1>NeedForSpeed</h1>

            <div className="search">
                <input
                    placeholder="Search for drivers"
                    value = {searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img
                    src={SearchIcon}
                    alt="search"
                    onClick={() => searchDrivers(searchTerm.toLowerCase())}
                />
            </div>

            {
                drivers?.length > 0
                    ? (
                    <div className="container">
                        {drivers.map((driver) => (
                            <DriverCard driver = {driver} />
                            ))}
                    </div>
                    ):(
                        <div className = "empty">
                            <h2>No drivers found</h2>
                        </div>
                    )
            }
        </div>


    );
};

export default App;
