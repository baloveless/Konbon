import React, { Component, SyntheticEvent } from 'react';
import { Modal } from "./Modal"
import { Issue, Status, deleteIssue, editIssue } from "../util/issueFormUtil"
import { Button } from "./Form/Button"
import "../Style/issueBoard.css"


interface IBoard {
  issues: Issue[],
  showModal: boolean,
  loading: boolean,
  modalForm: string
  selectedIssue: Issue,
  showDeleteMenu: boolean
}


export class IssueBoard extends Component<any, IBoard> {

  constructor(props: any) {
    super(props);
    this.state = {
      issues: [], showModal: false, loading: true, modalForm: "IssueForm",
      selectedIssue: { id: 0, subject: "", description: "", status: Status.Todo, createdOn:new Date() },
      showDeleteMenu: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.refreshBoard = this.refreshBoard.bind(this);
    this.renderTaskBoard = this.renderTaskBoard.bind(this);
    this.renderTaskTable = this.renderTaskTable.bind(this);
    this.renderIssueRow = this.renderIssueRow.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.changeForm = this.changeForm.bind(this);
    this.handleIssueDetails = this.handleIssueDetails.bind(this);
  }

  componentDidMount() {
    this.populateTaskData();
  }

  toggleModal(e: any) {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  changeForm(modalForm: string) {
    this.setState({
      modalForm: modalForm,
    })
  }

  refreshBoard() {
    this.setState({ loading: true });
    this.populateTaskData()
  }  

  renderIssueRow(issues: any, column: string) {
    var ret: JSX.Element[] = [];
    issues.map((issue: Issue, index: number) => {
      ret.push(
        <div key={column + "-" + issue.id} className="border border-dark rounded-3 bg-light">
          {issue.subject}
        </div>
      )
    })
    return ret;
  }


  handleDrop = async (event: React.DragEvent<HTMLDivElement>, status: Status) => {
    event.preventDefault();
    const issueId = parseInt(event.dataTransfer.getData('text/plain'));

    const issues = this.state.issues.map((issue) => {
      if (issue.id === issueId) {
        return { ...issue, status: status };
      }
      return issue;
    });


    const editedIssue = issues.find(issue => issue.id === issueId);
    if (editedIssue) {
      const response = await editIssue(editedIssue);
      if (response) {
        this.setState({ issues: issues });
      } else {
        alert("Failed to update record");
      }
    }

    this.setState({ issues: issues });
  };

  handleIssueDetails = async (issue: Issue) => {
    this.setState({
      selectedIssue: issue
    })   
  }


  renderTaskBoard(issues: any) {
    const todo: Issue[] = [];
    const inProgress: Issue[] = [];
    const completed: Issue[] = [];

    issues.forEach((issue: Issue) => {
      switch (issue.status) {
        case Status.Todo:
          todo.push(issue);
          break;
        case Status.InProgress:
          inProgress.push(issue);
          break;
        case Status.Completed:
          completed.push(issue);
          break;
      }
    });

    return (
      <div className="kanban-board">
        <div className="column" onDragOver={(event) => event.preventDefault()} onDrop={(event) => this.handleDrop(event, Status.Todo)}>
          <h2>Todo</h2>
          {todo.map((issue) => (
            <div key={issue.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', issue.id.toString())} className="card flex-row justify-content-between"
              onClick={(event) => { this.changeForm("EditForm"); this.handleIssueDetails(issue); this.toggleModal(event) }}>
              <p>{issue.subject}</p>
              <p onClick={(event) => {
                event.stopPropagation(); // prevent the click event from bubbling up to the outer div
                this.setState({ selectedIssue: issue }); // set the active issue in state
                this.setState({ showDeleteMenu: true }); // show the delete menu
              }}> &#8942;</p>
            </div>
          ))}
        </div>
        <div className="column" onDragOver={(event) => event.preventDefault()} onDrop={(event) => this.handleDrop(event, Status.InProgress)}>
          <h2>In Progress</h2>
          {inProgress.map((issue) => (
            <div key={issue.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', issue.id.toString())} className="card flex-row justify-content-between"
              onClick={(event) => { this.changeForm("EditForm");this.handleIssueDetails(issue); this.toggleModal(event) }}>
              <p>{issue.subject}</p>
              <p onClick={(event) => {
                event.stopPropagation(); // prevent the click event from bubbling up to the outer div
                this.setState({ selectedIssue: issue }); // set the active issue in state
                this.setState({ showDeleteMenu: true }); // show the delete menu
              }}> &#8942;</p>
            </div>
          ))}
        </div>
        <div className="column" onDragOver={(event) => event.preventDefault()} onDrop={(event) => this.handleDrop(event, Status.Completed)}>
          <h2>Completed</h2>
          {completed.map((issue) => (
            <div key={issue.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', issue.id.toString())} className="card flex-row justify-content-between"
              onClick={(event) => { this.changeForm("EditForm");this.handleIssueDetails(issue); this.toggleModal(event) }}>
              <p>{issue.subject}</p>
              <p onClick={(event) => {
                event.stopPropagation(); // prevent the click event from bubbling up to the outer div
                this.setState({ selectedIssue: issue }); // set the active issue in state
                this.setState({ showDeleteMenu: true }); // show the delete menu
              }}> &#8942;</p>
            </div>
          ))}
        </div>
        {this.state.showDeleteMenu && (
          <div className="delete-menu">
            <p>Are you sure you want to delete "{this.state.selectedIssue.subject}"?</p>
            <button onClick={() => {
              deleteIssue(this.state.selectedIssue);
              this.setState({ showDeleteMenu: false }); // hide the delete menu
            }}>Delete</button>
            <button onClick={() => {
              this.setState({ showDeleteMenu: false }); // hide the delete menu
            }}>Cancel</button>
          </div>
        )}
      </div>
    );
  }

  renderTaskTable(issues: any) {
    return (
      <div>
        <table className='table table-striped' aria-labelledby="tableLabel">
          <thead>
            <tr>
              <th> ID </th>
              <th> Subject </th>
              <th> Description </th>
              <th> CreatedOn </th>
              <th> Status </th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue: {id:number, subject:string, description:string, createdOn:any, status:number}, index:number) =>
              <tr key={index}>
                <td>{issue.id} </td>
                <td>{issue.subject} </td>
                <td>{issue.description} </td>
                <td>{issue.createdOn}</td>
                <td>{Status[issue.status]} </td>
                <td
                  className="btn btn-outline-primary"
                  onClick={
                    (e) => {
                      this.setState({ modalForm: "EditForm", selectedIssue: issue })
                      this.toggleModal(e) 
                    }
                  }
                >Edit</td>
                <td
                  className="btn btn-outline-danger"
                  onClick={
                    async (e) => await deleteIssue(issue) ? 
                        this.refreshBoard() :
                        alert("Failed to delete record")
                  }
                >Delete</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

                                //<td>{issue.CreatedOn} </td>


  render() {
    let contents = this.state.loading
      ? <p><em>loading...</em></p>
      : this.renderTaskBoard(this.state.issues);
    return (
      <div>
        <div className="d-flex flex-row justify-content-between">
          <h1>Task Board</h1>
          <Button text="Create Issue" type="button" bootstrapClass="btn btn-primary" onClick={e => { this.changeForm("IssueForm"); this.toggleModal(e) }}></Button>
        </div>
        <div className="pt-3">
          <Modal form={this.state.modalForm} showModal={this.state.showModal} toggleModal={this.toggleModal} refreshBoard={this.refreshBoard} 
            issue={this.state.issues.filter((issue) => { if (issue.id === this.state.selectedIssue.id) return issue})[0]}></Modal>
        </div>
        <div>{contents}</div>
      </div>
    )
  }

  async populateTaskData() {
    const response = await fetch('issue');
    const data = await response.json();
    console.log("board response ", data)
    this.setState({ issues: data, loading: false })
  }

}