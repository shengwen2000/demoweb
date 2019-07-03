using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApp.Migrations
{
    public partial class V001 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "web001");

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Title = table.Column<string>(maxLength: 50, nullable: true),
                    Desc = table.Column<string>(maxLength: 100, nullable: true),
                    AuthMenus = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    EX_Name = table.Column<string>(maxLength: 20, nullable: true),
                    Remark = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CruxMsgSubject",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 20, nullable: true),
                    Code = table.Column<string>(maxLength: 20, nullable: true),
                    Note = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruxMsgSubject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DbVersion",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 20, nullable: true),
                    UpdateTime = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbVersion", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DefaultQtQueue",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefaultQtQueue", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DefaultQtQueueEvent",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    QueueId = table.Column<int>(nullable: false),
                    TaskId = table.Column<long>(nullable: false),
                    EvtKind = table.Column<int>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefaultQtQueueEvent", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrimaryInfo",
                schema: "web001",
                columns: table => new
                {
                    ClientNo = table.Column<Guid>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(maxLength: 20, nullable: true),
                    Priority = table.Column<int>(nullable: false),
                    SiteUrl = table.Column<string>(maxLength: 100, nullable: true),
                    RefreshPath = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrimaryInfo", x => new { x.ClientNo, x.Created });
                });

            migrationBuilder.CreateTable(
                name: "SysIdEncode",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    XorNum = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SysIdEncode", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "web001",
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                schema: "web001",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                schema: "web001",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "web001",
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                schema: "web001",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CruxMember",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RegUserId = table.Column<int>(nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: false),
                    ExitDate = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 20, nullable: false),
                    No = table.Column<string>(maxLength: 10, nullable: false),
                    LoginNo = table.Column<string>(maxLength: 50, nullable: true),
                    SID = table.Column<string>(maxLength: 20, nullable: true),
                    Birth = table.Column<DateTime>(nullable: false),
                    Sex = table.Column<string>(maxLength: 1, nullable: true),
                    Weight = table.Column<float>(nullable: true),
                    Height = table.Column<float>(nullable: true),
                    Phones = table.Column<string>(maxLength: 200, nullable: true),
                    Addrs = table.Column<string>(maxLength: 500, nullable: true),
                    Email = table.Column<string>(maxLength: 100, nullable: true),
                    Note = table.Column<string>(maxLength: 200, nullable: true),
                    NotifyEmails = table.Column<string>(maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruxMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CruxMember_AspNetUsers_RegUserId",
                        column: x => x.RegUserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "TnTaskNotify",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    GId = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    UserId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: true),
                    Result = table.Column<string>(maxLength: 2000, nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    Complete = table.Column<DateTime>(nullable: true),
                    State = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TnTaskNotify", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TnTaskNotify_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TnUserNotify",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TnUserNotify", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TnUserNotify_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DefaultQtQueueTask",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    QueueId = table.Column<int>(nullable: false),
                    Content = table.Column<string>(maxLength: 5000, nullable: true),
                    Result = table.Column<string>(maxLength: 5000, nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    State = table.Column<short>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefaultQtQueueTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefaultQtQueueTask_DefaultQtQueue_QueueId",
                        column: x => x.QueueId,
                        principalSchema: "web001",
                        principalTable: "DefaultQtQueue",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CopdNote",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: false),
                    CreatorId = table.Column<int>(nullable: false),
                    MemberId = table.Column<int>(nullable: false),
                    Note = table.Column<string>(maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CopdNote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CopdNote_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CopdNote_CruxMember_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "web001",
                        principalTable: "CruxMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CopdScale",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: false),
                    MemberId = table.Column<int>(nullable: false),
                    Score_CAT = table.Column<int>(nullable: false),
                    State_CAT = table.Column<string>(maxLength: 10, nullable: true),
                    Score_mMRC = table.Column<int>(nullable: false),
                    Score_COPD = table.Column<int>(nullable: false),
                    Content = table.Column<string>(maxLength: 1000, nullable: true),
                    CalcDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CopdScale", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CopdScale_CruxMember_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "web001",
                        principalTable: "CruxMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CopdVideo",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: false),
                    FileId = table.Column<string>(maxLength: 50, nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    Url = table.Column<string>(maxLength: 100, nullable: true),
                    MemberId = table.Column<int>(nullable: true),
                    UpdaterId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CopdVideo", x => x.Id);
                    table.UniqueConstraint("AK_CopdVideo_FileId", x => x.FileId);
                    table.ForeignKey(
                        name: "FK_CopdVideo_CruxMember_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "web001",
                        principalTable: "CruxMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_CopdVideo_AspNetUsers_UpdaterId",
                        column: x => x.UpdaterId,
                        principalSchema: "web001",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "CruxMessage",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MemberId = table.Column<int>(nullable: false),
                    SubjectId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: true),
                    Content = table.Column<string>(maxLength: 4000, nullable: true),
                    SendTo = table.Column<string>(maxLength: 1000, nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    IsSuccess = table.Column<bool>(nullable: false),
                    Result = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruxMessage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CruxMessage_CruxMember_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "web001",
                        principalTable: "CruxMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CruxMessage_CruxMsgSubject_SubjectId",
                        column: x => x.SubjectId,
                        principalSchema: "web001",
                        principalTable: "CruxMsgSubject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CruxVs",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    QueueName = table.Column<int>(nullable: false),
                    DataType = table.Column<string>(maxLength: 20, nullable: true),
                    State = table.Column<int>(nullable: false),
                    CreationTime = table.Column<DateTime>(nullable: false),
                    MeasureTime = table.Column<DateTime>(nullable: true),
                    NextSendTime = table.Column<DateTime>(nullable: true),
                    EndTime = table.Column<DateTime>(nullable: true),
                    Content = table.Column<string>(maxLength: 2048, nullable: true),
                    Remark = table.Column<string>(maxLength: 100, nullable: true),
                    LastResult = table.Column<string>(maxLength: 2048, nullable: true),
                    MemberId = table.Column<int>(nullable: true),
                    CardNo = table.Column<string>(maxLength: 50, nullable: true),
                    DeviceNo = table.Column<string>(maxLength: 50, nullable: true),
                    VS_PK = table.Column<string>(maxLength: 50, nullable: true),
                    FromGateway = table.Column<string>(maxLength: 10, nullable: true),
                    IP = table.Column<string>(maxLength: 20, nullable: true),
                    V1 = table.Column<float>(nullable: true),
                    V2 = table.Column<float>(nullable: true),
                    V3 = table.Column<float>(nullable: true),
                    S1 = table.Column<string>(maxLength: 1, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruxVs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CruxVs_CruxMember_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "web001",
                        principalTable: "CruxMember",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobCron",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    JobId = table.Column<int>(nullable: false),
                    Cron = table.Column<string>(nullable: true),
                    LimitStart = table.Column<DateTime>(nullable: true),
                    LimitEnd = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobCron", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobResult",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    JobId = table.Column<int>(nullable: false),
                    State = table.Column<int>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: false),
                    Duration = table.Column<int>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: true),
                    HasException = table.Column<bool>(nullable: false),
                    Excetpion = table.Column<string>(maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobResult", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobInfo",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Title = table.Column<string>(maxLength: 100, nullable: true),
                    LastRun = table.Column<DateTime>(nullable: true),
                    NextRun = table.Column<DateTime>(nullable: true),
                    State = table.Column<int>(nullable: false),
                    IsDisable = table.Column<bool>(nullable: false),
                    LastResultId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobInfo_JobResult_LastResultId",
                        column: x => x.LastResultId,
                        principalSchema: "web001",
                        principalTable: "JobResult",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobStorage",
                schema: "web001",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Json = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobStorage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobStorage_JobInfo_Id",
                        column: x => x.Id,
                        principalSchema: "web001",
                        principalTable: "JobInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                schema: "web001",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "web001",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                schema: "web001",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                schema: "web001",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                schema: "web001",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "web001",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "web001",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CopdNote_Created",
                schema: "web001",
                table: "CopdNote",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_CopdNote_CreatorId",
                schema: "web001",
                table: "CopdNote",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_CopdNote_MemberId",
                schema: "web001",
                table: "CopdNote",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_CopdScale_Created",
                schema: "web001",
                table: "CopdScale",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_CopdScale_MemberId",
                schema: "web001",
                table: "CopdScale",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_CopdVideo_Created",
                schema: "web001",
                table: "CopdVideo",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_CopdVideo_MemberId",
                schema: "web001",
                table: "CopdVideo",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_CopdVideo_UpdaterId",
                schema: "web001",
                table: "CopdVideo",
                column: "UpdaterId");

            migrationBuilder.CreateIndex(
                name: "IX_CruxMember_LoginNo",
                schema: "web001",
                table: "CruxMember",
                column: "LoginNo",
                unique: true,
                filter: "[LoginNo] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CruxMember_No",
                schema: "web001",
                table: "CruxMember",
                column: "No",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CruxMember_RegUserId",
                schema: "web001",
                table: "CruxMember",
                column: "RegUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CruxMember_SID",
                schema: "web001",
                table: "CruxMember",
                column: "SID",
                unique: true,
                filter: "[SID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CruxMessage_MemberId",
                schema: "web001",
                table: "CruxMessage",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_CruxMessage_SubjectId",
                schema: "web001",
                table: "CruxMessage",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_CruxMsgSubject_Code",
                schema: "web001",
                table: "CruxMsgSubject",
                column: "Code",
                unique: true,
                filter: "[Code] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CruxVs_CreationTime",
                schema: "web001",
                table: "CruxVs",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_CruxVs_MemberId",
                schema: "web001",
                table: "CruxVs",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_CruxVs_VS_PK",
                schema: "web001",
                table: "CruxVs",
                column: "VS_PK",
                unique: true,
                filter: "[VS_PK] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CruxVs_EndTime_QueueName_NextSendTime",
                schema: "web001",
                table: "CruxVs",
                columns: new[] { "EndTime", "QueueName", "NextSendTime" });

            migrationBuilder.CreateIndex(
                name: "IX_DefaultQtQueueTask_QueueId",
                schema: "web001",
                table: "DefaultQtQueueTask",
                column: "QueueId");

            migrationBuilder.CreateIndex(
                name: "IX_JobCron_JobId",
                schema: "web001",
                table: "JobCron",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_JobInfo_LastResultId",
                schema: "web001",
                table: "JobInfo",
                column: "LastResultId");

            migrationBuilder.CreateIndex(
                name: "IX_JobResult_JobId",
                schema: "web001",
                table: "JobResult",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_TnTaskNotify_UserId",
                schema: "web001",
                table: "TnTaskNotify",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TnUserNotify_UserId",
                schema: "web001",
                table: "TnUserNotify",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobCron_JobInfo_JobId",
                schema: "web001",
                table: "JobCron",
                column: "JobId",
                principalSchema: "web001",
                principalTable: "JobInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobResult_JobInfo_JobId",
                schema: "web001",
                table: "JobResult",
                column: "JobId",
                principalSchema: "web001",
                principalTable: "JobInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobResult_JobInfo_JobId",
                schema: "web001",
                table: "JobResult");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CopdNote",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CopdScale",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CopdVideo",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CruxMessage",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CruxVs",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "DbVersion",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "DefaultQtQueueEvent",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "DefaultQtQueueTask",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "JobCron",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "JobStorage",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "PrimaryInfo",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "SysIdEncode",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "TnTaskNotify",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "TnUserNotify",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "AspNetRoles",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CruxMsgSubject",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "CruxMember",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "DefaultQtQueue",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "AspNetUsers",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "JobInfo",
                schema: "web001");

            migrationBuilder.DropTable(
                name: "JobResult",
                schema: "web001");
        }
    }
}
