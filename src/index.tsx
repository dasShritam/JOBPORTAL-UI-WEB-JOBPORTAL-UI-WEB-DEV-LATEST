import App from "./App";
//import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
// import SimpleReactLightbox from "simple-react-lightbox";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// ReactDOM.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root'));

// ReactDOM.render(
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
// );
// reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
