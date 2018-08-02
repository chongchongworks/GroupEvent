using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace EventMvc.api
{
    public class ConfigController : ApiController
    {

        // GET: api/Config
        [HttpGet]
        public HttpResponseMessage LoadConfig()
        {
            Dictionary<string, string> dirConfig = new Dictionary<string, string>();
           
            dirConfig["PaypalItemAmount"] = ConfigurationManager.AppSettings["PaypalItemAmount"].ToString();
            dirConfig["PaypalCurrencyCode"] = ConfigurationManager.AppSettings["PaypalCurrencyCode"].ToString();
            dirConfig["PaypalEnvironment"] = ConfigurationManager.AppSettings["PaypalEnvironment"].ToString();
            dirConfig["PaypalSandboxClientId"] = ConfigurationManager.AppSettings["PaypalSandboxClientId"].ToString();
            dirConfig["PaypalProductionClientId"] = ConfigurationManager.AppSettings["PaypalProductionClientId"].ToString();
            dirConfig["PaypalItemDescription"] = ConfigurationManager.AppSettings["PaypalItemDescription"].ToString();

            ////the buyer's browser is redirected to the return URL by using the POST method, and all payment variables are included
            //dirConfig["PaypalReturnMethod"] = ConfigurationManager.AppSettings["PaypalReturnMethod"].ToString();

            

            HttpResponseMessage msg = Request.CreateResponse<Dictionary<string, string>>(HttpStatusCode.OK, dirConfig);

            return msg;
        }


        [HttpPost]
        public HttpResponseMessage CheckPassword(string inputPassword)
        {
            HttpResponseMessage msg = null;
            string password = ConfigurationManager.AppSettings["ReportPassword"].ToString();

            if (inputPassword.Equals(password))
            {
                msg = Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                msg = Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid Password");
            }
            return msg;
        }
    }
}
