import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/views/App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux";
import SocketProvider from "./components/SocketProvider";
import { ServiceProvider } from "./context/serviceContext";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketProvider>
      <Provider store={store}>
        <ServiceProvider>
          <App />
        </ServiceProvider>
      </Provider>
    </SocketProvider>
  </BrowserRouter>
);
