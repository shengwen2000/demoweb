﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApp.Data;

namespace WebApp.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("1080823040809_V002")]
    partial class V002
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("web001")
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<int>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<int>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("Shengwen.Primary.Model.PrimaryInfo", b =>
                {
                    b.Property<Guid>("ClientNo");

                    b.Property<DateTime>("Created");

                    b.Property<string>("Name")
                        .HasMaxLength(20);

                    b.Property<int>("Priority");

                    b.Property<string>("RefreshPath")
                        .HasMaxLength(100);

                    b.Property<string>("SiteUrl")
                        .HasMaxLength(100);

                    b.HasKey("ClientNo", "Created");

                    b.ToTable("PrimaryInfo");
                });

            modelBuilder.Entity("Shengwen.QueueTask.Model.QtQueue<WebApp.Services.DefaultQueueContext>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.ToTable("DefaultQtQueue");
                });

            modelBuilder.Entity("Shengwen.QueueTask.Model.QtQueueEvent<WebApp.Services.DefaultQueueContext>", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created");

                    b.Property<int>("EvtKind");

                    b.Property<int>("QueueId");

                    b.Property<long>("TaskId");

                    b.HasKey("Id");

                    b.ToTable("DefaultQtQueueEvent");
                });

            modelBuilder.Entity("Shengwen.QueueTask.Model.QtQueueTask<WebApp.Services.DefaultQueueContext>", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Content")
                        .HasMaxLength(5000);

                    b.Property<DateTime>("Created");

                    b.Property<int>("QueueId");

                    b.Property<string>("Result")
                        .HasMaxLength(5000);

                    b.Property<short>("State");

                    b.HasKey("Id");

                    b.HasIndex("QueueId");

                    b.ToTable("DefaultQtQueueTask");
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobCron", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Cron");

                    b.Property<int>("JobId");

                    b.Property<DateTime?>("LimitEnd");

                    b.Property<DateTime?>("LimitStart");

                    b.HasKey("Id");

                    b.HasIndex("JobId");

                    b.ToTable("JobCron");
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsDisable");

                    b.Property<int?>("LastResultId");

                    b.Property<DateTime?>("LastRun");

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.Property<DateTime?>("NextRun");

                    b.Property<int>("State");

                    b.Property<string>("Title")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("LastResultId");

                    b.ToTable("JobInfo");
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobResult", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Duration");

                    b.Property<DateTime?>("EndTime");

                    b.Property<string>("Excetpion")
                        .HasMaxLength(1000);

                    b.Property<bool>("HasException");

                    b.Property<int>("JobId");

                    b.Property<DateTime>("StartTime");

                    b.Property<int>("State");

                    b.HasKey("Id");

                    b.HasIndex("JobId");

                    b.ToTable("JobResult");
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobStorage", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Json");

                    b.HasKey("Id");

                    b.ToTable("JobStorage");
                });

            modelBuilder.Entity("WebApp.Data.AppRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AuthMenus");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Desc")
                        .HasMaxLength(100);

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.Property<string>("Title")
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("WebApp.Data.AppRoleUser", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<int>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("WebApp.Data.ApplicationUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<DateTime>("Created");

                    b.Property<string>("EX_Name")
                        .HasMaxLength(20);

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("Remark")
                        .HasMaxLength(100);

                    b.Property<string>("SecurityStamp");

                    b.Property<int?>("SkMemberId");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.HasIndex("SkMemberId")
                        .IsUnique()
                        .HasFilter("[SkMemberId] IS NOT NULL");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("WebApp.Data.DbVersion", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasMaxLength(20);

                    b.Property<DateTime?>("UpdateTime");

                    b.HasKey("Id");

                    b.ToTable("DbVersion");
                });

            modelBuilder.Entity("WebApp.Data.SkMember", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Addr")
                        .HasMaxLength(500);

                    b.Property<DateTime?>("Birth");

                    b.Property<string>("Email")
                        .HasMaxLength(100);

                    b.Property<DateTime>("EntryDate");

                    b.Property<DateTime?>("LeaveDate");

                    b.Property<string>("LineNo")
                        .HasMaxLength(100);

                    b.Property<string>("Mobile")
                        .HasMaxLength(500);

                    b.Property<string>("Name")
                        .HasMaxLength(20);

                    b.Property<string>("No")
                        .HasMaxLength(10);

                    b.Property<string>("Note")
                        .HasMaxLength(500);

                    b.Property<int?>("ParentId");

                    b.Property<string>("Phone")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("No")
                        .IsUnique()
                        .HasFilter("[No] IS NOT NULL");

                    b.HasIndex("ParentId");

                    b.ToTable("SkMember");
                });

            modelBuilder.Entity("WebApp.Data.SkOrdItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("OrderId");

                    b.Property<int>("ProductId");

                    b.Property<int>("Qty");

                    b.Property<int>("TotalPrice");

                    b.Property<int>("UnitPrice");

                    b.HasKey("Id");

                    b.HasIndex("OrderId");

                    b.HasIndex("ProductId");

                    b.ToTable("SkOrdItem");
                });

            modelBuilder.Entity("WebApp.Data.SkOrder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CustName")
                        .HasMaxLength(20);

                    b.Property<int?>("MemberId");

                    b.Property<string>("No");

                    b.Property<string>("Note")
                        .HasMaxLength(500);

                    b.Property<DateTime>("OrderDate");

                    b.Property<byte[]>("RowVersion")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate();

                    b.Property<int>("TotalPrice");

                    b.HasKey("Id");

                    b.HasIndex("MemberId");

                    b.HasIndex("No")
                        .IsUnique()
                        .HasFilter("[No] IS NOT NULL");

                    b.ToTable("SkOrder");
                });

            modelBuilder.Entity("WebApp.Data.SkProduct", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code")
                        .HasMaxLength(20);

                    b.Property<DateTime?>("DisableDate");

                    b.Property<DateTime?>("EnableDate");

                    b.Property<bool>("IsEnable");

                    b.Property<int>("MemberPrice");

                    b.Property<string>("Name")
                        .HasMaxLength(20);

                    b.Property<int>("Price");

                    b.HasKey("Id");

                    b.HasIndex("Code")
                        .IsUnique()
                        .HasFilter("[Code] IS NOT NULL");

                    b.ToTable("SkProduct");
                });

            modelBuilder.Entity("WebApp.Data.SysIdEncode", b =>
                {
                    b.Property<int>("Id");

                    b.Property<int>("XorNum");

                    b.HasKey("Id");

                    b.ToTable("SysIdEncode");
                });

            modelBuilder.Entity("WebApp.Data.TnTaskNotify", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("Complete");

                    b.Property<DateTime>("Created");

                    b.Property<Guid>("GId")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValueSql("newsequentialid()");

                    b.Property<string>("Result")
                        .HasMaxLength(2000);

                    b.Property<int>("State");

                    b.Property<string>("Title")
                        .HasMaxLength(100);

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("TnTaskNotify");
                });

            modelBuilder.Entity("WebApp.Data.TnUserNotify", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("TnUserNotify");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.HasOne("WebApp.Data.AppRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.HasOne("WebApp.Data.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.HasOne("WebApp.Data.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.HasOne("WebApp.Data.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Shengwen.QueueTask.Model.QtQueueTask<WebApp.Services.DefaultQueueContext>", b =>
                {
                    b.HasOne("Shengwen.QueueTask.Model.QtQueue<WebApp.Services.DefaultQueueContext>", "Queue")
                        .WithMany("Tasks")
                        .HasForeignKey("QueueId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobCron", b =>
                {
                    b.HasOne("Shengwen.Scheduler.Model.JobInfo", "Job")
                        .WithMany("Crons")
                        .HasForeignKey("JobId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobInfo", b =>
                {
                    b.HasOne("Shengwen.Scheduler.Model.JobResult", "LastResult")
                        .WithMany()
                        .HasForeignKey("LastResultId");
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobResult", b =>
                {
                    b.HasOne("Shengwen.Scheduler.Model.JobInfo", "Job")
                        .WithMany("Results")
                        .HasForeignKey("JobId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Shengwen.Scheduler.Model.JobStorage", b =>
                {
                    b.HasOne("Shengwen.Scheduler.Model.JobInfo", "Job")
                        .WithOne("Storage")
                        .HasForeignKey("Shengwen.Scheduler.Model.JobStorage", "Id")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("WebApp.Data.AppRoleUser", b =>
                {
                    b.HasOne("WebApp.Data.AppRole", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("WebApp.Data.ApplicationUser", "User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("WebApp.Data.ApplicationUser", b =>
                {
                    b.HasOne("WebApp.Data.SkMember", "SkMember")
                        .WithOne("AppUser")
                        .HasForeignKey("WebApp.Data.ApplicationUser", "SkMemberId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("WebApp.Data.SkMember", b =>
                {
                    b.HasOne("WebApp.Data.SkMember", "Parent")
                        .WithMany("Childs")
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("WebApp.Data.SkOrdItem", b =>
                {
                    b.HasOne("WebApp.Data.SkOrder", "Order")
                        .WithMany("Items")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("WebApp.Data.SkProduct", "Product")
                        .WithMany()
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("WebApp.Data.SkOrder", b =>
                {
                    b.HasOne("WebApp.Data.SkMember", "Member")
                        .WithMany("Orders")
                        .HasForeignKey("MemberId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("WebApp.Data.TnTaskNotify", b =>
                {
                    b.HasOne("WebApp.Data.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("WebApp.Data.TnUserNotify", b =>
                {
                    b.HasOne("WebApp.Data.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
