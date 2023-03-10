import { FunctionComponent } from "react";
import Layout from "../components/Layout";

const Error404: FunctionComponent = () => {
  return (
    <Layout title="Page not found">
      <div className="h-full">
        <div className="mb-1 flex flex-row p-6">
          <h1 className="font-bold text-white">404</h1>
        </div>
      </div>
    </Layout>
  );
};

export default Error404;
