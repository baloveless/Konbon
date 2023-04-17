using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Kanban.Models
{

  public enum Status
  {
    Todo,
    InProgress,
    Completed
  }

  public class Comment
  {
    [Key]
    [Column("ID")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }
    public string Text { get; set; }
    public int IssueID { get; set; }
    public DateTime CreatedOn { get; set; }
    public Comment()
    {
      Text = string.Empty;
    }
  }
  public class Issue
  {
    [Key]
    [Column("ID")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; }
    public string Subject { get; set; }
    public string Description { get; set; }
    public DateTime CreatedOn { get; set; }
    public Status Status { get; set; }
    public Issue()
    {
      Subject = string.Empty;
      Description = string.Empty;
    }
  }

  public class KanbanDBContext : DbContext
  {
    public KanbanDBContext(DbContextOptions<KanbanDBContext> options) : base(options)
    {
    }
    public DbSet<Issue>? Issues { get; set; }
    public DbSet<Comment>? Comments { get; set; }
  }
} 