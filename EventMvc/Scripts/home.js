

var getUrl = window.location;

// for web api url, include application path
var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

// if localhost, we don't want application path
if (getUrl.host.indexOf('localhost') >= 0)
    baseUrl = getUrl.protocol + "//" + getUrl.host + "/"

//Load Customers
$(document).ready(function ()
{
    LoadCustomers();
    renderPaypalButton();
});


function renderPaypalButton()
{
    var config = LoadConfig();
    if (config == undefined || config == null)
        return;

    paypal.Button.render({
        env: config.PaypalEnvironment, // sandbox | production

        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
        client: {
            sandbox: config.PaypalSandboxClientId,
            production: config.PaypalProductionClientId
        },

        // Show the buyer a 'Pay Now' button in the checkout flow
        commit: true,

        // payment() is called when the button is clicked
        payment: function (data, actions)
        {
            
            var result = validateInput();
            if (result == true)
            {
                var customer =
                   {
                       WechatName: $('#txtWechatName').val().trim(),
                       NumberOfPeople: $('#ddlNumberOfPeople').val(),
                       Email: $('#txtEmail').val().trim(),
                       RealName: $('#txtRealName').val().trim(),
                       Mobile: $('#txtMobile').val().trim(),
                       Desc: $('#txtDesc').val().trim(),
                       Paid: 'false',
                       Guid: null
                   };

                customer = SaveCustomer(customer, false, false);

                if (typeof customer == 'undefined' || customer == null || customer.NumberOfPeople == '0' || customer.Guid == null)
                    return false;



                var totalAmount = parseFloat(config.PaypalItemAmount).toFixed(2) * parseInt(customer.NumberOfPeople);

                // Make a call to the REST api to create the payment
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total: totalAmount, currency: config.PaypalCurrencyCode },
                                description: config.PaypalItemDescription
                            }
                        ]
                    }
                });
            }
            else
                return false;
        },

        // onAuthorize() is called when the buyer approves the payment
        onAuthorize: function (data, actions)
        {
           
            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then(function ()
            {
                var customer =
              {
                  WechatName: $('#txtWechatName').val().trim(),
                  NumberOfPeople: $('#ddlNumberOfPeople').val(),
                  Email: $('#txtEmail').val().trim(),
                  RealName: $('#txtRealName').val().trim(),
                  Mobile: $('#txtMobile').val().trim(),
                  Desc: $('#txtDesc').val().trim(),
                  Paid: 'true',
                  Guid: null
              };
               SaveCustomer(customer, true, true);
            });
        },
        
        onError: function (err)
        {
            // Show an error page here, when an error occurs
            alert('Paypal Error');
          
        }
    }, '#paypal-button');

}



//Bind submit button
$('#btnAdd').click(function ()
{
    var result = validateInput();

    if (result == true)
    {
        var customer =
                {
                    WechatName: $('#txtWechatName').val().trim(),
                    NumberOfPeople: $('#ddlNumberOfPeople').val(),
                    Email: $('#txtEmail').val().trim(),
                    RealName: $('#txtRealName').val().trim(),
                    Mobile: $('#txtMobile').val().trim(),
                    Desc: $('#txtDesc').val().trim(),
                    Paid: 'false',
                    Guid: null
                };
        SaveCustomer(customer, true,true);
    }

});

//Validate Input
function validateInput()
{
    var result = true;
 
    // Wechat name
    if ($('#txtWechatName').val().trim().length == 0)
    {
        $('#spWechatNameError').text('Required');
        result = false;
    }
    else
    {
        $('#spWechatNameError').text('');
    }

    // Email 
    if ($('#txtEmail').val().trim().length > 0)
    {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (regex.test($('#txtEmail').val().trim()))
        {
            $('#spEmailError').text('');
        }
        else
        {
            $('#spEmailError').text('Invalid');
            result = false;
        }
    }

    // Real Name
    if ($('#txtRealName').val().trim().length == 0)
    {
        $('#spRealNameError').text('Required');
        result = false;
    }
    else
    {
        $('#spRealNameError').text('');
    }

    //mobile
    if ($('#txtMobile').val().trim().length == 0)
    {
        $('#spMobileError').text('Required');
        result = false;
    }
    else
    {
        var regex = /^04[0-9]{8}$/;
        if (!regex.test($('#txtMobile').val().trim()))
        {
            $('#spMobileError').text('Invalid');
            result = false;
        }
        else
        {
            $('#spMobileError').text('');
        }
    }


    return result;
}

//Load Customers
function LoadCustomers()
{
    var count = 0;
    var paidCount = 0;

    $.ajax({
        url: baseUrl+ '/api/customer',
        type: 'get',
        success: function (data)
        {
            // clear customer list before a fresh load
            $('#divCustomerList').empty();

            for (var i = 0; i < data.length; i++)
            {
                if (data[i].Paid.toLowerCase() == 'true')
                {
                    $('#divCustomerList').append(
                        '<div class="col-xs-4 border green-backgroup ">' +
                             data[i].WechatName + '(*' + data[i].NumberOfPeople + ')' +
                        '</div>'
                        );
                    paidCount = paidCount + parseInt(data[i].NumberOfPeople);
                }
                else
                {
                    $('#divCustomerList').append(
                       '<div class="col-xs-4 border grey-backgroup">' +
                           data[i].WechatName + '(*' + data[i].NumberOfPeople + ')' +
                       '</div>'
                       );
                }
                count = count + parseInt(data[i].NumberOfPeople);
            }

        
            $('#spCount').text(count.toString());
            $('#spPaidCount').text(paidCount.toString());
        },
        error: function (data)
        {
            alert('系统错误，请刷新以后，再试一次');
        }

    });

}

//Save Customer
function SaveCustomer(customer,isAsync,showSuccessMessage)
{
    

    $.ajax({
        url: baseUrl + '/api/customer',
        type: 'post',
        async: isAsync,
        data: JSON.stringify(customer),
        contentType: 'application/json',
        success: function (data)
        {
            customer.Guid = data.Guid;
            LoadCustomers();

            if (showSuccessMessage == true)
            {
                $('#spResult').text('Success');
                $('#spResult').addClass('message-success');
                alert('SUCCESS');
            }
            
        },
        error: function (data)
        {
            var responseText = jQuery.parseJSON(data.responseText);
            $('#spResult').text('Failed - ' + responseText.Message);
            $('#spResult').addClass('message-error');
            alert('Failed - ' + responseText.Message);
        }
    });

    return customer;
}

// Get Configuration
function LoadConfig()
{
    var config = null;

    $.ajax({
        url: baseUrl+'/api/config',
        type: 'get',
        async:false,
        success: function (data)
        {
            config = {
                PaypalItemAmount: data.PaypalItemAmount,
                PaypalCurrencyCode: data.PaypalCurrencyCode,
                PaypalEnvironment: data.PaypalEnvironment,
                PaypalSandboxClientId: data.PaypalSandboxClientId,
                PaypalProductionClientId: data.PaypalProductionClientId,
                PaypalItemDescription: data.PaypalItemDescription
            };
        },
        error: function (data)
        {
            alert('系统错误，请刷新以后，再试一次');
        }

    });
     
    return config;
}

