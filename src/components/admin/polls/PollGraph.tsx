import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function PollGraph(props: any) {
  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  useEffect(() => {}, [props]);

  const [progress, setProgress] = React.useState<any>([]);
  // const [pollData,setpollData]=useState([])
  const handleCal = () => {
    const totalvote = props?.pollsDetails?.options?.reduce(
      (total, option) => total + (option?.vote || 0),
      0
    );
    const votes = props?.pollsDetails?.options?.map((option) => {
      const percentage = (Number(option?.vote) / totalvote) * 100;
      return percentage ? percentage : 0;
    });

    setProgress(votes);
  };

  useEffect(() => {
    handleCal();
  }, [props.pollsDetails]);

  return (
    <>
      {/* <div className="section-full browse-job content-inner-2 ml-auto"> */}
      {/* <div className="container"> */}
      {/* <div className="job-bx browse-job clearfix "> */}
      <div className="col-lg-12 col-md-12 ">
        <Box sx={{ width: "100%" }}>
          <div>
            <div
              key={
                props?.pollsDetails?.pollId
                  ? props?.pollsDetails?.pollId
                  : "Not available"
              }
            >
              <ol>
                {props?.pollsDetails?.options?.map((option, index) => (
                  <li className="ml-4 ">
                    {index + 1}.&nbsp; {option?.val}
                  </li>
                ))}
              </ol>
              <h6 className="modal-title mb-3">
                Voting percentage for individual options
              </h6>
              <div className="d-flex">
                <div className="flex-grow-1">
                  {props?.pollsDetails?.options?.map((prog, index) => (
                    <div key={index} className="container">
                      <div className="row align-items-center">
                        <div className="col-1" style={{ marginTop: "-15px" }}>
                          {index + 1}.
                        </div>
                        <div className="col-lg-11">
                          <div className="mb-3">
                            <LinearProgressWithLabel
                              value={
                                Array.isArray(progress) && progress.length > 0
                                  ? progress[index]
                                  : 0
                              }
                              style={{ height: "20px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}
    </>
  );
}

export default PollGraph;
