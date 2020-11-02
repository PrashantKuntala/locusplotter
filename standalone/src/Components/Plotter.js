import React, { Component } from "react";

// material-ui imports
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from "@material-ui/core/Slider";
import LinearProgress from "@material-ui/core/LinearProgress";

import {
  TextField,
  CardActions,
  Select,
  MenuItem,
  FormHelperText,
  CardContent,
  Tooltip,
} from "@material-ui/core";

import CompositePlot from "./FeatureCompositePlot";
import FastaComposite from "./FastaComposite";
import { SketchPicker } from "react-color";

import jsonFile from "../Data/example.json";

// For the slider component
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

// component styles.
const styles = (theme) => ({
  container: {
    padding: 20,
  },
  selectStyle: {
    width: 120,
  },
  bars: {
    // marginTop: -300,
    border: "2px solid green",
  },
  exportButton: {
    // marginLeft: 10
  },
  textfield: {
    width: 130,
  },
});

class Plotter extends Component {
  state = {
    data: [],
    plotted: [],
    plotColor: "",
    selectedRef: "",
    fastaData: [],
    xWidth: 250,
    yWidth: 1,
    plotStyle: "monotoneX",
    areaEnabled: true,
    areaOpacity: 0.2,
    enableFasta: false,
    enableScaling: true,
  };

  componentDidMount() {
    console.log("JSON file is loaded ");
    console.log(jsonFile);
  }

  // #########################################################################################################
  // Plot settings
  // #########################################################################################################

  handleXWidth = (event) => {
    let winValue = event.target.value > 0 ? event.target.value : 250;
    this.setState({ xWidth: winValue });
  };

  handleYWidth = (event) => {
    let winValue = event.target.value > 0 ? event.target.value : 1;
    this.setState({ yWidth: winValue });
  };

  handlePlotStyle = (event) => {
    this.setState({ plotStyle: event.target.value });
  };

  handleArea = (event) => {
    // let value = event.target.checked ? true : false;
    this.setState({ areaEnabled: event.target.checked });
  };

  handleScaling = (event) => {
    // let value = event.target.checked ? true : false;
    this.setState({
      enableScaling: event.target.checked,
      data: [],
      plotted: [],
    });
  };

  handleFasta = (event) => {
    this.setState({ enableFasta: event.target.checked });
  };

  handleSliderChange = (event, value) => {
    this.setState({ areaOpacity: value });
  };

  // Color picker for the plot
  handleSketchChange = (color) => {
    this.setState({ plotColor: color.hex });
  };

  // #########################################################################################################

  // Plot the selected dataset at the selectedRef
  handleCheckboxClick = (event) => {
    // get the selectedRef and target
    let { selectedRef } = this.state;
    let target = event.target.name;

    // set senseName and antiName to remove datasets when unchecked.
    let senseName = selectedRef + "-" + target + "-Sense";
    let antiName = selectedRef + "-" + target + "-Anti";

    // console.log(target, selectedRef);

    // check if the target is to be plotted
    if (event.target.checked) {
      // Retrieve the plotItem
      let plotItem = jsonFile[selectedRef].filter((item) => {
        return item.proteinName === target;
      });

      // setting the value to the object, instead of an array
      plotItem = plotItem[0];

      // Add it to the list of plotted.
      let plotted = this.state.plotted;
      plotted.push(event.target.name);

      // Check if custom color is needed and set it based on the selected value
      plotItem.plotData = plotItem.plotData.map((line) => {
        // console.log(line.color);
        line.color = this.state.plotColor;
        return line;
      });

      // check if scaling is required and modify the plotData
      if (this.state.enableScaling) {
        // To generate the data after multplying with a scaling factor. Using a different global variable to avoid mutation of data.
        var plotValues = plotItem.plotData.map((t) => {
          let modifiedData = t.data.map((b) => {
            // console.log(b.y, parseFloat(b.y) * plotItem.totalTagScaling);
            return { x: b.x, y: parseFloat(b.y) * plotItem.totalTagScaling };
          });
          return { _id: t._id, color: t.color, data: modifiedData, id: t.id };
        });

        // set the state to reflect the data - WITH scaling applied
        this.setState({
          data: [...this.state.data, ...plotValues],
          plotted: plotted,
        });
      } else {
        // set the state to reflect the data - WITHOUT scaling applied
        this.setState({
          data: [...this.state.data, ...plotItem.plotData],
          plotted: plotted,
        });
      }
    } else {
      // remove the checked item
      let plotted = this.state.plotted.filter((item) => {
        return item !== event.target.name;
      });

      let filteredData = this.state.data.filter((item) => {
        // return only those items that are not unchecked
        if (!item.id.endsWith(senseName) && !item.id.endsWith(antiName)) {
          return item;
        }
      });

      // set the state to reflect the data
      this.setState({
        data: filteredData,
        plotted: plotted,
      });

      // log the information
      console.log(
        event.target.name +
          " is already plotted, Removing it from the data list"
      );
    }
  };

