import React, { Component } from "react";

// Material ui styling
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// SubComponents
import Plotter from "./Components/Plotter";

// creating a themes with default fontfamily
const theme1 = createMuiTheme({
  typography: {
    fontFamily: [
      '"Roboto Slab"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ],
    useNextVariants: true,
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme1}>
        <CssBaseline />
        <Plotter />
      </MuiThemeProvider>
    );
  }
}

export default App;
