import './App.css';
import { useState, useEffect } from 'react';
import { 
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent 
} from '@material-ui/core'
import 'leaflet/dist/leaflet.css'

// Custom Components
import Infobox from './components/Infobox';
import Map from './components/Map'
import Table from './components/Table'
import LineGraph from './components/LineGraph'

// Custom Utilities
import { sortData, prettyPrintStat } from './util'

function App() {

  // APP STATE
  const [countries, setCountries] = useState([]) 
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] =
    useState({ lat: 53.9721878859506, lng: -5.389461916417646 })
  const [mapZoom, setMapZoom] = useState(4)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')



  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      const data = await fetch('https://disease.sh/v3/covid-19/countries');
      const response = await data.json();
      const countries = response.map((country) => {
        return {
          name: country.country,
          value: country.countryInfo.iso2
        }});

        const sortedData = sortData(response);
        setTableData(sortedData);
        setMapCountries(response);
        setCountries(countries);
    }

    getCountriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide'
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    const response = await fetch(url);
    const data = await response.json();
    setCountry(countryCode);
    setCountryInfo(data);
    setMapCenter([data.countryInfo.lat, data.countryInfo.long])
    console.log("data", data.countryInfo.lat);
    console.log("data", data.countryInfo.long);
    setMapZoom(5);
  }

  console.log(countryInfo);

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => 
                <MenuItem value={country.value}>{country.name}</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
      
        <div className='app__stats'>
          <Infobox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')} 
            title='Coronavirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}/>
          <Infobox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')} 
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}/>
          <Infobox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')} 
            title='Deaths' 
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom} />

      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
