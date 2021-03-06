import React from "react";
import { Button, MenuItem, InputLabel, Select } from "@material-ui/core/";
import Grid from "@material-ui/core/Grid";
import RichTextEditor from "react-rte";
import axiosInstance from "../axios";
import ImageGallery from "react-image-gallery";
require("./EditMarker.css");

// popup attached to landmark
export default class EditMarker extends React.Component {
  state = {
    landmarks: this.props.landmarks,
    layerlandmarks: this.props.layerlandmarks,
    content: this.props.content,
    position: this.props.position,
    icontype: this.props.icontype,
    lat: this.props.lat,
    lng: this.props.lng,
    value: RichTextEditor.createValueFromString(this.props.content, "html"),
    selectedFile: null,
    images: [],
    imagesEmptyText: null,
    schemas: [],
    layers: this.props.layers,
    layer: this.props.layer,
    currentImage: "",
  };

  // get images on popup render
  componentDidMount() {
    this.getImages();
  }

  createSelectItems() {
    let items = [];
    for (let i = 0; i <= this.props.layer; i++) {
      items.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
      // creating my options dynamically based on
      // what props are currently passed to the parent component
    }
    return items;
  }

  // function to edit a marker, passes back to updateLandmarks in LayerContent.js
  handleEdit = () => {
    this.props.markerEdit(
      this.state.layer,
      this.state.content,
      this.state.icontype,
      this.state.lat,
      this.state.lng,
      this.props.id,
      this.state.position,
      this.state.layerlandmarks
    );
  };

  // function for deleting a marker, passes back to removeMarkerFromState in LayerContent.js
  handleDelete = () => {
    this.props.markerDelete(this.props.id);
  };

  // handles rich text editor
  onChange = (value) => {
    this.setState({ value });
    this.setState({ content: value.toString("html") });
  };

