import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';

import parkingLots1 from '/public/data/parkinglots/parkinglots1.json';

import styles from '@styles/Home.module.scss';


export default function Home() {

  let DEFAULT_CENTER = [22.3034464,114.1587892];
   let parkingLots= parkingLots1.results;

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


                  { parkingLots.map(ele=>
                  <Marker position={[
                      ele.latitude,
                     ele.longitude]}>
                      <Popup>{ele.park_Id},{ele.name}</Popup>
                  </Marker>
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
