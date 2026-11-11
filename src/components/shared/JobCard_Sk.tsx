import { Skeleton } from "@mui/material";

function JobCardSk() {
  return (
    <div className="job-card">
      <div className="d-flex justify-content-between">
        <div className="com_logo d-flex justify-content-around mb-4">
          <Skeleton
            animation="wave"
            variant="rounded"
            width={"70%"}
            height={"70%"}
          />
        </div>
        <div>
          <Skeleton animation="wave" variant="rounded" width={20} height={25} />
        </div>
      </div>
      <div>
        <span>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={250}
            height={25}
            className="mb-2"
          />
        </span>
      </div>
      <div>
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"60%"}
          height={15}
          className="mb-2"
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"80%"}
          height={15}
          className="mb-2"
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"50%"}
          height={15}
          className="mb-2"
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"80%"}
          height={15}
          className="mb-2"
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"20%"}
          height={15}
          className="mb-2"
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"90%"}
          height={70}
          className="mb-2"
        />
      </div>
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginTop: "7%" }}
      >
        <Skeleton
          animation="wave"
          style={{ borderRadius: "20px" }}
          variant="rectangular"
          width={"30%"}
          height={35}
          className="mb-2"
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"40%"}
          height={10}
        />
      </div>
    </div>
  );
}

export default JobCardSk;
