import { form as IssueForm, editForm } from './issueFormUtil'
import { IForm } from './inputUtil'
interface IFormSelector{
  [formName:string]:IForm
}
export const formSelector:IFormSelector = {
  "IssueForm": IssueForm,
  "EditForm": editForm,
}