import React, { Component } from "react";
import { Papa } from "papaparse";
import Card from "@material-ui/core/Card";
import Toast from "../Toast";
import { toast } from "react-toastify";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axiosInstance from "../../axios";
import Box from "@material-ui/core/Box";
import { Button } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";

export default class DropFileContainer extends React.Component {
  state = {
    students: [],
    data: [],
  };

  // first half of image uploading
  fileSelectedHandler = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
    });
  };

  // Parse CSV file
  parseFile = () => {
    var Papa = require("papaparse/papaparse.min.js");
    Papa.parse(this.state.selectedFile, {
      delimiter: "",
      chunkSize: 3,
      header: false,
      skipEmptyLines: true,
      complete: (responses) => {
        this.setState({ data: responses.data });
        const requests = this.state.data
          .map((line, idx) => {
            if (idx == 0) return; // skip the header row
            let username = line[2].split("@")[0];
            let groups = [line[5], line[6], line[7]];

            return axiosInstance.post("csv-upload/", {
              username: username,
              email: line[2],
              password: username, //Either GUID/Email for passsword?
              groups: groups,
            });
          })
          .filter((req) => req !== undefined);
        Promise.all(requests).then((res) => {
          if (res.every((r) => r.status == 201)) {
            toast.success("CSV Upload successful", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        });
      },
    });
  };

  // Input CSV file
  render() {
    return (
      <Card style={{ margin: "5%" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h5">
            CSV File Import
          </Typography>

          <div>
            <Box>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label
                  style={{
                    border: "1px solid #ccc",
                    display: "inline-block",
                    padding: "6px 10px",
                    cursor: "pointer",
                    minWidth: "25%",
                    textAlign: "center",
                    borderRadius: "10%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <input
                      type="file"
                      onChange={this.fileSelectedHandler}
                      required
                      style={{ display: "none" }}
                    />
                    <PublishIcon /> Attach
                  </div>
                </label>
                <Button
                  disabled={!this.state.selectedFile}
                  onClick={this.parseFile}
                  variant="outlined"
                  color="primary"
                >
                  Upload
                </Button>
              </div>
            </Box>
            <Toast />
          </div>

          <ul>
            {this.state.students.map((s) => (
              <li key={s.GUID}>
                <strong>{s.GUID}</strong>
                {s.First} {s.Last} {s.Email} {s.Role} {s.Status}
                {s.Group1} {s.Group2} {s.Group3}
                {s.Project1} {s.Project2} {s.Project3}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
}
