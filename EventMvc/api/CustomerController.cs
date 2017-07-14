using EventMvc.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Xml;

namespace EventMvc.api
{
    public class CustomerController : ApiController
    {
        // GET: api/Customer
        [HttpGet]
        public IEnumerable<Customer> ListCustomer()
        {
            List<Customer> customers = new List<Customer>();

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(HttpContext.Current.Server.MapPath("~/App_Data/Customers.xml"));
            XmlNodeList customerNodes = xmlDoc.DocumentElement.SelectNodes("Customer");

            foreach (XmlNode node in customerNodes)
            {
                customers.Add(new Customer()
                {
                    Name = node.SelectSingleNode("Name").InnerText,
                    Email = node.SelectSingleNode("Email").InnerText,
                    NumberOfPeople = node.SelectSingleNode("NumberOfPeople").InnerText,
                    Mobile = node.SelectSingleNode("Mobile").InnerText,
                    RealName = node.SelectSingleNode("RealName").InnerText,
                    Paid = node.SelectSingleNode("Paid").InnerText,
                    Desc = node.SelectSingleNode("Desc").InnerText,
                    Guid = node.SelectSingleNode("Guid").InnerText,
                    //Accommodation = node.SelectSingleNode("Accommodation").InnerText
                });
            }

            if (customers == null || customers.Count() == 0)
                return null;
           

            return customers;
        }

        // POST: api/Customer
        [HttpPost]
        public HttpResponseMessage SaveCustomer(Customer customer)
        {
            //string errorMsg = string.Empty;
            bool isExisting = false;
            string userGuid = string.Empty;
            HttpResponseMessage msg = null;

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(HttpContext.Current.Server.MapPath("~/App_Data/Customers.xml"));

            XmlNode root = xmlDoc.DocumentElement;
            XmlNodeList customerNodes = xmlDoc.DocumentElement.SelectNodes("Customer");

            if (customerNodes.Count + Convert.ToInt32(customer.NumberOfPeople) > Convert.ToInt32(ConfigurationManager.AppSettings["MaximumCount"]))
            {
                //errorMsg = "对不起, 名额已满";
                msg = Request.CreateErrorResponse(HttpStatusCode.BadRequest, "对不起, 名额已满");
                return msg;
            }

            // detect if the customer already exists. If exists, remove it and add it with latest input
            foreach (XmlNode node in customerNodes)
            {
                // existing customer
                if (node.SelectSingleNode("Mobile").InnerText == customer.Mobile)
                {
                    isExisting = true;
                    userGuid = node.SelectSingleNode("Guid").InnerText;

                    // remove people if numberOfPeople is 0 and haven't paid
                    if (Convert.ToInt32(customer.NumberOfPeople) == 0 && !Convert.ToBoolean(node.SelectSingleNode("Paid").InnerText))
                        node.ParentNode.RemoveChild(node);
                    else if (Convert.ToBoolean(node.SelectSingleNode("Paid").InnerText))
                    {
                        msg = Request.CreateErrorResponse(HttpStatusCode.BadRequest, "对不起, 付款后信息不能更改");
                        return msg;
                    }
                    else
                    {
                        node.SelectSingleNode("Name").InnerText = customer.Name;
                        node.SelectSingleNode("Email").InnerText = customer.Email;

                        node.SelectSingleNode("RealName").InnerText = customer.RealName;
                        node.SelectSingleNode("Desc").InnerText = customer.Desc;
                        //node.SelectSingleNode("Accommodation").InnerText = accommodation;

                        //Not changing Paid status, unless specified
                        node.SelectSingleNode("Paid").InnerText = string.IsNullOrEmpty(customer.Paid) ? node.SelectSingleNode("Paid").InnerText : customer.Paid;

                        if (!Convert.ToBoolean(node.SelectSingleNode("Paid").InnerText))
                        {
                            node.SelectSingleNode("NumberOfPeople").InnerText = customer.NumberOfPeople;
                        }
                    }

                }

            }

            // new entry
            if (!isExisting)
            {


                XmlNode customerNode = xmlDoc.CreateElement("Customer");

                XmlNode nameElement = xmlDoc.CreateElement("Name");
                nameElement.InnerText = customer.Name;
                customerNode.AppendChild(nameElement);

                XmlNode emailElement = xmlDoc.CreateElement("Email");
                emailElement.InnerText = customer.Email;
                customerNode.AppendChild(emailElement);

                XmlNode numberElement = xmlDoc.CreateElement("NumberOfPeople");
                numberElement.InnerText = customer.NumberOfPeople;
                customerNode.AppendChild(numberElement);

                XmlNode realNameElement = xmlDoc.CreateElement("RealName");
                realNameElement.InnerText = customer.RealName;
                customerNode.AppendChild(realNameElement);

                XmlNode mobileElement = xmlDoc.CreateElement("Mobile");
                mobileElement.InnerText = customer.Mobile;
                customerNode.AppendChild(mobileElement);

                XmlNode paidElement = xmlDoc.CreateElement("Paid");
                paidElement.InnerText = "False";
                customerNode.AppendChild(paidElement);

                //XmlNode accomElement = xmlDoc.CreateElement("Accommodation");
                //accomElement.InnerText = accommodation;
                //customerNode.AppendChild(accomElement);


                XmlNode descElement = xmlDoc.CreateElement("Desc");
                descElement.InnerText = customer.Desc;
                customerNode.AppendChild(descElement);

                if (Convert.ToInt32(customer.NumberOfPeople) > 0)
                    root.AppendChild(customerNode);

                userGuid = Guid.NewGuid().ToString();
                XmlNode guidElement = xmlDoc.CreateElement("Guid");
                guidElement.InnerText = userGuid;
                customerNode.AppendChild(guidElement);

                customer.Guid = userGuid;
            }

            xmlDoc.Save(HttpContext.Current.Server.MapPath("~/App_Data/Customers.xml"));

            msg = Request.CreateResponse<Customer>(HttpStatusCode.OK, customer);
            return msg;
        }


        //// GET: api/Customer/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

       
        //// PUT: api/Customer/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/Customer/5
        //public void Delete(int id)
        //{
        //}
    }
}
