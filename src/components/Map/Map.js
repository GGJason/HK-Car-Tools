import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false
});

// Wrapper fills container so map can fit available white space
const Map = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', flex: 1 }}>
      <DynamicMap {...props} />
    </div>
  )
}

export default Map;