  // first half of image uploading
  fileSelectedHandler = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
    });
  };

  // second half of image uploading
  uploadImage = () => {
    const formData = new FormData();
    formData.append(
      "image",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    formData.append("image_name", this.state.selectedFile.name);
    formData.append("landmark", this.props.id);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axiosInstance.post("/landmark-images/", formData, config).then((res) => {
      this.getImages();
    });
  };

  // removes landmark from state
  removeImage = (image_id) => {
    /* Deletes the given image from the state, by sending a DELETE request to the API */
    const response = axiosInstance
      .delete(`/landmark-images/${image_id}/`)
      .then((response) => {
        // filter out the images that have been deleted from the state
        this.getImages();
      });
  };

  // get images for each landmark
  getImages = (e) => {
    const results = [];
    const items = [];
    const response = axiosInstance
      .get("/landmark-images/", {})
      .then((response) =>
        response.data.forEach((item) => {
          if (item.landmark == this.props.id) {
            // matches up each series of images to their corresponding landmark
            results.push({
              image: item.image,
            });
            items.push({
              id: item.id,
              landmark: item.landmark,
              image: item.image,
              image_name: item.image_name,
            });
          }

          // maps results so that they can be displayed in image gallery
          this.setState({
            items: results.map((obj) => ({
              original: `${obj.image}`,
              thumbnail: `${obj.image}`,
            })),
          });
        })
      );

    this.setState({ images: items });
    if (this.state.images.length > 0) {
      this.setState({ currentImage: this.state.images[0] });
    } else {
      this.setState({ currentImage: "" });
    }
  };

  render() {
    const toolbarConfig = {
      // toolbarConfig defines what is displayed at the top of the rich text editor (e.g. bold, italics)
      display: [
        "INLINE_STYLE_BUTTONS",
        "BLOCK_TYPE_BUTTONS",
        "BLOCK_TYPE_DROPDOWN",
        "HISTORY_BUTTONS",
      ],
      INLINE_STYLE_BUTTONS: [
        { label: "Bold", style: "BOLD", className: "custom-css-class" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" },
      ],
      BLOCK_TYPE_DROPDOWN: [
        { label: "Normal", style: "unstyled" },
        { label: "Heading Large", style: "header-one" },
        { label: "Heading Medium", style: "header-two" },
        { label: "Heading Small", style: "header-three" },
      ],
      BLOCK_TYPE_BUTTONS: [
        { label: "UL", style: "unordered-list-item" },
        { label: "OL", style: "ordered-list-item" },
      ],
    };

    // conditional rendering depending on whether or not any images have been uploaded to landmark
    let imageGalleryMessage = "";
    let imagelabel = "";
    let imageselect = "";
    let deleteimage = "";
    let deletebutton = "";
    let deletelabel = "";

    if (this.state.images.length == 0) {
      imageGalleryMessage = "";
      imageselect = "";
      deleteimage = "";
      deletebutton = "";
      imagelabel = "";
      deletelabel = "";
    } else {
      // display an image gallery
      imagelabel = <InputLabel id="label">Images</InputLabel>;
      imageGalleryMessage = (
        <ImageGallery
          items={this.state.items}
          showIndex={false}
          showBullets={true}
          infinite={true}
          showThumbnails={false}
          showFullscreenButton={true}
          showGalleryFullscreenButton={false}
          showPlayButton={false}
          showGalleryPlayButton={false}
          showNav={true}
          isRTL={false}
          lazyLoad={false}
          slideDuration={450}
          slideInterval={2000}
          slideOnThumbnailOver={false}
          useWindowKeyDown={true}
        />
      );

      // creates a selection panel for all images
      imageselect = this.state.images.map((e, key) => (
        <option key={e.id} value={e.id}>
          {e.image_name}
        </option>
      ));

      deletelabel = <InputLabel id="label">Delete Image</InputLabel>;

      // functionality for deleting an image
      deleteimage = (
        <select
          onFocus={(e) => this.setState({ currentImage: e.target.value })}
          onChange={(e) => this.setState({ currentImage: e.target.value })}
          required
        >
          <option value="" selected disabled>
            Select an image...
          </option>
          {imageselect}
        </select>
      );
      deletebutton = (
        <button
          disabled={!this.state.currentImage}
          onClick={() => this.removeImage(this.state.currentImage)}
        >
          Delete
        </button>
      );
    }

    return (
      <React.Fragment>
        <Grid container spacing={2} direction="column">
          {/* rich text editor for editing text content */}
          <Grid item>
            {/* temporary position label for debugging purposes */}
            <InputLabel>Position = {this.state.position}</InputLabel>
            <br></br>
            <InputLabel id="label">Content</InputLabel>
            <RichTextEditor
              className="rte"
              toolbarConfig={toolbarConfig}
              value={this.state.value}
              onChange={this.onChange}
              placeholder="Enter text here..."
            />
          </Grid>

          {/* image gallery */}
          <Grid item>
            <Grid>
              {imagelabel}
              {imageGalleryMessage}
            </Grid>
          </Grid>

          {/* delete image button */}
          <Grid item>
            <Grid>
              {deletelabel}
              {deleteimage}
              {deletebutton}
            </Grid>
          </Grid>

          {/* upload image button */}
          <Grid item>
            <InputLabel id="label">Upload new image</InputLabel>
            <input type="file" onChange={this.fileSelectedHandler} required />
            <button
              disabled={!this.state.selectedFile}
              onClick={this.uploadImage}
            >
              Upload
            </button>
          </Grid>

          {/* icon type selector*/}
          <Grid item>
            <InputLabel id="label">Icon type</InputLabel>
            <Select
              id="simple-select"
              value={this.state.icontype}
              onChange={(e) => this.setState({ icontype: e.target.value })}
            >
              <MenuItem value={"default"}>Default</MenuItem>
              <MenuItem value={"node"}>Border Node</MenuItem>
              <MenuItem value={"army"}>Army</MenuItem>
              <MenuItem value={"PinkArmy"}>Army (pink)</MenuItem>
              <MenuItem value={"GreenArmy"}>Army (green)</MenuItem>
              <MenuItem value={"individual"}>Significant Individual</MenuItem>
              <MenuItem value={"knowledge"}>Knowledge Site</MenuItem>
              <MenuItem value={"trading"}>Trading Site</MenuItem>
              <MenuItem value={"religious"}>Religious Site</MenuItem>
              <MenuItem value={"battle"}>Battle Site</MenuItem>
              <MenuItem value={"industry"}>Industry Site</MenuItem>
              <MenuItem value={"disease"}>Disease/Disaster</MenuItem>
              <MenuItem value={"village"}>Small Settlement</MenuItem>
              <MenuItem value={"city"}>Major Settlement</MenuItem>
              <MenuItem value={"fortress"}>Fortress</MenuItem>
            </Select>
          </Grid>

          {/* location */}
          <Grid item>
            <InputLabel id="label">Location</InputLabel>
            <form>
              <label>
                Latitude
                <input
                  type="number"
                  name="lat"
                  value={this.state.lat}
                  onChange={(e) => this.setState({ lat: e.target.value })}
                />
              </label>
              <label>
                Longitude
                <input
                  type="number"
                  name="lng"
                  value={this.state.lng}
                  onChange={(e) => this.setState({ lng: e.target.value })}
                />
              </label>
            </form>
          </Grid>

          {/* layer selector */}
          <Grid item>
            <InputLabel id="label">Choose Layer</InputLabel>
            <Select
              id="simple-select"
              value={this.state.layer}
              onChange={(e) => this.setState({ layer: e.target.value })}
            >
              {this.state.layers.map((e, key) => {
                return <MenuItem value={e.id}>{e.name}</MenuItem>;
              })}
            </Select>
          </Grid>

          {/* delete and submit changes */}
          <Grid item>
            <Button
              onClick={this.handleDelete}
              size="small"
              variant="outlined"
              color="secondary"
            >
              {" "}
              Delete Marker
            </Button>
            <Button
              onClick={this.handleEdit}
              size="small"
              variant="outlined"
              color="primary"
            >
              {" "}
              Submit changes
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
