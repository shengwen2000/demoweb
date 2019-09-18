using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApp.Models;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.AspNetCore.Identity;
using Shengwen.Primary;
using Shengwen.Scheduler;
using Shengwen.QueueTask;
using WebApp.Services;

namespace WebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, AppRole, int, IdentityUserClaim<int>, AppRoleUser, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);


            builder.HasDefaultSchema("web001");

            builder.Entity<DbVersion>();           

            builder.Entity<SysIdEncode>();

            builder.Entity<ApplicationUser>().HasMany(x => x.Roles).WithOne(x => x.User).HasForeignKey(x => x.UserId);
            builder.Entity<ApplicationUser>().HasOne(x => x.SkMember).WithOne(x => x.AppUser).OnDelete(DeleteBehavior.SetNull);

            builder.Entity<AppRole>().HasMany(x => x.Users).WithOne(x => x.Role).HasForeignKey(x => x.RoleId);          

            builder.Entity<TnTaskNotify>().HasOne(x => x.User).WithMany().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<TnTaskNotify>().Property(x => x.GId).ValueGeneratedOnAdd().HasDefaultValueSql("newsequentialid()");

            builder.Entity<TnUserNotify>().HasOne(x => x.User).WithMany().OnDelete(DeleteBehavior.Cascade);

            builder.AddPrimaryServiceModel();

            builder.AddSchedulerServiceModel();

            builder.AddQueueTaskServiceModel<DefaultQueueContext>("Default");

            builder.Entity<SkMember>().HasIndex(x => x.No).IsUnique();
            builder.Entity<SkMember>().HasOne(x => x.Parent).WithMany(x => x.Childs).HasForeignKey(x => x.ParentId).OnDelete(DeleteBehavior.Restrict);
           
            builder.Entity<SkProduct>().HasIndex(x => x.Code).IsUnique();

            builder.Entity<SkOrder>().HasMany(x => x.Items).WithOne(x => x.Order).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<SkOrder>().HasOne(x => x.Member).WithMany(x => x.Orders).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<SkOrder>().Property(x => x.RowVersion).IsRowVersion();
            builder.Entity<SkOrder>().HasIndex(x => x.No).IsUnique();
    
            //builder.Entity<SkOrdItem>().HasOne(x => x.Order).WithMany().HasForeignKey(x => x.OrderId)


            builder.Entity<DmStudent>().HasIndex(x => x.No).IsUnique();
            builder.Entity<DmStudent>().HasMany(x => x.Courses).WithOne(x => x.Student);

            builder.Entity<DmCourse>().HasMany(x => x.Students).WithOne(x => x.Course);

            builder.Entity<DmStuCour>().HasKey(x => new { x.StudentId, x.CourseId});
        }

    }
}
