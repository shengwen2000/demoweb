using Microsoft.EntityFrameworkCore.Migrations;

namespace EfCore.Test.Migrations
{
    public partial class V002 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_DmOrder_No",
                table: "DmOrder",
                column: "No",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DmOrder_No",
                table: "DmOrder");
        }
    }
}
