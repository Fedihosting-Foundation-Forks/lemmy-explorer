import React from "react";

import useQueryCache from "../hooks/useQueryCache";

import Table from "@mui/joy/Table";
import Card from "@mui/joy/Card";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import CardOverflow from "@mui/joy/CardOverflow";
import CardCover from "@mui/joy/CardCover";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Divider from "@mui/joy/Divider";
import { styled } from "@mui/joy/styles";
import Grid from "@mui/joy/Grid";
import Sheet from "@mui/joy/Sheet";

import GitHubIcon from "@mui/icons-material/GitHub";
import ForumIcon from "@mui/icons-material/Forum";

import SusTable from "../components/Inspector/SusTable";
import { ScatterGrid, ScatterGrid1 } from "../components/Inspector/ScatterGrid";
import { VersionDist } from "../components/Inspector/VersionDist";
import { NumberStat } from "../components/Inspector/Gauges";

export default function Inspector() {
  const {
    isLoading: isLoadingSus,
    isSuccess: isSuccessSus,
    isError: isErrorSus,
    error: errorSus,
    data: dataSus,
  } = useQueryCache("susData", "/sus.json");

  const {
    isLoading: isLoadingIns,
    isSuccess: isSuccessIns,
    isError: isErrorIns,
    error: errorIns,
    data: dataIns,
  } = useQueryCache("instanceData", "/instances.json");

  const [totalUsers, totalGoodUsers, totalBadUsers] = React.useMemo(() => {
    if (!dataSus || !dataIns) return [0, 0, 0];

    let totalUsers = 0;
    let totalGoodUsers = 0;
    let totalBadUsers = 0;

    // instance data
    dataIns.forEach((instance) => {
      totalUsers += instance.counts.users;
    });

    // sus data
    dataSus.forEach((instance) => {
      totalBadUsers += instance.users;
    });

    totalGoodUsers = totalUsers - totalBadUsers;

    return [totalUsers, totalGoodUsers, totalBadUsers];
  }, [dataIns, dataSus]);

  if (isLoadingSus || isLoadingIns) return "Loading...";
  if (isErrorSus) return "An error has occurred: " + errorSus.message;
  if (isErrorIns) return "An error has occurred: " + errorIns.message;

  return (
    <Container maxWidth={false} sx={{}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ width: "100%" }}>
          <Grid xs={6}>
            <NumberStat
              color="primary"
              title="Total Instances"
              value={dataIns.length}
              description="Total count of all instances scanned in the last 24 hours."
            />
          </Grid>
          <Grid xs={6}>
            <NumberStat
              sx={{
                backgroundColor: "#974904",
              }}
              title="Sus Instances"
              value={dataSus.length}
              description="Total count of all suspicious instances scanned in the last 24 hours."
            />
          </Grid>
          <Grid xs={6}>
            <Sheet
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="success"
                title="Actual Users"
                value={totalUsers - totalBadUsers}
                description="A total count for all known instances, bad users removed."
              />
            </Sheet>
          </Grid>
          <Grid xs={3}>
            <Sheet
              color="danger"
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="info"
                title="Total Users"
                value={totalUsers}
                description="A total count from all known instances."
              />
            </Sheet>
          </Grid>
          <Grid xs={3}>
            <Sheet
              color="danger"
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="danger"
                title="Total Bad Users"
                value={totalBadUsers}
                description="A total count for all known instances."
              />
            </Sheet>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography color="info" variant="h4">
          Version distribution
        </Typography>
      </Box>
      <Box
        sx={{
          p: 1,
        }}
      >
        {isSuccessIns && <VersionDist instances={dataIns} />}
      </Box>

      {/* hgeader */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography color="danger" variant="h4">
          This page lists instances that could be dangerous, it is provided for visibilty.
        </Typography>
      </Box>

      {isSuccessSus && (
        <SusTable
          susRows={dataSus}
          renderRow={(row, index) => {
            return (
              <tr tabIndex={-1} key={row.name}>
                <th scope="row">{row.name}</th>
                <th scope="row">{row.base}</th>
                <th scope="row">
                  {row.users} ({row.metrics.usersMonth} month)
                </th>
                <th scope="row">{row.metrics.totalActivity}</th>
                <td scope="row">{row.actor_id}</td>
                <td scope="row">
                  {row.reasons.map((item) => {
                    return <div>{item}</div>;
                  })}
                </td>
              </tr>
            );
          }}
          headCells={[
            {
              id: "name",
              numeric: false,
              disablePadding: false,
              label: "Name",
            },
            {
              id: "baseurl",
              numeric: false,
              disablePadding: false,
              label: "Base URL",
            },
            {
              id: "users",
              numeric: true,
              disablePadding: false,
              label: "Users",
            },

            {
              id: "totalActivity",
              numeric: true,
              disablePadding: false,
              label: "Total Activity",
            },
            {
              id: "actor_id",
              numeric: false,
              disablePadding: false,
              label: "Actor ID",
            },
            {
              id: "reasons",
              numeric: false,
              disablePadding: false,
              label: "Reasons",
            },
          ]}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography color="info" variant="h4">
          Instance users growth per minute average vs. User monthly active score
        </Typography>
      </Box>

      {isSuccessIns && <ScatterGrid instances={dataIns} />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography color="info" variant="h4">
          Instance users growth per minute average vs. User monthly active score
        </Typography>
      </Box>

      {isSuccessIns && <ScatterGrid1 instances={dataIns} />}
    </Container>
  );
}
