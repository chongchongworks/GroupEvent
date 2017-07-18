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
            dirConfig["PaypalUrl"] = ConfigurationManager.AppSettings["PaypalUrl"].ToString();
            dirConfig["PaypalBusinessEmail"] = ConfigurationManager.AppSettings["PaypalBusinessEmail"].ToString();
            dirConfig["PaypalReturnUrl"] = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority +
                 HttpContext.Current.Request.ApplicationPath.TrimEnd('/') + "/" +
                 ConfigurationManager.AppSettings["PaypalReturnUrl"].ToString();
            dirConfig["PaypalCancelUrl"] = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority +
                HttpContext.Current.Request.ApplicationPath.TrimEnd('/') + "/" +
                ConfigurationManager.AppSettings["PaypalCancelUrl"].ToString();
            dirConfig["PaypalBusinessEmail"] = ConfigurationManager.AppSettings["PaypalBusinessEmail"].ToString();
            dirConfig["PaypalItemName"] = ConfigurationManager.AppSettings["PaypalItemName"].ToString();
            dirConfig["PaypalItemAmount"] = ConfigurationManager.AppSettings["PaypalItemAmount"].ToString();
            dirConfig["PaypalCurrencyCode"] = ConfigurationManager.AppSettings["PaypalCurrencyCode"].ToString();

            //the buyer's browser is redirected to the return URL by using the POST method, and all payment variables are included
            dirConfig["PaypalReturnMethod"] = ConfigurationManager.AppSettings["PaypalReturnMethod"].ToString();


            HttpResponseMessage msg = Request.CreateResponse<Dictionary<string, string>>(HttpStatusCode.OK, dirConfig);

            return msg;
        }
    }
}
