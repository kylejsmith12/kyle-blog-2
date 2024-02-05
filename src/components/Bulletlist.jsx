// BulletList.jsx
import React from "react";

const BulletList = ({ items }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export default BulletList;
