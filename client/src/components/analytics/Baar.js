import React from "react";

import { Bar } from "react-chartjs-2";
export default function Baar({ dataa }) {
  const state = {
    labels: ["First", "Second", "Third", "Fourth"],
    datasets: [
      {
        label: "Sales",
        data: dataa,
        backgroundColor: "#5462C1",
        barPercentage: 1,
        barThickness: 35,
        maxBarThickness: 38,

        minBarLength: 2,
        borderWidth: 0,
        hoverBackgroundColor: "#5C3AC4"
      }
    ]
  };

  return (
    <div>
      <Bar
        data={state}
        options={{
          title: {
            display: true,
            text: "Number Of Sales",
            fontSize: 15
          },
          legend: {
            display: true,
            position: "right"
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ]
          }
        }}
      />
    </div>
  );
}
