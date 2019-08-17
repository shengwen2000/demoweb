﻿// <auto-generated />
using System;
using EfCore.Test.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace EfCore.Test.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("EfCore.Test.Data.DmOrder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CustomName")
                        .IsRequired()
                        .HasMaxLength(10);

                    b.Property<string>("No")
                        .IsRequired()
                        .HasMaxLength(10);

                    b.Property<DateTime>("OrdDate");

                    b.Property<string>("ToAddress")
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.HasIndex("No")
                        .IsUnique();

                    b.ToTable("DmOrder");
                });
#pragma warning restore 612, 618
        }
    }
}
