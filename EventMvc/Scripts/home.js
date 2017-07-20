
//Load Customers
$(document).ready(function ()
{


    LoadCustomers();
    
    
    renderPaypalButton();
});


function renderPaypalButton()
{
    paypal.Button.render({
        env: 'sandbox', // sandbox | production

        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
        client: {
            sandbox: 'Ab7vejfykFlYEiAOt8_I6ZWTL8YOu_nUV1vRQLIGOOa3GDololwx4uQTYyOwgzrzOFFhVSVWD49k8pvv',
            production: 'AUBpXrl_17wXu_-BS9CXYDe4GIWYEUdx_V9Kt2hPpcagFXEEE_30nPv4ywXlXoO77nhTNAltXm_kOpKs'
        },

        // Show the buyer a 'Pay Now' button in the checkout flow
        commit: true,

        // payment() is called when the button is clicked
        payment: function (data, actions)
        {
            var customer =
                {
                    WechatName: $('#txtWechatName').val().trim(),
                    NumberOfPeople: $('#ddlNumberOfPeople').val(),
                    Email: $('#txtEmail').val().trim(),
                    RealName: $('#txtRealName').val().trim(),
                    Mobile: $('#txtMobile').val().trim(),
                    Desc: $('#txtDesc').val().trim(),
                    Paid: false,
                    Guid: null
                };

            var result = validateInput();
            if (result == true)
            {
                var customer = SaveCustomer(customer, false, false);

                if (typeof customer == 'undefined' || customer == null || customer.NumberOfPeople=='0' || customer.Guid==null)
                    return;

                var config = LoadConfig();
                if (config == undefined || config == null)
                    return;

                var totalAmount = parseFloat(config.PaypalItemAmount).toFixed(2) * parseInt(customer.NumberOfPeople);

                // Make a call to the REST api to create the payment
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total: totalAmount, currency: 'AUD' }
                            }
                        ]
                    }
                });
            }
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
                  Paid: true,
                  Guid: null
              };
                SaveCustomer(customer, true, true);
            });
        },
        
        onError: function (err)
        {
            // Show an error page here, when an error occurs
            alert(err.message);
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
                    Paid: false,
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
        url: '../api/customer',
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
                        '<div class="col-xs-4 paid-backgroup">' +
                             data[i].WechatName + '(*' + data[i].NumberOfPeople + ')' +
                        '</div>'
                        );
                    paidCount = paidCount + parseInt(data[i].NumberOfPeople);
                }
                else
                {
                    $('#divCustomerList').append(
                       '<div class="col-xs-4 dl-item">' +
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
        url: '../api/customer',
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
        url: '../api/config',
        type: 'get',
        async:false,
        success: function (data)
        {
            config  = {
                PaypalUrl: data.PaypalUrl,
                PaypalReturnUrl: data.PaypalReturnUrl,
                PaypalCancelUrl: data.PaypalCancelUrl,
                PaypalBusinessEmail: data.PaypalBusinessEmail,
                PaypalItemName: data.PaypalItemName,
                PaypalItemAmount: data.PaypalItemAmount,
                PaypalCurrencyCode: data.PaypalCurrencyCode,
                PaypalReturnMethod: data.PaypalReturnMethod
            };

            
        },
        error: function (data)
        {
            alert('系统错误，请刷新以后，再试一次');
        }

    });
     
    return config;
}