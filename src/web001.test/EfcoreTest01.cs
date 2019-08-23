using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Data;

namespace web001.test
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
                var o1 = new SkOrder();
                o1.No = "123456789";
                o1.OrderDate = new DateTime(2019, 8, 1);
                o1.CustName = "David";               
                ctx.Add(o1);
                ctx.SaveChanges();

                var o2 = ctx.Set<SkOrder>().AsNoTracking().FirstOrDefault(x => x.No == "123456789");
                Assert.IsTrue(o2 != null);
                Assert.IsTrue(o2.Id == o1.Id);
            }             

            //update
            using (var ctx = CreateDbContext())
            {
                var o1 = ctx.Set<SkOrder>().FirstOrDefault(x => x.No == "123456789");
                o1.CustName = "David1";
                ctx.SaveChanges();

                var o2 = ctx.Set<SkOrder>().AsNoTracking().FirstOrDefault(x => x.No == "123456789");
                Assert.IsTrue(o2.CustName == o1.CustName);
            }

            //remove
            using (var ctx = CreateDbContext())
            {
                var o1 = ctx.Set<SkOrder>().FirstOrDefault(x => x.No == "123456789");
                ctx.Remove(o1);
                ctx.SaveChanges();

                var o2 = ctx.Set<SkOrder>().AsNoTracking().FirstOrDefault(x => x.No == "123456789");
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
                    var o1 = new SkOrder();
                    o1.No = "123456789";
                    o1.OrderDate = new DateTime(2019, 8, 1);
                    o1.CustName = "David";                 
                    ctx.Add(o1);

                    var o2 = new SkOrder();
                    o2.No = "123456789";
                    o2.OrderDate = new DateTime(2019, 8, 1);
                    o2.CustName = "David";                
                    ctx.Add(o2);

                    ctx.SaveChanges();

                }, "index dupliate exception");

                Assert.AreEqual(0, ctx.Set<SkOrder>().Count());
            }
        }


        public ApplicationDbContext CreateDbContext()
        {
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            builder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=web001;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new ApplicationDbContext(builder.Options);
        }

        void ClearAll()
        {
            using (var ctx = CreateDbContext())
            {
                foreach (var x in ctx.Set<SkOrder>())
                    ctx.Remove(x);
                ctx.SaveChanges();
            }
        }
    }
}
