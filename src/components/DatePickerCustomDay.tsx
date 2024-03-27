import React, { FC } from "react";

interface Props {
  dayOfMonth: number;
  date?: Date;
  onClick?: () => void;
}

const DatePickerCustomDay: FC<Props> = ({ dayOfMonth, date, onClick }) => {
  return (
    <div className="react-datepicker__day" onClick={onClick}>
      <span className="react-datepicker__day_span">{dayOfMonth}</span>
    </div>
  );
};

export default DatePickerCustomDay;
