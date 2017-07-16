using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EventMvc.Models
{
    public class Customer
    {
        [Required]
        public string WechatName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string NumberOfPeople { get; set; }

        [Required]
        public string RealName { get; set; }

        [Required]
        [StringLength(10)]
        [Range(0,int.MaxValue, ErrorMessage ="Invalid")]
        public string Mobile { get; set; }

        [Required]
        public string Paid { get; set; }
        public string Desc { get; set; }

        [Required]
        public string Guid { get; set; }

        public string Accommodation { get; set; }
    }
}