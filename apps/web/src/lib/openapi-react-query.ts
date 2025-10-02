import createClient from "openapi-react-query";
import {fetchClient} from "@/lib/openapi-fetch";

export const rqc = createClient(fetchClient);