  // To select gene categories
  // handleCategory = async (event) => {
  //   // When category changes, fetch references -> datasets -> fasta
  //   await this.setState({
  //     selectedCategory: event.target.value,
  //     referencePoints: [],
  //     selectedRef: "",
  //     datasets: [],
  //     fastaData: [],
  //     data: [],
  //     plotted: [],
  //   });

  //   // add references
  //   this.fetchRefs();
  // };

  handleRefChange = (event) => {
    // https://github.com/facebook/react/issues/6179
    this.setState({
      selectedRef: event.target.value,
      data: [],
      plotted: [],
      fastaData: [],
    });
  };

  handleReset = () => {
    this.setState({
      selectedRef: "",
      data: [],
      plotted: [],
      plotColor: "",
      fastaData: [],
    });
  };

  render() {
    const { classes } = this.props;
    const {
      selectedRef,
      plotted,
      plotColor,
      xWidth,
      yWidth,
      plotStyle,
      areaEnabled,
      fastaData,
      areaOpacity,
      enableFasta,
      enableScaling,
    } = this.state;

    // To sort the datasets available for each reference point.
    if (jsonFile[selectedRef]) {
      var datasets = jsonFile[selectedRef].map((item) => {
        return item.proteinName;
      });
      datasets = datasets.sort();
    }

    return (
      <Paper className={classes.container}>
        <h1>Locus Plotter</h1>
        <Divider />
        <h3>Motivation :</h3>
        <Typography variant="body1" gutterBottom>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
          voluptatum vitae recusandae dolor, omnis, magni dolores sit qui
          voluptatibus atque porro natus fugiat accusantium perferendis harum
          quibusdam earum similique. Saepe.
        </Typography>
        <h3>Instructions :</h3>
        <Typography variant="body1" gutterBottom>
          <ul>
            <li>
              Select a reference point or protein name from the drop down. In
              this example's context the reference point is the midpoint of the
              motif bound by that protein in the yeast genome.
            </li>
            <li>
              After you select a protein, you see a list of datasets that are
              loaded beside the color picker.
            </li>
            <li>
              Select a color. By default all datasets are gray in color when
              plotted.
            </li>
            <li>
              Now, check any dataset to plot. Choose another color before
              plotting the next dataset, otherwise it is plotted in the
              previously selected color.
            </li>
            <li>
              Customize the plot using the controls that are made available.
            </li>
          </ul>
        </Typography>
        <Divider />
        <br />
        {/* Plot controls */}
        <CardActions>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <TextField
                id="xWidth-textfield"
                label="X-axis (Max)"
                variant="outlined"
                margin="dense"
                className={classes.textfield}
                onChange={this.handleXWidth}
              />
            </Grid>
            <Grid item>
              <TextField
                id="yWidth-textfield"
                label="Y-axis (Max)"
                variant="outlined"
                margin="dense"
                className={classes.textfield}
                onChange={this.handleYWidth}
              />
            </Grid>
            <Grid item>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={plotStyle}
                margin="dense"
                className={classes.selectStyle}
                onChange={this.handlePlotStyle}
              >
                <MenuItem value={"linear"}>Linear</MenuItem>
                <MenuItem value={"monotoneX"}>MonotoneX</MenuItem>
              </Select>
              <FormHelperText>Choose plot style</FormHelperText>
            </Grid>
            <Grid item>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      name="enableArea"
                      checked={areaEnabled}
                      onClick={this.handleArea}
                    />
                  }
                  label="Enable Area"
                />
              </FormGroup>
            </Grid>
            <Grid item>
              <Typography gutterBottom>Area Opacity</Typography>
              <Slider
                ValueLabelComponent={ValueLabelComponent}
                aria-label="custom thumb label"
                defaultValue={areaOpacity}
                max={1}
                step={0.1}
                style={{ width: 100 }}
                onChangeCommitted={this.handleSliderChange}
              />
            </Grid>
            <Grid item>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      name="enableFasta"
                      checked={enableFasta}
                      onClick={this.handleFasta}
                    />
                  }
                  label="Show Fasta Sequence"
                />
              </FormGroup>
            </Grid>
            <Grid item>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      name="enableScaling"
                      checked={enableScaling}
                      onClick={this.handleScaling}
                    />
                  }
                  label="Enable Scaling (Total Tag)"
                />
              </FormGroup>
            </Grid>
            <Grid
              item
              style={{
                borderLeft: "1px solid gray",
              }}
            >
              <Typography gutterBottom>
                No.of Datasets plotted : {plotted.length}
              </Typography>
              <Button
                color="secondary"
                variant="outlined"
                onClick={this.handleReset}
                size="small"
                style={{ marginLeft: 20 }}
              >
                Reset plot
              </Button>
            </Grid>
          </Grid>
        </CardActions>

        {/* Plots */}
        <CompositePlot
          data={this.state.data}
          xWidth={xWidth}
          yWidth={yWidth}
          plotStyle={plotStyle}
          areaEnabled={areaEnabled}
          areaOpacity={areaOpacity}
        />

        {enableFasta ? <FastaComposite data={fastaData} xWidth={xWidth} /> : ""}
        <Divider />
        <br />
        <Grid container spacing={3}>
          {/* <Grid item>
            <Select
              labelId="category-select"
              id="category-select"
              value={"STM"}
              margin="dense"
              className={classes.selectStyle}
              onChange={this.handleCategory}
            >
              {categories.map(item => {
                return (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Select Gene Category</FormHelperText>
          </Grid> */}
          <Grid item>
            <Select
              labelId="referencePoint-select"
              id="referencePoint-select"
              value={selectedRef}
              margin="dense"
              className={classes.selectStyle}
              onChange={this.handleRefChange}
            >
              {Object.keys(jsonFile).map((item) => {
                return (
                  <MenuItem value={item} key={item + "-ref"}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Select Reference Point</FormHelperText>
          </Grid>
          <Grid item>
            <SketchPicker
              color={plotColor}
              onChange={this.handleSketchChange}
              disableAlpha={false}
            />
            <h4 style={{ textAlign: "center" }}>Pick Plot Color</h4>
          </Grid>
          <Grid item style={{ width: "75vw" }}>
            <CardContent>
              {console.log(datasets)}
              {/* If a reference point is selected then show the available datasets. default is emptyString.
              The checked property is set to true if the proteinName is present in the list of plotted. */}
              {jsonFile[selectedRef] ? (
                jsonFile[selectedRef].length > 0 ? (
                  <FormGroup row>
                    {datasets.map((dat) => {
                      return (
                        <FormControlLabel
                          key={dat}
                          control={
                            <Checkbox
                              color="primary"
                              name={dat}
                              onClick={this.handleCheckboxClick}
                              checked={plotted.includes(dat)}
                            />
                          }
                          style={{ borderLeft: "1px solid gray", width: 130 }}
                          label={dat}
                        />
                      );
                    })}
                  </FormGroup>
                ) : (
                  <Typography component="div" gutterBottom>
                    Loading datasets
                    <LinearProgress />
                  </Typography>
                )
              ) : (
                " "
              )}
            </CardContent>
          </Grid>
        </Grid>
        <Divider />
        <br />
      </Paper>
    );
  }
}

Plotter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Plotter);
