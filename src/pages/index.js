import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import { clarity } from 'react-microsoft-clarity';

import { API_BASE_URL } from '@config';
import parkingLots1 from '/public/data/parkinglots/parkinglots1.json';

import styles from '@styles/Home.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Home() {

  let DEFAULT_CENTER = [22.3034464, 114.1587892];
  let parkingLots = parkingLots1.results;
  const [data, setData] = useState({});
  const [apiParkingLots, setApiParkingLots] = useState([]);


  useEffect(() => {
    clarity.init("l7qjbmali9");
    if (Object.keys(data).length === 0) {
      axios.get("https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy&lang=zh_TW")
        .then((response) => {
          const mapData = response.data.results.map(m => [m.park_Id, m]);
          setData(Object.fromEntries(mapData));
        });
    }
    const vacancyTimer = setTimeout(() => {
      axios.get("https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy&lang=zh_TW")
        .then((response) => {
          const mapData = response.data.results.map(m => [m.park_Id, m]);
          setData(Object.fromEntries(mapData));
        });
    }, 10000);
    return () => clearTimeout(vacancyTimer);
  }, [data]);

  useEffect(() => {
    const PAGE_SIZE = 100;
    let page = 1;
    const all = [];

    const fetchPage = () => {
      axios.get(`${API_BASE_URL}/parkingLots/`, { params: { page, limit: PAGE_SIZE } })
        .then((response) => {
          const list = Array.isArray(response.data) ? response.data : [];
          all.push(...list);
          if (list.length >= PAGE_SIZE) {
            page += 1;
            fetchPage();
          } else {
            setApiParkingLots(all);
          }
        })
        .catch(() => setApiParkingLots(all.length ? all : []));
    };

    fetchPage();
  }, []);

  

  return (
    <Layout>
      <Head>
        <title>Hong Kong Car Tools</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <div className={styles.mapWrapper}>
          <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={17}>
            {({ TileLayer, Marker, Popup, LayerGroup, CircleMarker }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                {/* Layer 1: local parking lots with vacancy */}
                {parkingLots
                  .filter(f => f.opening_status === "OPEN")
                  .map(ele => {
                    const vacancy = data[ele.park_Id];
                    return (
                      <Marker key={ele.park_Id} position={[ele.latitude, ele.longitude]}>
                        <Popup>
                          <div>{ele.park_Id},{ele.name}</div>
                          <div>私家車:{vacancy?.privateCar ? vacancy.privateCar[0].vacancy : ""}/{ele.privateCar?.space}</div>
                          {ele.LGV?.space > 0 ? <div>LGV:{vacancy?.LGV ? vacancy.LGV[0].vacancy : ""}/{ele.LGV?.space}</div> : ""}
                          {ele.HGV?.space > 0 ? <div>HGV:{vacancy?.HGV ? vacancy.HGV[0].vacancy : ""}/{ele.HGV?.space}</div> : ""}
                          {ele.motorCycle?.space > 0 ? <div>電單車:{vacancy?.motorCycle ? vacancy.motorCycle[0].vacancy : ""}/{ele.motorCycle?.space}</div> : ""}
                        </Popup>
                      </Marker>
                    );
                  })}

                {/* Layer 2: API parking lots (hkcartools-api) – red */}
                <LayerGroup>
                  {apiParkingLots
                    .filter(lot => lot.latitude != null && lot.longitude != null)
                    .map(lot => (
                      <CircleMarker
                        key={lot.park_id}
                        center={[lot.latitude, lot.longitude]}
                        pathOptions={{ color: '#c00', fillColor: '#c00', fillOpacity: 0.8, weight: 2, radius: 6 }}
                      >
                        <Popup>
                          <div><strong>{lot.name_tc || lot.name_en}</strong></div>
                          <div>{lot.displayAddress_tc || lot.displayAddress_en}</div>
                          {lot.opening_status != null && <div>狀態: {lot.opening_status}</div>}
                        </Popup>
                      </CircleMarker>
                    ))}
                </LayerGroup>
              </>
            )}
          </Map>
          </div>
        </Container>
      </Section>
    </Layout>
  )
}
