import React from 'react';
import { useState, useEffect } from 'react';

const API_URL = "https://ergast.com/api/f1/drivers";
const API_JSON_CONVERTER = ".json?limit=100000";
const RACE_WIN_URL = "/results/1";
const PODIUM_URL_TWO = "/results/2";
const PODIUM_URL_THREE = "/results/3";
const CHAMPIONSHIP_URL = "/driverStandings/1"
const PIC_URL = "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=pageimages&piprop=original&titles=";


const DriverCard = ({ driver }) => {

    const [imageUrl, setImageUrl] = useState('');
    const [driverPodiums, setDriverPodiums] = useState(0);
    const [driverWins, setDriverWins] = useState('');
    const [driverChampionships, setDriverChampionships] = useState('');
    const articleUrl = driver.url;
    const pageTitle = articleUrl.substring(articleUrl.lastIndexOf("/") + 1);
    const urlToVisit = PIC_URL + pageTitle;
    console.log(driver); //visiting this gives you and object that contains the source img url

    const searchDrivers = async () => {

        const response = await fetch(`${urlToVisit}`);
        const data = await response.json();
        console.log(data.query.pages[0]);

        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0]; // Get the first (and only) page ID
        const mainImageUrl = pages[pageId]?.original?.source;

        setImageUrl(mainImageUrl); // Set the state with the main image URL
    }

    const searchDriverPodiums = async () => {
        const response = await fetch(`${API_URL}/${driver.driverId}
            ${RACE_WIN_URL}${API_JSON_CONVERTER}`);
        const data = await response.json();
        const wins = parseInt(data.MRData.total, 10);
        const response2 = await fetch(`${API_URL}/${driver.driverId}
            ${PODIUM_URL_TWO}${API_JSON_CONVERTER}`);
        const data2 = await response2.json();
        const ptwo = parseInt(data2.MRData.total, 10);
        const response3 = await fetch(`${API_URL}/${driver.driverId}
            ${PODIUM_URL_THREE}${API_JSON_CONVERTER}`);
        const data3 = await response3.json();
        const pthree = parseInt(data3.MRData.total, 10);
        const total = wins + ptwo + pthree;
        setDriverPodiums(total);
    }
    const searchDriverWins = async () => {
        const response = await fetch(`${API_URL}/${driver.driverId}
            ${RACE_WIN_URL}${API_JSON_CONVERTER}`);
        const data = await response.json();
        setDriverWins(data.MRData.total);
    }

    const searchDriverChampionships = async () => {
        const response = await fetch(`${API_URL}/${driver.driverId}
            ${CHAMPIONSHIP_URL}${API_JSON_CONVERTER}`);
        const data = await response.json();
        setDriverChampionships(data.MRData.total);
    }

    useEffect(() => {
        searchDrivers();
        searchDriverWins();
        searchDriverChampionships();

    }, [driver]);


        return (
            <div className="driver">
                <div>
                    <p>{driver.givenName} {driver.familyName}</p>
                </div>
                <div>
                    <img src={imageUrl || `https://via.placeholder.com/400?text=${driver.givenName} ${driver.familyName}`}
                         alt={driver.givenName}/>
                </div>

                <div>
                    <span>Podiums: {driverPodiums}              </span>
                    <span>Wins: {driverWins}</span>
                    <h3>Championships: {driverChampionships}</h3>
                </div>
            </div>
        )
}
export default DriverCard;