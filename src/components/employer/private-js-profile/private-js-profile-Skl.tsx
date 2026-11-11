import { Chip, Skeleton } from "@mui/material";
import { Button } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
const PrivateJsProfile_Skl = () => {
    const sklArray = [1, 2, 3];
    return (
        <div>
            <div className="page-content bg-white">
                <div className="content-block">
                    <div className="browse-job section-full bg-white p-t50 p-b20"></div>
                    <div className="container">
                        <div className="job-bx bg-white browse-job clearfix mt-5 m-b30">
                            <div className="job-bx-title clearfix NativeTitle">
                                <div className="pull-left">
                                    <h5 className="font-weight-700 pull-left text-uppercase">
                                        PRIVATE JOBSEEKER PROFILE
                                    </h5>
                                </div>
                                <div
                                    className="float-right"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <Button
                                            className="primary"
                                            style={{
                                                marginRight: "5px",
                                            }}
                                        >
                                            Upload Resume
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            className="primary"
                                            style={{
                                                marginRight: "5px",
                                            }}
                                        >
                                            <FaFilter /> Filter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12">
                                    <div>
                                        <table className="table-job-bx cv-manager company-manage-job">
                                            <thead>
                                                <tr>
                                                    <th> User Name</th>
                                                    <th> Email Address</th>
                                                    <th> Phone Number</th>
                                                    <th> Tag Name</th>
                                                    <th> Uploaded on</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sklArray.map(() => (
                                                    <tr>
                                                        <td
                                                            className="job-name d-flex"
                                                            key={"name"}
                                                        >
                                                            <Skeleton
                                                                animation="wave"
                                                                height={20}
                                                                width="60%"
                                                            />
                                                        </td>

                                                        <td
                                                            className="application tabletd p-0"
                                                            key={"email"}
                                                        >
                                                            <Skeleton
                                                                animation="wave"
                                                                height={20}
                                                                width="60%"
                                                            />
                                                        </td>

                                                        <td
                                                            className="application tabletd p-0 text-center"
                                                            key={"phone"}
                                                        >
                                                            <Skeleton
                                                                animation="wave"
                                                                height={20}
                                                                width="60%"
                                                            />
                                                        </td>

                                                        <td
                                                            className="application text-primary text-center"
                                                            key={"tag"}
                                                        >
                                                            <Skeleton
                                                                animation="wave"
                                                                height={20}
                                                                width="60%"
                                                            />
                                                        </td>
                                                        <td
                                                            className="application text-primary text-center"
                                                            key={"upload"}
                                                        >
                                                            <Skeleton
                                                                animation="wave"
                                                                height={20}
                                                                width="60%"
                                                            />
                                                        </td>
                                                        <td
                                                            className="application text-primary text-center"
                                                            key={"action"}
                                                        >
                                                            <Skeleton
                                                                animation="wave"
                                                                height={20}
                                                                width="60%"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PrivateJsProfile_Skl;
