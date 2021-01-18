import React from 'react'
import './Map.css'
import { Map as MapContainer, TileLayer } from 'react-leaflet'
import { showDataOnMap } from '../util';

function Map( { countries, casesType, center, zoom } ) {
    return (
        <div className='map'>
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreet'
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
