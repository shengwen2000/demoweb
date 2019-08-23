using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace System.Linq
{
    /// <summary>
    /// For Linq Extension
    /// </summary>
    static public class SystemLinqExt
    {
        /// <summary>
        /// 當條件成立時，追加Ｗhere條件
        /// </summary>     
        /// <param name="enable">啟用where?</param>
        /// <param name="predicate">Where條件</param>
        /// <returns></returns>
        static public IQueryable<T> WhereIf<T>(this IQueryable<T> source, bool enable, Expression<Func<T, bool>> predicate)
        {
            if (enable)
                return source.Where(predicate);
            else
                return source;
        }

        /// <summary>
        /// 當條件成立時，追加Ｗhere條件
        /// </summary>     
        /// <param name="enable">啟用Where?</param>
        /// <param name="predicate">Where條件</param>
        /// <returns></returns>
        static public IEnumerable<T> WhereIf<T>(this IEnumerable<T> source, bool enable, Func<T, bool> predicate)
        {
            if (enable)
                return source.Where(predicate);
            else
                return source;
        }

        /*
        *  //(a==1 || b == 2 || c == 3) and (d==1 || e==2)	
           .WhereDynamic(u => {

               var expr1 = u.NewExpr();

               expr1.Or(x => x.a == 1);
               expr1.Or(x => x.b == 2);
               expr1.Or(x => x.c == 3);

               var expr2= u.NewExpr();

               expr2.Or(x => x.d == 1);
               expr2.Or(x => x.e == 2);

               var expr3 = u.NewExpr();
               expr3.And(expr1);
               expr3.And(expr2);
               return expr3;		
           })
        */

        /// <summary>
        /// 動態的Where條件式，適用於很複雜的條件組合。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="dynexpr">動態條件陳述</param>
        /// <returns></returns>
        static public IQueryable<T> WhereDynamic<T>(this IQueryable<T> source, Func<ExprHelper<T>, Expr<T>> dynexpr)
        {
            var helper = new ExprHelper<T>();
            var expr = dynexpr(helper);

            //no expression
            if (expr == null || expr.Body == null)
                return source;

            //資料項目參數
            var dataparam = Expression.Parameter(typeof(T), "_x_");

            //整個語法樹轉換為 C# Expression
            Expression convertToExpression(ExprNode<T> node)
            {
                switch (node.Kind)
                {
                    //value
                    case 1:
                        return node.Value;
                    //or
                    case 2:
                    case 3:
                        {
                            var expr1 = convertToExpression(node.Left);
                            var expr2 = convertToExpression(node.Right);

                            Expression cexpr1 = expr1;
                            //Lambda x => x.Price > 500 只取　x.Price > 500
                            //並將參數統一換成唯一的
                            if (expr1.NodeType == ExpressionType.Lambda)
                            {
                                var v1 = expr1 as Expression<Func<T, bool>>;
                                var v2 = new ParameterReplacer(v1.Parameters[0], dataparam).Visit(v1) as Expression<Func<T, bool>>;
                                cexpr1 = v2.Body;
                            }

                            Expression cexpr2 = expr2;
                            //Lambda x => x.Price > 500 只取　x.Price > 500
                            //並將參數統一換成唯一的
                            if (expr2.NodeType == ExpressionType.Lambda)
                            {
                                var v1 = expr2 as Expression<Func<T, bool>>;
                                var v2 = new ParameterReplacer(v1.Parameters[0], dataparam).Visit(v1) as Expression<Func<T, bool>>;
                                cexpr2 = v2.Body;
                            }

                            //or
                            if (node.Kind == 2)
                                return Expression.OrElse(cexpr1, cexpr2);
                            //and
                            else
                                return Expression.AndAlso(cexpr1, cexpr2);
                        }
                }
                throw new NotImplementedException();
            }

            var expr_result = convertToExpression(expr.Body);

            //已經是Lambda
            if (expr_result.NodeType == ExpressionType.Lambda)
                return source.Where(expr_result as Expression<Func<T, bool>>);

            //為And節點 | Or節點 轉換為Lambda        
            return source.Where(Expression.Lambda<Func<T, bool>>(expr_result, dataparam));
        }

        /// <summary>
        /// 動態的Where條件式，適用於很複雜的條件組合。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="dynexpr"></param>
        /// <returns></returns>
        static public IEnumerable<T> WhereDynamic<T>(this IEnumerable<T> source, Func<ExprHelper<T>, Expr<T>> dynexpr)
        {
            var helper = new ExprHelper<T>();
            var expr = dynexpr(helper);

            //no expression
            if (expr == null || expr.Body == null)
                return source;

            //資料項目參數
            var dataparam = Expression.Parameter(typeof(T), "_x_");

            //整個語法樹轉換為 C# Expression
            Expression convertToExpression(ExprNode<T> node)
            {
                switch (node.Kind)
                {
                    //value
                    case 1:
                        return node.Value;
                    //or
                    case 2:
                    case 3:
                        {
                            var expr1 = convertToExpression(node.Left);
                            var expr2 = convertToExpression(node.Right);

                            Expression cexpr1 = expr1;
                            //Lambda x => x.Price > 500 只取　x.Price > 500
                            //並將參數統一換成唯一的
                            if (expr1.NodeType == ExpressionType.Lambda)
                            {
                                var v1 = expr1 as Expression<Func<T, bool>>;
                                var v2 = new ParameterReplacer(v1.Parameters[0], dataparam).Visit(v1) as Expression<Func<T, bool>>;
                                cexpr1 = v2.Body;
                            }

                            Expression cexpr2 = expr2;
                            //Lambda x => x.Price > 500 只取　x.Price > 500
                            //並將參數統一換成唯一的
                            if (expr2.NodeType == ExpressionType.Lambda)
                            {
                                var v1 = expr2 as Expression<Func<T, bool>>;
                                var v2 = new ParameterReplacer(v1.Parameters[0], dataparam).Visit(v1) as Expression<Func<T, bool>>;
                                cexpr2 = v2.Body;
                            }

                            //or
                            if (node.Kind == 2)
                                return Expression.OrElse(cexpr1, cexpr2);
                            //and
                            else
                                return Expression.AndAlso(cexpr1, cexpr2);
                        }
                }
                throw new NotImplementedException();
            }

            var expr_result = convertToExpression(expr.Body);

            //已經是Lambda 
            //x => x.a == 1
            if (expr_result.NodeType == ExpressionType.Lambda)
                return source.Where((expr_result as Expression<Func<T, bool>>).Compile());

            //為And節點 | Or節點 轉換為Lambda
            // x.a ==1 || x.b == 2 
            var predicate = Expression.Lambda<Func<T, bool>>(expr_result, dataparam);
            return source.Where(predicate.Compile());
        }

        /// <summary>
        /// 將參數由A取代為B
        /// </summary>
        class ParameterReplacer : ExpressionVisitor
        {
            private readonly ParameterExpression _pa;
            private readonly ParameterExpression _pb;

            /// <summary>
            /// 將參數由A取代為B
            /// </summary>
            /// <param name="pa">參數A</param>
            /// <param name="pb">參數B</param>
            internal ParameterReplacer(ParameterExpression pa, ParameterExpression pb)
            {
                _pa = pa;
                _pb = pb;
            }

            protected override Expression VisitParameter
                (ParameterExpression node)
            {
                if (node == _pa)
                    return _pb;
                return node;
            }
        }

        /// <summary>
        /// Helper for Expression
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public class ExprHelper<T>
        {
            /// <summary>
            /// 建立新的陳述式
            /// </summary>
            /// <returns></returns>
            public Expr<T> NewExpr()
            {
                return new Expr<T>();
            }

            /// <summary>
            /// 建立新的陳述式
            /// </summary>
            /// <returns></returns>
            public Expr<T> NewExpr(Expression<Func<T, bool>> predicate)
            {
                return new Expr<T>(predicate);
            }
        }

        /// <summary>
        /// 陳述式容器
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public class Expr<T>
        {
            /// <summary>
            /// 陳述式樹狀節點
            /// </summary>
            public ExprNode<T> Body { get; set; }

            public Expr()
            {                
            }

            public Expr(Expression<Func<T, bool>> predicate)
            {
                Body = new ExprNode<T> { Kind = 1, Value = predicate };
            }

            /// <summary>
            /// 增加Or條件
            /// </summary>
            /// <param name="predicate"></param>
            public Expr<T> Or(Expression<Func<T, bool>> predicate)
            {
                if (Body == null)
                {
                    Body = new ExprNode<T> { Kind = 1, Value = predicate };
                }
                else
                {
                    var node = new ExprNode<T> { Kind = 1, Value = predicate };
                    Body = new ExprNode<T> { Kind = 2, Left = Body, Right = node };
                }
                return this;
            }

            /// <summary>
            /// 增加Or條件
            /// </summary>
            /// <param name="expr"></param>
            public Expr<T> Or(Expr<T> expr)
            {
                if (Body == null)
                {
                    Body = expr.Body;
                }
                else
                {
                    Body = new ExprNode<T> { Kind = 2, Left = Body, Right = expr.Body };
                }
                return this;
            }

            /// <summary>
            /// 增加And條件
            /// </summary>
            /// <param name="predicate"></param>
            public Expr<T> And(Expression<Func<T, bool>> predicate)
            {
                if (Body == null)
                {
                    Body = new ExprNode<T> { Kind = 1, Value = predicate };
                }
                else
                {
                    var node = new ExprNode<T> { Kind = 1, Value = predicate };
                    Body = new ExprNode<T> { Kind = 3, Left = Body, Right = node };
                }
                return this;
            }

            /// <summary>
            /// 增加And條件
            /// </summary>
            /// <param name="expr"></param>
            public Expr<T> And(Expr<T> expr)
            {
                if (Body == null)
                {
                    Body = expr.Body;
                }
                else
                {
                    Body = new ExprNode<T> { Kind = 3, Left = Body, Right = expr.Body };
                }
                return this;
            }
        }

        /// <summary>
        ///  陳述式樹狀節點
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public class ExprNode<T>
        {
            /// <summary>           
            /// 1: value(predicate)
            /// 2: or
            /// 3: and
            /// </summary>
            public int Kind { get; set; }

            /// <summary>
            /// Left Node
            /// </summary>
            public ExprNode<T> Left { get; set; }

            /// <summary>
            /// Right Node
            /// </summary>
            public ExprNode<T> Right { get; set; }

            /// <summary>
            /// The Node Value
            /// </summary>
            public Expression<Func<T, bool>> Value { get; set; }
        }
       

        /// <summary>
        /// Table(Outer) Left join Table(Inner) by One to Many|Zero
        /// </summary>    
        /// <param name="outerKeySelector"></param>
        /// <param name="innerKeySelector"></param>
        /// <param name="resultSelector"></param>
        /// <returns></returns>
        static public IQueryable<TResult> LeftJoin<TOuter, TInner, TKey, TResult>(this IQueryable<TOuter> outer, IQueryable<TInner> inner, Expression<Func<TOuter, TKey>> outerKeySelector, Expression<Func<TInner, TKey>> innerKeySelector, Expression<Func<JoinResult<TOuter, TInner>, TResult>> resultSelector)
        {
            return outer
                .GroupJoin(inner, outerKeySelector, innerKeySelector, (a, bb) => new { a, bb })
                .SelectMany(x => x.bb.DefaultIfEmpty(), (x, b) => new JoinResult<TOuter, TInner> { Outer = x.a, Inner = b })
                .Select(resultSelector)
                ;
        }

        /// <summary>
        /// Table(Outer) Left join Table(Inner) by One to Many|Zero
        /// </summary>    
        /// <param name="outerKeySelector"></param>
        /// <param name="innerKeySelector"></param>
        /// <param name="resultSelector"></param>
        /// <returns></returns>
        static public IEnumerable<TResult> LeftJoin<TOuter, TInner, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<JoinResult<TOuter,TInner>, TResult> resultSelector)
        {
            return outer
                .GroupJoin(inner, a => outerKeySelector(a), b => innerKeySelector(b), (a, bb) => new { a, bb })
                .SelectMany(x => x.bb.DefaultIfEmpty(), (x, b) => new JoinResult<TOuter, TInner> { Outer = x.a, Inner = b })
                .Select(resultSelector)
                ;
        }

        /// <summary>
        /// Join Result
        /// </summary>
        /// <typeparam name="TOuter"></typeparam>
        /// <typeparam name="TInner"></typeparam>
        public class JoinResult<TOuter, TInner>
        {
            public TOuter Outer { get; set; }
            public TInner Inner { get; set; }
        }

        ///// <summary>
        ///// Table(Outer) Left join Table(Inner) by One to One|Zero
        ///// 應該效率會較好，在數據源是一對一或一對零的情況
        ///// </summary>    
        ///// <param name="outerKeySelector"></param>
        ///// <param name="innerKeySelector"></param>
        ///// <param name="resultSelector"></param>
        ///// <returns></returns>
        //static public IQueryable<TResult> LeftJoinOne<TOuter, TInner, TKey, TResult>(this IQueryable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, TInner, TResult> resultSelector)
        //{
        //    return outer
        //        .GroupJoin(inner, a => outerKeySelector(a), b => innerKeySelector(b), (a, bb) => resultSelector(a, bb.FirstOrDefault()))
        //        ;
        //}

        ///// <summary>
        ///// Table(Outer) Left join Table(Inner) by One to One|Zero        
        ///// </summary>    
        ///// <param name="outerKeySelector"></param>
        ///// <param name="innerKeySelector"></param>
        ///// <param name="resultSelector"></param>
        ///// <returns></returns>
        //static public IEnumerable<TResult> LeftJoinOne<TOuter, TInner, TKey, TResult>(this IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, TInner, TResult> resultSelector)
        //{
        //    return outer
        //        .GroupJoin(inner, a => outerKeySelector(a), b => innerKeySelector(b), (a, bb) => resultSelector(a, bb.FirstOrDefault()))
        //        ;
        //}

    }
}
