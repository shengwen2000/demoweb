using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApp.Migrations
{
    public partial class V003 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "No",
                schema: "web001",
                table: "SkOrder",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "DmCourse",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DmCourse", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DmStudent",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    No = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DmStudent", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DmStuCour",
                schema: "web001",
                columns: table => new
                {
                    StudentId = table.Column<int>(nullable: false),
                    CourseId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DmStuCour", x => new { x.StudentId, x.CourseId });
                    table.ForeignKey(
                        name: "FK_DmStuCour_DmCourse_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "web001",
                        principalTable: "DmCourse",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DmStuCour_DmStudent_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "web001",
                        principalTable: "DmStudent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DmStuCour_CourseId",
                schema: "web001",
                table: "DmStuCour",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_DmStudent_No",
                schema: "web001",
                table: "DmStudent",
                column: "No",
                unique: true,
                filter: "[No] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DmStuCour",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "DmCourse",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "DmStudent",
                schema: "web001");

            migrationBuilder.AlterColumn<string>(
                name: "No",
                schema: "web001",
                table: "SkOrder",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 20,
                oldNullable: true);
        }
    }
}
