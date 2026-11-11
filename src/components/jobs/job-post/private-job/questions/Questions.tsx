import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import AddQuestionModal from './AddQuestionModal';

function Questions(props: any) {
  // state variables
  const [showQuestionModal,setShowQuestionModal]=useState(false);

  //function
  const handleOpenQuestionModal=()=>{
    setShowQuestionModal(!showQuestionModal);
  }

  return (
    <>
    <div
      id="questions_bx"
      className="job-bx bg-white m-b30"
    >
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <span>Ask questions to candidates they should respond to when they are applying</span><br/>
          <span>Here are a few suggestions to get you started</span>
        </div>
        <div className="col-lg-12 col-md-12">

        </div>
        <div className="col-lg-12 col-md-12">
          <Link to={''} onClick={handleOpenQuestionModal}>Add Questions</Link>
        </div>
      </div>
    </div>
    <AddQuestionModal showModal={showQuestionModal} toggleModal={handleOpenQuestionModal} formik={props}/>
    </>
  )
}

export default Questions