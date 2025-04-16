using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ModelinkBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddProfilePictureToEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureBase64",
                table: "Events",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureBase64",
                table: "Events");
        }
    }
}
