import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JobPreviewData } from "../../../redux/features/jobs/job-preview/JobPreviewSlice";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
  styled,
} from "@mui/material";
import {
  MdLocationOn,
  MdMilitaryTech,
  MdWork,
  MdWorkOutline,
} from "react-icons/md";
import { ImLocation } from "react-icons/im";
import { FcGraduationCap } from "react-icons/fc";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaSuitcase } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import { GiWallet } from "react-icons/gi";
import Testing2 from "./Testing2";
import Select from "react-select";
import { Link } from "react-router-dom";
import { OverlayTrigger, Popover } from "react-bootstrap";

var data = [{ name: "irshad", designation: "Software Engineer" }];

var bnr3 = require("../../../assets/images/job_preview.png");

function Testing() {
  const popover = (
    <Popover
      id="popover-basic"
      style={{
        boxShadow: "0px 1px 1px 0px #dacdcd",
      }}
    >
      <Popover.Title as="h3">Popover Title</Popover.Title>
      <Popover.Content>This is the popover content.</Popover.Content>
    </Popover>
  );

  return (
    <div className="page-content">
      <div className="content-block">
        <div className="section-full browse-job content-inner-2">
          <div className="container" style={{ marginTop: "2%" }}>
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
              <button type="button">Click Me</button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testing;
