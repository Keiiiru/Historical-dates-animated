import React, { Ref } from "react";
import "./index.sass";

const Button = ({
  children,
  className,
  onClick,
  disabled,
  slot,
  ref,
  style,
}: {
  children: any;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  slot?: string;
  ref?: Ref<any>;
  style?: any;
}): React.ReactElement => {
  return (
    <button
      className={`${className ? className : "button"} ${
        disabled ? "disabled" : " "
      }`}
      onClick={onClick}
      disabled={disabled}
      slot={slot}
      ref={ref}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
