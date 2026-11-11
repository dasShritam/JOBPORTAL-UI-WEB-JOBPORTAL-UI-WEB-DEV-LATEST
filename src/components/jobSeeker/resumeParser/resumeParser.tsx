import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Link, useNavigate } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import logo2 from "../../../assets/images/Techkri-logo-blue.png";
import {
  Box,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import Employment from "./employement";
import LastStep from "./lastStep";
import { useSelector } from "react-redux";
import RPEducation from "./education";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ResumeParser() {
  const [step, setStep] = useState([
    {
      label: "Basic details",
    },
    {
      label: "Employment",
    },
    {
      label: "Education",
    },
    {
      label: "Resume Headline",
    },
  ]);
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading, error } = JobSeekerProfileData;
  const [activeStep, setActiveStep] = React.useState(1);
  const [showEmp, setEmp] = useState(true);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  useEffect(() => {
    if (!loading && JobSeekerProfile) {
      if (JobSeekerProfile?.js_profile?.career_profile?.fresher ||JobSeekerProfile?.js_profile?.career_profile?.fresher===null) {
        setEmp(false);
        setStep(step.filter((e) => e.label !== "Employment"));
      }
      if (JobSeekerProfile?.js_profile?.employments?.length > 0) {
        setActiveStep(2);
        if (JobSeekerProfile?.js_profile?.career_profile?.fresher||JobSeekerProfile?.js_profile?.career_profile?.fresher===null) {
          setActiveStep(1);
        }
      }
      if (
        JobSeekerProfile?.js_profile?.education &&
        (JobSeekerProfile?.js_profile?.education?.degree.length > 0 ||
          JobSeekerProfile?.js_profile?.education?.schools.length > 0)
      ) {
        setActiveStep(3);
        if (JobSeekerProfile?.js_profile?.career_profile?.fresher||JobSeekerProfile?.js_profile?.career_profile?.fresher===null) {
          setActiveStep(2);
        }
      }
    }
  }, [loading, JobSeekerProfile]);
  
  useEffect(() => {}, [setActiveStep]);

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar
            sx={{ position: "relative" }}
            style={{ backgroundColor: "whitesmoke" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 1, flex: 1 }} component="div">
                <div className="">
                  <img
                    src={logo2}
                    style={{ height: "70px" }}
                    className="logo"
                    alt="img"
                  />
                </div>
              </Typography>
              {/* <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                style={{ color: "gray" }}
              >
                <CloseIcon />
              </IconButton> */}
              <button className="site-button" onClick={()=>{setOpen(false); sessionStorage.setItem("isSkiped", "true")}}>
                Skip
              </button>
            </Toolbar>
          </AppBar>

          {/* start model  */}

          <h6
            className="float-start text-start mt-4 ml-4"
            style={{
              fontSize: "x-large",
              color: "black",
            }}
          >
            BUILD YOUR PROFILE
          </h6>
          {/* <span
            className=" m-auto  modal-custom-desc ml-5"
          >
            Note : These steps are optional. For now you can skip & you can built your profile visiting to your proifle and complete the pending actions, so employer can find your 
          </span> */}
          <div className="d-flex">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-2 m-t100">
              <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {step.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        optional={
                          index === 3 ? (
                            <Typography variant="caption">
                              Add your resume headline and preference to make
                              your profile richer
                            </Typography>
                          ) : null
                        }
                      >
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </div>
            <div className="col-xl-8 col-lg-8 col-md-9 col-sm-12">
              <aside id="accordion1" className="content-block dashboard-card">
                <div>
                  <div className="container">
                    {showEmp && activeStep === 1 && (
                      <Employment next={handleNext} />
                    )}
                    {((!showEmp && activeStep === 1) ||
                      (showEmp && activeStep === 2)) && (
                      <RPEducation next={handleNext} />
                    )}
                    {((!showEmp && activeStep === 2) ||
                      (showEmp && activeStep === 3)) && (
                      <LastStep next={handleNext} hide={handleClose} />
                    )}
                    {/* <Education/> */}
                    {/* <Employment/> */}
                    {/* <LastStep/> */}
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* end model */}
        </Dialog>
      </div>
    </>
  );
}
export default ResumeParser;
