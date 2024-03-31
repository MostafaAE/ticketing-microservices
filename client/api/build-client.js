import axios from "axios";
function buildClient({ req }) {
  // from the server
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  }
  // from the browser
  else {
    return axios.create({
      baseURL: "/",
    });
  }
}

export default buildClient;
