using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EfCore.Test.Data
{
    /// <summary>
    /// 
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {   
        }
      
        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=efcoretest;Trusted_Connection=True;MultipleActiveResultSets=true");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DmOrder>().HasIndex(x => x.No).IsUnique();
        }
    }
}
