import { Skeleton } from '@mui/material'
import React from 'react'

function Prefill_Sk() {
    return (
        <div>
            <React.Fragment>
                <Skeleton variant="rectangular" width={'100%'} height={200} />
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
            </React.Fragment>
        </div>
    )
}

export default Prefill_Sk