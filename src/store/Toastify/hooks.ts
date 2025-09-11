import { useContext } from "react";
import Context from "./Context";

const useToastify = () => useContext(Context)

export { useToastify }