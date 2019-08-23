using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApp.Migrations
{
    public partial class V002 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SkMemberId",
                schema: "web001",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SkMember",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ParentId = table.Column<int>(nullable: true),
                    EntryDate = table.Column<DateTime>(nullable: false),
                    LeaveDate = table.Column<DateTime>(nullable: true),
                    No = table.Column<string>(maxLength: 10, nullable: true),
                    Name = table.Column<string>(maxLength: 20, nullable: true),
                    Birth = table.Column<DateTime>(nullable: true),
                    Addr = table.Column<string>(maxLength: 500, nullable: true),
                    Email = table.Column<string>(maxLength: 100, nullable: true),
                    LineNo = table.Column<string>(maxLength: 100, nullable: true),
                    Phone = table.Column<string>(maxLength: 100, nullable: true),
                    Mobile = table.Column<string>(maxLength: 500, nullable: true),
                    Note = table.Column<string>(maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkMember_SkMember_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "web001",
                        principalTable: "SkMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SkProduct",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 20, nullable: true),
                    Price = table.Column<int>(nullable: false),
                    MemberPrice = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 20, nullable: true),
                    EnableDate = table.Column<DateTime>(nullable: true),
                    DisableDate = table.Column<DateTime>(nullable: true),
                    IsEnable = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkProduct", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SkOrder",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    No = table.Column<string>(nullable: true),
                    OrderDate = table.Column<DateTime>(nullable: false),
                    MemberId = table.Column<int>(nullable: true),
                    CustName = table.Column<string>(maxLength: 20, nullable: true),
                    TotalPrice = table.Column<int>(nullable: false),
                    Note = table.Column<string>(maxLength: 500, nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkOrder", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkOrder_SkMember_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "web001",
                        principalTable: "SkMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SkOrdItem",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    OrderId = table.Column<int>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    Qty = table.Column<int>(nullable: false),
                    UnitPrice = table.Column<int>(nullable: false),
                    TotalPrice = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkOrdItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkOrdItem_SkOrder_OrderId",
                        column: x => x.OrderId,
                        principalSchema: "web001",
                        principalTable: "SkOrder",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SkOrdItem_SkProduct_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "web001",
                        principalTable: "SkProduct",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_SkMemberId",
                schema: "web001",
                table: "AspNetUsers",
                column: "SkMemberId",
                unique: true,
                filter: "[SkMemberId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SkMember_No",
                schema: "web001",
                table: "SkMember",
                column: "No",
                unique: true,
                filter: "[No] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SkMember_ParentId",
                schema: "web001",
                table: "SkMember",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_SkOrder_MemberId",
                schema: "web001",
                table: "SkOrder",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_SkOrder_No",
                schema: "web001",
                table: "SkOrder",
                column: "No",
                unique: true,
                filter: "[No] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SkOrdItem_OrderId",
                schema: "web001",
                table: "SkOrdItem",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_SkOrdItem_ProductId",
                schema: "web001",
                table: "SkOrdItem",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SkProduct_Code",
                schema: "web001",
                table: "SkProduct",
                column: "Code",
                unique: true,
                filter: "[Code] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_SkMember_SkMemberId",
                schema: "web001",
                table: "AspNetUsers",
                column: "SkMemberId",
                principalSchema: "web001",
                principalTable: "SkMember",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_SkMember_SkMemberId",
                schema: "web001",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "SkOrdItem",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "SkOrder",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "SkProduct",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "SkMember",
                schema: "web001");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_SkMemberId",
                schema: "web001",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SkMemberId",
                schema: "web001",
                table: "AspNetUsers");
        }
    }
}
