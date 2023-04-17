import React from "react";
import { IButton } from "../../util/inputUtil";
import { Link } from "react-router-dom";

export function Button(props: IButton) {
    if (props.type === "submit") {
        return(
          <button
            className={props.bootstrapClass}
            hidden = {props.hidden}
            disabled={props.disabled}
            type="submit"
          >
            {props.text}
          </button>
        );
      } else if (props.to) {
        return(
          <Link to={props.to ? props.to : ""} hidden = {props.hidden} >
            <button
              className={props.bootstrapClass + " fullscreenButton"} 
            >
              {props.text}
            </button>
          </Link>
        )
    } else {
        return(
          <button
            className={props.bootstrapClass}
            type={props.type}
            onClick={props.onClick} 
        >
          {props.text}
          </button>
        )
      }
}