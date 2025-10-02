import createClient from "openapi-react-query";
import {oApiClient} from "@/lib/openapi-fetch";

export const rqc = createClient(oApiClient);
