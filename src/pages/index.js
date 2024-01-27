import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';

import parkingLots1 from '/public/data/parkinglots/parkinglots1.json';

import styles from '@styles/Home.module.scss';
import {
  useEffect, useState,setState
} from 'react';
import axios from 'axios';


export default function Home() {

  let DEFAULT_CENTER = [22.3034464, 114.1587892];
  let parkingLots = parkingLots1.results;
  const [data,setData] = useState({});


  useEffect(() => {
    if(Object.keys(data).length == 0){
      axios.get("https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy&lang=zh_TW")
      .then((response) => {
        console.log(response.data)
        var mapData = response.data.results.map(m => [m.park_Id, m]);
        var processedData = Object.fromEntries(mapData);

        console.log(processedData)
        setData( processedData);

      })
    }
    setTimeout(()=>{

      axios.get("https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy&lang=zh_TW")
      .then((response) => {
        console.log(response.data)
        var mapData = response.data.results.map(m => [m.park_Id, m]);
        var processedData = Object.fromEntries(mapData);

        console.log(processedData)
        setData( processedData);

      })

    },10000)
  }, [data]);

  

  return (
    <Layout>
      <Head>
        <title>Hong Kong Car Tools</title>
        <meta name="description" content="Create mapping apps with Next.js Leaflet Starter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>

          <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={17}>
            {({ TileLayer, Marker, Popup }) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />


                  { parkingLots
                  .filter(f=>f.opening_status=="OPEN")
                  //.filter(f=>f.HGV?.space>0)
                  //.filter(f=>f.LGV?.space>0)
                  //.filter(f=>f.motorCycle?.space>0)
                  .map(ele=>{
                  let vacancy = data[ele.park_Id];
                  return (<Marker position={[
                      ele.latitude,
                     ele.longitude]}>
                      <Popup>
                        <div>{ele.park_Id},{ele.name}</div>
                        <div>私家車:{vacancy?.privateCar?vacancy.privateCar[0].vacancy:""}/{ele.privateCar?.space}</div>
                        {ele.LGV?.space > 0 ?<div>LGV:{vacancy?.LGV?vacancy.LGV[0].vacancy:""}/{ele.LGV?.space}</div>:""}
                        {ele.HGV?.space > 0 ?<div>HGV:{vacancy?.HGV?vacancy.HGV[0].vacancy:""}/{ele.HGV?.space}</div>:""}
                        {ele.motorCycle?.space > 0 ?(<div>電單車:{vacancy?.motorCycle?vacancy.motorCycle[0].vacancy:""}/{ele.motorCycle?.space }</div>):""}
                        
                      </Popup>
                  </Marker>)}
                  )
                  }
              </>
            )}
          </Map>


        </Container>
      </Section>
    </Layout>
  )
}
