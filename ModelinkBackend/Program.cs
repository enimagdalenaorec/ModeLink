using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Data;

// Load environment variables from the .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
        .Replace("{POSTGRES_PASSWORD}", Environment.GetEnvironmentVariable("POSTGRES_PASSWORD"))
    )
);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
