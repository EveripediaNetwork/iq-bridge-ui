import initialUserTokenContextProd from "../../environments/initialUserTokenContextProd";
import initialUserTokenContextDev from "../../environments/initialUserTokenContextDev";
import { isProd } from "../../config";

const initialUserTokenContext =
  isProd === "true" ? initialUserTokenContextProd : initialUserTokenContextDev;

export default initialUserTokenContext;
