import { IForm, IField, IButton, dayMaxVal, stringToNum } from "./inputUtil"

export enum Status {
    Todo, 
    InProgress, 
    Completed
}

export interface Issue {
    id: number, 
    subject: string, 
    description: string,
    createdOn: Date, 
    status: Status, 
}
export const fields: IField[] = [
  {
    id: "subject",
    label: "Subject",
    type: "textbox",
    placeholder: "Subject",
    value: "",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Description",
    value: "",
  },
]

export const buttons: IButton[] = [
  {
    text: "Create Issue",
    type: "submit",
    bootstrapClass: "btn btn-success"
  },
  {
    text: "Clear Form",
    type: "reset", 
    bootstrapClass: "btn btn-secondary"
  }
]

export const editButtons: IButton[] = [
  {
    text: "Save Changes",
    type: "submit",
    bootstrapClass: "btn btn-success"
  },
  {
    text: "Clear Form",
    type: "reset", 
    bootstrapClass: "btn btn-secondary"
  }
]

export const FormToHttpBody = (form: IField[]) => {
  return {
    subject: form[0].value,
    description: form[1].value,
    createdOn: new Date(),
    status: 0,
  }
}

export const submitIssue = async (form: IField[], afterSubmit: Function) => {
  try {
    let resp = await fetch("issue/create", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-type":"application/json",
      },
      body: JSON.stringify(FormToHttpBody(form))
    });
    let data = await resp.json();
    afterSubmit(data);
    return true;
  } catch (err) {
    console.error(err)
    alert("Failed to submit issue")
    return false;
  }
};

export const deleteIssue = async (form: Issue) => {
  try {
    let resp = await fetch("issue/delete", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-type":"application/json",
      },
      body: JSON.stringify(form)
    });
    let data = await resp.json();
    return data.success;
  } catch (err) {
    return false;
  }
}

export const editIssue = async (form: Issue) => {
  try {
    let resp = await fetch("issue/edit", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form)
    });
    let data = await resp.json();
    return data.success;
  } catch (err) {
    return false;
  }
}

export const getIssueById = async (id:number) => {
  try {
    let resp = await fetch("issue/" +id, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form)
    });
    let data = await resp.json();
    return data;
  } catch (err) {
    return null;
  }
}

/**
* Fixes cursor position when using date field 
* @param e 
* @param cursorPos 
*/
export const onFocus = (e: any, cursorPos: any) => {
  let reg = new RegExp("/")
  let addedSlashes = reg.exec(e.target.value);
  let changePos = 0;
  if (addedSlashes)
    changePos = addedSlashes.length;
  e.target.selectionStart = cursorPos + changePos;
  e.target.selectionEnd = cursorPos + changePos;
}


export const form: IForm = {
  fields: fields,
  buttons: buttons,
  submit: submitIssue,
  onFocus: onFocus
}

export const editForm: IForm = {
  fields: fields, 
  buttons: editButtons, 
  submit: editIssue, 
  onFocus: onFocus
}


