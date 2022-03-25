import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";
import FormControlLabel from "@mui/material/FormControlLabel";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries, LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import React, { useEffect, useState } from "react";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { format } from "d3-format";
import {
  OHLCTooltip,
  MovingAverageTooltip,
  RSITooltip,
  SingleValueTooltip,
} from "react-stockcharts/lib/tooltip";
import {
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
} from "react-stockcharts/lib/coordinates";

import {
  CrossHairCursor,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { ema, rsi, sma, atr } from "react-stockcharts/lib/indicator";
import Checkbox from "@mui/material/Checkbox";
import { Label } from "react-bootstrap";
import { BarSeries, AreaSeries, RSISeries } from "react-stockcharts/lib/series";

var CandleStickChart = (props) => {
  //props which we are passing
  const { type, width, data, ratio } = props;
  console.log("type====>", type);
  //state we defined here
  const [test, setTest] = useState(false);

  const xAccessor = (d) => d.date;
  const xExtents = [xAccessor(last(data)), xAccessor(data[data.length - 100])];

  const [Ema26, setEma26] = useState(false);

  console.log("EMA26====>", Ema26);
  //   console.log("xExtents====>", xExtents[0]);

  // function for indicator ema26
  const ema26 = ema()
    .id(0)
    .options({ windowSize: 26 })
    .merge((d, c) => {
      d.ema26 = c;
    })
    .accessor((d) => d.ema26);

  const smaVolume50 = sma()
    .id(3)
    .options({ windowSize: 50, sourcePath: "volume" })
    .merge((d, c) => {
      d.smaVolume50 = c;
    })
    .accessor((d) => d.smaVolume50);

  console.log("emaa=====>", ema26);

  const calculatedData = ema26(data);
  console.log("calculatedData", calculatedData);

  //scale provider
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => d.date
  );

  console.log("xScaleProvider", xScaleProvider);
  const { xdata, xScale, xxAccessor, displayXAccessor } =
    xScaleProvider(calculatedData);

  return (
    <div className="dark"> 
      <ChartCanvas
        height={400}
        ratio={ratio}
        width={width}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xAccessor={xAccessor}
        xScale={scaleTime()}
        xExtents={xExtents}
      >
        {/* <Chart id={1} yExtents={(d) => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" ticks={6} />
          <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
        </Chart> */}

        <Chart
          id={1}
          height={300}
          yExtents={[(d) => [d.high, d.low], ema26.accessor()]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
          />
          <YAxis axisAt="left" orient="right" ticks={5} />
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <CandlestickSeries
            width={timeIntervalBarWidth(utcDay)}
            stroke={(d) => (d.close > d.open ? "#6BA583" : "#DB0000")}
            wickStroke={(d) => (d.close > d.open ? "#6BA583" : "#DB0000")}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#DB0000")}
          />
          {Ema26 == true ? (
            <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          ) : null}
          {/* <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/> */}

          {/* <CurrentCoordinate
            yAccessor={ema26.accessor()}
            fill={ema26.stroke()}
          /> */}
          {/* <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} /> */}

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
          />

          <OHLCTooltip origin={[-40, 0]} />

          {Ema26 == true ? (
            <MovingAverageTooltip
              onClick={(e) => console.log(e)}
              origin={[-38, 15]}
              options={[
                {
                  yAccessor: ema26.accessor(),
                  type: "EMA",
                  stroke: ema26.stroke(),
                  windowSize: ema26.options().windowSize,
                },
              ]}
            />
          ) : null}
        </Chart>
        <Chart
          id={2}
          height={330}
          yExtents={[(d) => d.volume, smaVolume50.accessor()]}
          origin={(w, h) => [0, h - 400]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
          />

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />

          <BarSeries
            yAccessor={(d) => d.volume}
            fill={(d) => (d.close > d.open ? "#6BA583" : "#DB0000")}
          />
          <AreaSeries
            yAccessor={smaVolume50.accessor()}
            stroke={smaVolume50.stroke()}
            fill={smaVolume50.fill()}
          />
        </Chart>
        {/* <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/> */}
      </ChartCanvas>

      <FormControlLabel
        control={<Checkbox onChange={(e) => setEma26((prev) => !prev)} />}
        label="EMA"
      />
    </div>
  );
};
CandleStickChart = fitWidth(CandleStickChart);

// CandleStickChart.propTypes = {
//   data: PropTypes.array.isRequired,
//   width: PropTypes.number.isRequired,
//   ratio: PropTypes.number.isRequired,
//   type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
// };

// CandleStickChart.defaultProps = {
//   type: "svg",
// };

export default CandleStickChart;
