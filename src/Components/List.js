import React, { useEffect, useState } from "react";
import axios from "axios";

const List = () => {
    const [bikeData, setBikeData] = useState(null);
    const [stationInfo, setStationInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const instance = axios.create({
            headers: {
                'Client-Identifier': 'tamaras-bysykkel',
            },
        });
        const fetchData = async () => {
            try {
                const [statusResponse, infoResponse] = await Promise.all([
                    axios.get("/oslobysykkel.no/station_status.json"),
                    axios.get("/oslobysykkel.no/station_information.json"),
                    console.log("fetch!")
                ]);

                setBikeData(statusResponse.data.data);
                setStationInfo(infoResponse.data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 10000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const stationNameMap = {};
    if (stationInfo) {
        stationInfo.stations.forEach((station) => {
            stationNameMap[station.station_id] = station.name;
        });
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!bikeData || !stationInfo) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <header>
                <h1>Oslo Bysykkel</h1>
                <h2>Oversikt over ledige sykler og låser</h2>
            </header>
            <table>
                <thead>
                <tr>
                    <th>Sted</th>
                    <th>Antall Sykler</th>
                    <th>Antall Låser</th>
                </tr>
                </thead>
                <tbody>
                {bikeData.stations.map((station) => (
                    <tr key={station.station_id}>
                        <td>{stationNameMap[station.station_id]}</td>
                        <td>{station.num_bikes_available}</td>
                        <td>{station.num_docks_available}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default List;
