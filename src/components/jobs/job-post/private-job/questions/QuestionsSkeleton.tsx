import React from 'react'
import { Skeleton } from '@mui/material';

function QuestionsSkeleton(props: any) {


    //function


    return (
        <>
            <div
                id="questions_bx"
                className="job-bx bg-white m-b30"
            >
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <Skeleton animation="wave" height={50} width="100%" />
                    </div>
                    <div className="col-lg-12 col-md-12">

                    </div>
                    <div className="col-lg-12 col-md-12">
                        <Skeleton animation="wave" height={30} width="30%" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionsSkeleton