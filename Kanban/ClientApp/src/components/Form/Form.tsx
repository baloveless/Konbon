import React, { useEffect, useState, SyntheticEvent, ChangeEvent, FormEvent } from "react";
import { InputField } from "./InputField"
import { IForm, formatDate, formatPhoneNumber, submitVerify } from "../../util/inputUtil";
import { formSelector } from "../../util/formUtil";
import { Button } from "./Button";

export class Form extends React.Component<any, IForm>{
  constructor(props: any) {
    super(props)
    this.state = formSelector[props.form];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);

    if (props.fillValues !== undefined && props.fillValues !== null) {
      let partialState = this.state.fields;
      let keys = Object.keys(props.fillValues)
      keys.forEach((value) => {
        partialState.forEach((field, index) => {
          if (value === field.id) {
            partialState[index].value = props.fillValues[value]
          }
        })
      })
      this.setState({
        fields: partialState,
      })
    }
  }

  resetForm() {
    let partialState = this.state.fields;
    this.state.fields.map((field, index) => {
      partialState[index].value = "";
    })
    this.setState({fields:partialState})
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    let partialState = this.state.fields;
    let newVal = event.target.value;
    let fieldIndex = partialState.findIndex((value) => value.id === event.target.id)
    let field = partialState[fieldIndex]
    switch (field.format) {
      case "date":
        newVal = formatDate(newVal)
        break;
      case "phoneNumber":
        newVal = formatPhoneNumber(newVal)
        break;
    }
    partialState[fieldIndex].value = newVal;
    this.setState({ fields: partialState })
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let success = this.state.submit(this.state.fields, this.props.afterSubmit)
    if (success)
      this.resetForm();
  }

  render(): React.ReactNode {
    const form = [];
    const fields = this.state.fields.map((field) =>
      <InputField
        key={field.id}
        label={field.label}
        id={field.id}
        value={field.value ? field.value : ""}
        name={field.name}
        placeholder={field.placeholder}
        type={field.type}
        autoComplete={field.autoComplete}
        hidden={field.hidden}
        options={field.options}
        list={field.list}
        disabled={field.disabled}
        noEdit={field.noEdit}
        onChange={this.handleChange}
        readonly={field.readonly}
      ></InputField>
    )
    form.push(<div className="info" key="info">{fields}</div>);
    const buttons = this.state.buttons.map((button, index) =>
      <Button
        key={button.text}
        text={button.text}
        disabled={button.type === "submit" ? !submitVerify(this.state.fields) : false}
        type={button.type}
        hidden={button.hidden}
        to={button.to}
        bootstrapClass={button.bootstrapClass}
        onClick={button.type==="reset" ? this.resetForm : button.onClick}
      />
    )

    form.push(buttons);
    return (
      <form
        id={this.props.form}
        onSubmit={this.handleSubmit}
      >
        {form}
      </form>
    )
  }
}
