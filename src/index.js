import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import Chart from "./Chart";
import { getData } from "./utils";
import './index.css'
import { TypeChooser } from "react-stockcharts/lib/helper";

// class ChartComponent extends React.Component {
//   componentDidMount() {
//     getData().then((data) => {
//       this.setState({ data });
//     });
// 	}

//   render() {
//     if (this.state == null) {
//       return <div>Loading...</div>;
//     }
//     return (
//       <TypeChooser>
//         {(type) => <Chart type={type} data={this.state.data} />}
//       </TypeChooser>
//     );
//   }
// }
const ChartComponent = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
	      getData().then((data) => {
      setData(data);
	  console.log("data===>",data);

    });
  }, []);

  if (data == null) {
    return <div>Loading...</div>;
  }
  return (
	  <div className="dark">
    <TypeChooser>{(type) =>
		 <Chart type={type} data={data} />}
		 </TypeChooser>
		 </div>
  );
};

render(<ChartComponent />, document.getElementById("root"));
