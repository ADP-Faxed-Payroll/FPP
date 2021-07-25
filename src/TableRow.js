import React from 'react';

export default function TableRow(props) {
    console.log(props.rowNumber);
    console.log(props.item);
  return (
    <div class="result-grid">
      <span contenteditable='true'>{props.eI}</span>
      <span contenteditable='true'>{props.rH}</span>
      <span contenteditable='true'>{props.sA}</span>
      <span contenteditable='true'>{props.oH}</span>
      <span contenteditable='true'>{props.vH}</span>
      <span contenteditable='true'>{props.siH}</span>
      <span contenteditable='true'>{props.pH}</span>
      <span contenteditable='true'>{props.hH}</span>
      <span contenteditable='true'>{props.bA}</span>
      <span contenteditable='true'>{props.mA}</span>
      <span contenteditable='true'>{props.stH}</span>
      <span contenteditable='true'>{props.n}</span>
    </div>
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