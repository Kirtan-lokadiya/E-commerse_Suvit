import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import "./index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <ChakraProvider> */}
        <App />
      {/* </ChakraProvider> */}
    </Provider>
  </React.StrictMode>
);
