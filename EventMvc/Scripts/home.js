
//Load Customers
$(document).ready(function ()
{


    LoadCustomers();
    
});


//Bind PayPal button
$('#btnPayPal').click(function ()
{
    var result = validateInput();

    if (result == true)
    {
        var customer = SaveCustomer();
        if (typeof customer == 'undefined' || customer == null)
            return;

        var config = LoadConfig();
        if (config == undefined || config == null)
            return;

        //Post data to Paypal
        var xhr = new XMLHttpRequest();
        xhr.open("POST", config.PaypalUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            business: config.PaypalBusinessEmail,
            item_name: config.PaypalItemName,
            item_number: customer.Mobile,
            amount: config.PaypalItemAmount,
            quantity: customer.NumberOfPeople,
            currency_code: config.PaypalCurrencyCode,
            rm: config.PaypalReturnMethod,
            return: config.PaypalReturnUrl + "?guid=" + customer.Guid,
            cancel_return: config.PaypalCancelUrl
        }));
    }

});

//Bind submit button
$('#btnAdd').click(function ()
{
    var result = validateInput();

    if (result == true)
    {
        SaveCustomer();
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
function SaveCustomer()
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

    $.ajax({
        url: '../api/customer',
        type: 'post',
        data: JSON.stringify(customer),
        contentType: 'application/json',
        success: function (data)
        {
            customer.Guid = data.Guid;
            LoadCustomers();

            $('#spResult').text('Success');
            $('#spResult').addClass('message-success');

            
        },
        error: function (data)
        {
            var responseText = jQuery.parseJSON(data.responseText);
            $('#spResult').text('Failed - ' + responseText.Message);
            $('#spResult').addClass('message-error');
        }
    });

    return customer;
}

// Get Configuration
function LoadConfig()
{
    $.ajax({
        url: '../api/Config',
        type: 'get',
        success: function (data)
        {
            var config = {
                PaypalUrl: data.PaypalUrl,
                PaypalReturnUrl: data.PaypalReturnUrl,
                PaypalCancelUrl: data.PaypalCancelUrl,
                PaypalBusinessEmail: data.PaypalBusinessEmail,
                PaypalItemName: data.PaypalItemName,
                PaypalItemAmount: data.PaypalItemAmount,
                PaypalCurrencyCode: data.PaypalCurrencyCode,
                PaypalReturnMethod: data.PaypalReturnMethod
            };

            return config;
         
        },
        error: function (data)
        {
            alert('系统错误，请刷新以后，再试一次');
            return null;
        }

    });
}