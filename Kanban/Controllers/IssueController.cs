using Kanban.Models;
using Microsoft.AspNetCore.Mvc;

/**
 * Blake Loveless
 * 3/13/2023
 * 
 * This file will be used to retrieve data on tasks for the react pages. 
 * */

namespace Kanban.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class IssueController : ControllerBase
  {
    private readonly KanbanDBContext _dbContext;

    public IssueController(KanbanDBContext dBContext)
    {
      _dbContext = dBContext; 
    }
    
    // GET: TaskController
    [HttpGet]
    public IEnumerable<Issue> GetAll()
    {
      var tasks = from t in _dbContext.Issues
                  orderby t.ID
                  select t;
      return tasks;
    }

    [HttpPost]
    [Route("{id}")]
    public ActionResult Get(int ID)
    {
      try
      {
        var issue = _dbContext.Entry(ID);
        return StatusCode(200, new {success=true, issue});
      } catch (Exception ex)
      {
        return StatusCode(200, new {success=false});
      }
    }

    // Adds issue to DB returns 1 on success 0 on failure. 
    [HttpPost]
    [Route("create")]
    public ActionResult Create(Issue issue)
    {
      try
      {
        _dbContext.Issues?.Add(issue);
        _dbContext.SaveChanges();
        return StatusCode(200, new {success=true});
      }
      catch
      {
        return StatusCode(200, new {success=false});
      }
    }

    [HttpPost]
    [Route("delete")]
    public ActionResult Delete(Issue issue)
    {
      try
      {
        _dbContext.Issues?.Remove(issue);
        _dbContext.SaveChanges();
        return StatusCode(200, new {success=true});
      }
      catch (Exception e)
      {
        return StatusCode(200, new {success=false});
      }
    }

    [HttpPost]
    [Route("edit")]
    public ActionResult Edit(Issue issue)
    {
      try
      {
        _dbContext.Issues?.Update(issue);
        _dbContext.SaveChanges();
        return StatusCode(200, new {success=true});
      }
      catch (Exception e)
      {
        return StatusCode(200, new {success=false});
      }
    }
  }
}
