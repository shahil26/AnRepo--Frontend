import React, { useEffect } from "react";
import { List, ListItem, Card } from "@material-tailwind/react";
import axios from "axios";
import ChartDisplay from "./ChartDisplay";

 
export default  function ListWithSelectedItem() {
  const [selected, setSelected] = React.useState(1);
  const setSelectedItem = (value) => setSelected(value);

  
 
  return <>
    <Card className="w-96">
      
        
        
          <ChartDisplay/>
        
        
      
    </Card>
    </>;
}