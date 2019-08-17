using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EfCore.Test.Data
{
    public class DmOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string No { get; set; }

        public DateTime OrdDate { get; set; }

        [Required]
        [MaxLength(10)]
        public string CustomName { get; set; }

        [MaxLength(50)]
        public string ToAddress { get; set; }
    }
}
