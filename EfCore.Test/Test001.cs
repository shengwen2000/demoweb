using EfCore.Test.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace EfCore.Test
{
    [TestClass]
    public class Test001
    {
        [TestMethod]
        public void TestCRUD()
        {
            ClearAll();

            //insert new
            using (var ctx = CreateDbContext())
            {
                var o1 = new DmOrder();
                o1.No = "123456789";
                o1.OrdDate = new DateTime(2019, 8, 1);
                o1.CustomName = "David";
                o1.ToAddress = "kaohsiung";
                ctx.Add(o1);
                ctx.SaveChanges();

                var o2 = ctx.Set<DmOrder>().FirstOrDefault(x => x.No == "123456789");
                Assert.IsTrue(o2 != null);
                Assert.IsTrue(o2.Id == o1.Id);
            }

            //update
            using (var ctx = CreateDbContext())
            {
                var o1 = ctx.Set<DmOrder>().FirstOrDefault(x => x.No == "123456789");
                o1.ToAddress = "tainai";
                ctx.SaveChanges();

                var o2 = ctx.Set<DmOrder>().FirstOrDefault(x => x.No == "123456789");
                Assert.IsTrue(o2.ToAddress == o1.ToAddress);
            }

            //remove
            using (var ctx = CreateDbContext())
            {
                var o1 = ctx.Set<DmOrder>().FirstOrDefault(x => x.No == "123456789");
                ctx.Remove(o1);
                ctx.SaveChanges();

                var o2 = ctx.Set<DmOrder>().FirstOrDefault(x => x.No == "123456789");
                Assert.IsTrue(o2 == null);
            }
        }


        [TestMethod]
        public void TestIndexDuplicate()
        {
            ClearAll();
           
            using (var ctx = CreateDbContext())
            {
                Assert.ThrowsException<DbUpdateException>(() => {
                    var o1 = new DmOrder();
                    o1.No = "123456789";
                    o1.OrdDate = new DateTime(2019, 8, 1);
                    o1.CustomName = "David";
                    o1.ToAddress = "kaohsiung";
                    ctx.Add(o1);

                    var o2 = new DmOrder();
                    o2.No = "123456789";
                    o2.OrdDate = new DateTime(2019, 8, 1);
                    o2.CustomName = "David";
                    o2.ToAddress = "kaohsiung";
                    ctx.Add(o2);

                    ctx.SaveChanges();

                }, "index dupliate exception");

                Assert.AreEqual(0, ctx.Set<DmOrder>().Count());
            }
        }


        public AppDbContext CreateDbContext()
        {
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=efcoretest;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new AppDbContext(builder.Options);
        }

        void ClearAll()
        {
            using (var ctx = CreateDbContext())
            {
                foreach (var x in ctx.Set<DmOrder>())
                    ctx.Remove(x);
                ctx.SaveChanges();
            }
        }
    }
}
