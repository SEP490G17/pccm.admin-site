import { Input } from "@chakra-ui/react";
import React from "react";
interface IProps{
    placeholder:string;
    field:any;
}
const InputMemoAtoms = React.memo(({placeholder, field}:IProps) => {
  return (
    <>
        <Input placeholder={placeholder} type="text" {...field} />

    </>
  );
});

export default InputMemoAtoms;