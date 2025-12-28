import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InMemoryCache, ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import App from "./App.tsx";
import { HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
