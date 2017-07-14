
$(document).ready(function ()
{
    var count = 0;
    var paidCount = 0;

    $.ajax({
        url: '../api/customer',
        type: 'get',
        success: function (data)
        {
            for (var i = 0; i < data.length; i++)
            {
                if (data[i].Paid.toLowerCase() == 'true')
                {
                    $('#divCustomerList').append(
                        '<div class="col-xs-4 paid-backgroup">' +
                             data[i].Name + '(*'+data[i].NumberOfPeople  +')' +
                        '</div>'
                        );
                    paidCount = paidCount + parseInt(data[i].NumberOfPeople);
                }
                else
                {
                    $('#divCustomerList').append(
                       '<div class="col-xs-4 dl-item">' +
                           data[i].Name +'(*'+data[i].NumberOfPeople  +')' +
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
            alert('error');
        }

    })

})