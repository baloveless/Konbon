import React from "react";
import { IField } from "../../util/inputUtil";

export function InputField(props: IField) {
    const createOptions = (options: any) => {
        let items: any = []
        options.forEach((item: any, index: any) => {
            if (item.value !== '') {
                items.push(
                    <option
                        key={item + index}
                        value={item}
                    >
                        {item}
                    </option>
                )
            }
        });
        return <>{items}</>
    }
    if (props.type === 'select') {
        return (
            <label htmlFor={props.id} key={props.id}>
                {props.label}
                <select
                    id={props.id}
                    name={props.id}
                    value={props.value}
                    role={props.type}
                    required
                    onChange={props.onChange}
                >
                    {createOptions(props.options)}
                </select>
            </label>
        )
    } else if (props.type === 'textarea') {
        return (
            <label hidden={props.hidden || props.noEdit ? true : false} htmlFor={props.id} key={props.id} >
                <textarea
                    read-only={props.readonly}
                    role={props.type}
                    name={props.id}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.value ? props.value : ""}
                    autoComplete={props.autoComplete}
                    onChange={props.onChange}
                    disabled={props.disabled}
                />
            </label>
        )
    } else {
        return (
            <label hidden={props.hidden || props.noEdit ? true : false} htmlFor={props.id} key={props.id} >
                {props.label}:
                <input
                    read-only={props.readonly}
                    role={props.type}
                    name={props.id}
                    id={props.id}
                    type={props.type}
                    placeholder={props.placeholder}
                    value={props.value ? props.value : ""}
                    autoComplete={props.autoComplete}
                    list={props.list}
                    onChange={props.onChange}
                    disabled={props.disabled}
                    className="textField"
                />
            </label>
        )
    }
}