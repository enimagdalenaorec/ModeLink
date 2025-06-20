﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ModelinkBackend.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ModelinkBackend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250416074345_AddProfilePictureToEvents")]
    partial class AddProfilePictureToEvents
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Agency", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("CityId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProfilePictureBase64")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CityId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Agencies");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.City", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CountryId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CountryId");

                    b.ToTable("Cities");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Country", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("AgencyId")
                        .HasColumnType("integer");

                    b.Property<int>("CityId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<DateTime?>("EventFinish")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("EventStart")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ProfilePictureBase64")
                        .HasColumnType("text");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("AgencyId");

                    b.HasIndex("CityId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.FreelancerRequest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AgencyId")
                        .HasColumnType("integer");

                    b.Property<int>("ModelId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("RequestedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("AgencyId");

                    b.HasIndex("ModelId");

                    b.ToTable("FreelancerRequests");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Model", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("AgencyId")
                        .HasColumnType("integer");

                    b.Property<int?>("CityId")
                        .HasColumnType("integer");

                    b.Property<string>("EyeColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("HairColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("Height")
                        .HasColumnType("numeric");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProfilePictureBase64")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Sex")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SkinColor")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<decimal>("Weight")
                        .HasColumnType("numeric");

                    b.HasKey("Id");

                    b.HasIndex("AgencyId");

                    b.HasIndex("CityId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Models");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.ModelApplication", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AppliedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("EventId")
                        .HasColumnType("integer");

                    b.Property<int>("ModelId")
                        .HasColumnType("integer");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.HasIndex("ModelId");

                    b.ToTable("ModelApplications");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.ModelStatusHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("AgencyId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ModelId")
                        .HasColumnType("integer");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("AgencyId");

                    b.HasIndex("ModelId");

                    b.ToTable("ModelStatusHistories");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.PortfolioImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ImageBase64")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PostId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.ToTable("PortfolioImages");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.PortfolioPost", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<int>("ModelId")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ModelId");

                    b.ToTable("PortfolioPosts");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Agency", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.City", "City")
                        .WithMany("Agencies")
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("ModelinkBackend.Models.Entities.User", "User")
                        .WithOne("Agency")
                        .HasForeignKey("ModelinkBackend.Models.Entities.Agency", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("City");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.City", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Country", "Country")
                        .WithMany("Cities")
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Country");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Event", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Agency", "Agency")
                        .WithMany("Events")
                        .HasForeignKey("AgencyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ModelinkBackend.Models.Entities.City", "City")
                        .WithMany("Events")
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Agency");

                    b.Navigation("City");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.FreelancerRequest", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Agency", "Agency")
                        .WithMany("FreelancerRequests")
                        .HasForeignKey("AgencyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ModelinkBackend.Models.Entities.Model", "Model")
                        .WithMany("FreelancerRequests")
                        .HasForeignKey("ModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Agency");

                    b.Navigation("Model");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Model", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Agency", "Agency")
                        .WithMany("Models")
                        .HasForeignKey("AgencyId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelinkBackend.Models.Entities.City", "City")
                        .WithMany("Models")
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelinkBackend.Models.Entities.User", "User")
                        .WithOne("Model")
                        .HasForeignKey("ModelinkBackend.Models.Entities.Model", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Agency");

                    b.Navigation("City");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.ModelApplication", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Event", "Event")
                        .WithMany("ModelApplications")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ModelinkBackend.Models.Entities.Model", "Model")
                        .WithMany("ModelApplications")
                        .HasForeignKey("ModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Event");

                    b.Navigation("Model");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.ModelStatusHistory", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Agency", "Agency")
                        .WithMany()
                        .HasForeignKey("AgencyId");

                    b.HasOne("ModelinkBackend.Models.Entities.Model", "Model")
                        .WithMany("StatusHistory")
                        .HasForeignKey("ModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Agency");

                    b.Navigation("Model");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.PortfolioImage", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.PortfolioPost", "PortfolioPost")
                        .WithMany("PortfolioImages")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PortfolioPost");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.PortfolioPost", b =>
                {
                    b.HasOne("ModelinkBackend.Models.Entities.Model", "Model")
                        .WithMany("PortfolioPosts")
                        .HasForeignKey("ModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Model");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Agency", b =>
                {
                    b.Navigation("Events");

                    b.Navigation("FreelancerRequests");

                    b.Navigation("Models");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.City", b =>
                {
                    b.Navigation("Agencies");

                    b.Navigation("Events");

                    b.Navigation("Models");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Country", b =>
                {
                    b.Navigation("Cities");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Event", b =>
                {
                    b.Navigation("ModelApplications");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.Model", b =>
                {
                    b.Navigation("FreelancerRequests");

                    b.Navigation("ModelApplications");

                    b.Navigation("PortfolioPosts");

                    b.Navigation("StatusHistory");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.PortfolioPost", b =>
                {
                    b.Navigation("PortfolioImages");
                });

            modelBuilder.Entity("ModelinkBackend.Models.Entities.User", b =>
                {
                    b.Navigation("Agency");

                    b.Navigation("Model");
                });
#pragma warning restore 612, 618
        }
    }
}
