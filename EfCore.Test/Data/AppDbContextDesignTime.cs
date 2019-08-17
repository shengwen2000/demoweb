// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace EfCore.Test.Data
{
    /// <summary>
    /// for design time efcore tools
    /// </summary>
    public class AppDbContextDesignTime : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=efcoretest;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new AppDbContext(builder.Options);
        }
    }
}
