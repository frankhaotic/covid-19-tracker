import React from 'react'
import './Infobox.css'
import { Card, CardContent, Typography } from '@material-ui/core'

function Infobox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card onClick={props.onClick}
        className={`infobox ${active && 'infobox--selected'} ${isRed && 'infobox--red'}`}>
            <CardContent>
                {/* Title */}
                <Typography className='infobox__title' color='textSecondary'>{title}</Typography>
                
                {/* Number of Cases */}
                <h2 className={`infobox__cases ${!isRed && 'infobox__cases--green'}`}>{cases}</h2>
                
                {/* Total */}
                <Typography className='infobox__total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
