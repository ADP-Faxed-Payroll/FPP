import React from 'react';

export default function TableRow(props) {
    console.log(props.rowNumber);
    console.log(props.item);
  return (
    <tr>
      <td contenteditable='true'>{props.eI}</td>
      <td contenteditable='true'>{props.rH}</td>
      <td contenteditable='true'>{props.sA}</td>
      <td contenteditable='true'>{props.oH}</td>
      <td contenteditable='true'>{props.vH}</td>
      <td contenteditable='true'>{props.siH}</td>
      <td contenteditable='true'>{props.pH}</td>
      <td contenteditable='true'>{props.hH}</td>
      <td contenteditable='true'>{props.bA}</td>
      <td contenteditable='true'>{props.mA}</td>
      <td contenteditable='true'>{props.stH}</td>
      <td contenteditable='true'>{props.n}</td>
    </tr>
  );
}
/*    <tr>
      <td>{props.index}</td>
      <td>{props.username}</td>
      <td>{props.bestwpm}</td>
      <td>{props.avgwpm}</td>
      <td>{props.gamesplayed}</td>
      <td>{props.gameswon}</td>
    </tr>*/