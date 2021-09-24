export const Cell = (props) => {
  const classes = ["cell", props.selectedClass];
  const pencilMarks = Array.from(props.value.pencilMarks).sort().join(' ');

  if (props.value.locked) {
    classes.push("locked");
  }
  if (!props.value.valid) {
    classes.push("invalid");
  }

  let displayValue;
  if (props.value.value === 0) {
    displayValue = pencilMarks;
    classes.push("pencilMark");
  } else {
    displayValue = props.value.value;
  }

  return <div className={classes.join(' ')}>
    {displayValue}
  </div>;
}
