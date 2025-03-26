using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<ModelStatusHistory> ModelStatusHistories { get; set; }
        public DbSet<Agency> Agencies { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<ModelApplication> ModelApplications { get; set; }
        public DbSet<FreelancerRequest> FreelancerRequests { get; set; }
        public DbSet<PortfolioPost> PortfolioPosts { get; set; }
        public DbSet<PortfolioImage> PortfolioImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique constraint for User.Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // One-to-One: User ↔ Model & User ↔ Agency
            modelBuilder.Entity<User>()
                .HasOne<Model>(u => u.Model)
                .WithOne(m => m.User)
                .HasForeignKey<Model>(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne<Agency>(u => u.Agency)
                .WithOne(a => a.User)
                .HasForeignKey<Agency>(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One: Model ↔ Agency (nullable)
            modelBuilder.Entity<Model>()
                .HasOne(m => m.Agency)
                .WithMany(a => a.Models)
                .HasForeignKey(m => m.AgencyId)
                .OnDelete(DeleteBehavior.SetNull);

            // Many-to-One: Model ↔ City
            modelBuilder.Entity<Model>()
                .HasOne(m => m.City)
                .WithMany(c => c.Models)
                .HasForeignKey(m => m.CityId)
                .OnDelete(DeleteBehavior.SetNull);

            // Many-to-One: Agency ↔ City
            modelBuilder.Entity<Agency>()
                .HasOne(a => a.City)
                .WithMany(c => c.Agencies)
                .HasForeignKey(a => a.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-One: Event ↔ Agency
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Agency)
                .WithMany(a => a.Events)
                .HasForeignKey(e => e.AgencyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One: Event ↔ City
            modelBuilder.Entity<Event>()
                .HasOne(e => e.City)
                .WithMany(c => c.Events)
                .HasForeignKey(e => e.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-One: ModelApplications ↔ Model & Event
            modelBuilder.Entity<ModelApplication>()
                .HasOne(ma => ma.Model)
                .WithMany(m => m.ModelApplications)
                .HasForeignKey(ma => ma.ModelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ModelApplication>()
                .HasOne(ma => ma.Event)
                .WithMany(e => e.ModelApplications)
                .HasForeignKey(ma => ma.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One: FreelancerRequest ↔ Model & Agency
            modelBuilder.Entity<FreelancerRequest>()
                .HasOne(fr => fr.Model)
                .WithMany(m => m.FreelancerRequests)
                .HasForeignKey(fr => fr.ModelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FreelancerRequest>()
                .HasOne(fr => fr.Agency)
                .WithMany(a => a.FreelancerRequests)
                .HasForeignKey(fr => fr.AgencyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One: PortfolioPost ↔ Model
            modelBuilder.Entity<PortfolioPost>()
                .HasOne(pp => pp.Model)
                .WithMany(m => m.PortfolioPosts)
                .HasForeignKey(pp => pp.ModelId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-One: PortfolioImage ↔ PortfolioPost
            modelBuilder.Entity<PortfolioImage>()
                .HasOne(pi => pi.PortfolioPost)
                .WithMany(pp => pp.PortfolioImages)
                .HasForeignKey(pi => pi.PostId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
