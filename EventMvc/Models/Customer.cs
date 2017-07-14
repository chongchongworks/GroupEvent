using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventMvc.Models
{
    public class Customer
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string NumberOfPeople { get; set; }
        public string RealName { get; set; }
        public string Mobile { get; set; }
        public string Paid { get; set; }
        public string Desc { get; set; }
        public string Guid { get; set; }

        public string Accommodation { get; set; }
    }
}