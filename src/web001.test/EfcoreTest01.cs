using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
                    ctx.SaveChanges();

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
        
        void SampleData()
        {
            using (var ctx = CreateDbContext())
            {
                var p1 = new SkProduct();
                p1.Code = "P01";
                p1.EnableDate = DateTime.Today;
                p1.IsEnable = true;
                p1.MemberPrice = 100;
                p1.Name = "P01 Product";
                p1.Price = 120;
                ctx.Add(p1);

                var p2 = new SkProduct();
                p2.Code = "P02";
                p2.EnableDate = DateTime.Today;
                p2.IsEnable = true;
                p2.MemberPrice = 500;
                p2.Name = "P02 Product";
                p2.Price = 520;
                ctx.Add(p2);


                var o1 = new SkOrder();
                o1.No = "123456789";
                o1.OrderDate = new DateTime(2019, 8, 1);
                o1.CustName = "David";
                ctx.Add(o1);

                {
                    var d1 = new SkOrdItem();
                    d1.Order = o1;
                    d1.Product = p1;
                    d1.Qty = 1;
                    d1.UnitPrice = p1.Price;
                    d1.TotalPrice = d1.Qty * d1.UnitPrice;
                    ctx.Add(d1);
                }

                {
                    var d1 = new SkOrdItem();
                    d1.Order = o1;
                    d1.Product = p2;
                    d1.Qty = 3;
                    d1.UnitPrice = p2.Price;
                    d1.TotalPrice = d1.Qty * d1.UnitPrice;
                    ctx.Add(d1);
                }

                ctx.SaveChanges();
            }

        }

        [TestMethod]
        public void Test01()
        {
            //SampleData();

            using (var ctx = CreateDbContext())
            {
                var m1 = new SkMember();
                m1.Addr = "taiwan";
                m1.Birth = new DateTime(1999, 1, 1);
                m1.Email = "abc@gmail.com";
                m1.EntryDate = DateTime.Today;
                m1.Name = "Mary";
                m1.No = "M101";
                m1.Phone = "0911330939";
                ctx.Add(m1);
                ctx.SaveChanges();

                var o1 = new SkOrder();
                o1.No = "123456001";
                o1.OrderDate = new DateTime(2019, 8, 1);
                o1.CustName = "Mary";
                o1.Member = m1;
                ctx.Add(o1);

                {


                    var d1 = new SkOrdItem();
                    d1.Order = o1;
                    d1.ProductId = 1;
                    d1.Qty = 1;
                    d1.UnitPrice = 120;
                    d1.TotalPrice = d1.Qty * d1.UnitPrice;
                    ctx.Add(d1);
                }

                {
                    var d1 = new SkOrdItem();
                    d1.Order = o1;
                    d1.ProductId = 2;
                    d1.Qty = 3;
                    d1.UnitPrice = 520;
                    d1.TotalPrice = d1.Qty * d1.UnitPrice;
                    ctx.Add(d1);
                }
                ctx.SaveChanges();
            }
        }

        [TestMethod]
        public void Test02()
        {
            using (var ctx = CreateDbContext())
            {
                var vv1 = ctx.Set<SkOrder>().AsNoTracking()
                  .Select(x => new
                  {
                      x.Id,
                      x.CustName,
                      x.Member.Name
                  })
                  ;

                var qname = "david";
                var nos = new[] { 9 };

                var vv = ctx.Set<SkOrder>().AsNoTracking()        
                    .Where(x => nos.Contains(x.Id))
                    //.Where(x => x.CustName.Contains(qname))
                    .WhereIf(qname.IsTrue(), x => x.CustName.Contains(qname))
                    .Select(x => new
                    {
                        x.Id,
                        x.CustName,
                        x.Member.Name
                    })
                    .AsEnumerable()
                    .Select(x => new {
                        x.Id, x.Name, x.CustName
                    })

                    ;

                foreach(var v in vv)
                {
                    
                }
            }
        }

        public string Name { get; set; }

        [TestMethod]
        public void Test03()
        {
            {
                var txt = "123";

                void hello(string a)
                {
                    var a1= txt;
                }


                var tt = new[] { "1", "2", "3" };
                foreach(var t in tt)
                {
                    hello(t);
                }
            }

            {
                Action<string> a;
                a = x => { };
            }
            {
               Func<string, string> a;

                a = (x) => "123";

                var b = a("12");

            }
            {
                Expression<Func<string>> a;

                a = () => Name;

                
            }
            

        }


    }
}
