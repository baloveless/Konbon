using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Kanban.Models;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddDbContext<KanbanDBContext>(options =>
  options.UseSqlServer(builder.Configuration.GetConnectionString("db")));

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}

app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
